import { parseQuickEntryCurrency } from "./parsers/parse-currency"
import { normalizeFieldKey } from "./parsers/normalize-field-key"
import { parseQuickEntryNumber } from "./parsers/parse-number"
import { parseReportDate } from "./parsers/parse-report-date"
import {
    getQuickEntrySchema,
    getQuickEntrySchemaLabels,
    QUICK_ENTRY_SCHEMAS,
    REPORT_TYPE_ALIASES,
} from "./report-schema-registry"
import type {
    CreateReportCommandResult,
    ParsedQuickEntryResult,
    ParseQuickEntryInputArgs,
    QuickEntryFieldDefinition,
    QuickEntryParseResult,
    QuickEntryReportSchema,
    QuickEntrySubmitPayload,
    ReportDraft,
} from "./quick-entry-types"

const CREATE_COMMAND_PATTERN = /^\/create(?:\s+(.+))?$/i

function normalizeToken(value: string) {
    return value.trim().toLowerCase().replace(/[_\s-]+/g, " ")
}

function compactPayload(payload: Record<string, unknown>) {
    return Object.fromEntries(
        Object.entries(payload).filter(([, value]) => value !== undefined)
    )
}

function hasValue(value: unknown) {
    if (value === undefined || value === null) return false
    if (typeof value === "string") return value.trim().length > 0
    return true
}

function escapeRegex(value: string) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

function getFieldCandidates(field: QuickEntryFieldDefinition) {
    return [
        field.key,
        field.label,
        ...(field.aliases ?? []),
    ].filter(Boolean)
}

function createEmptyParsedResult(isCommand = false): ParsedQuickEntryResult {
    return {
        updates: {},
        displayValues: {},
        removedKeys: [],
        errors: [],
        warnings: [],
        messages: [],
        isCommand,
    }
}

function createFieldMatcher(schema: QuickEntryReportSchema) {
    const candidates = schema.fields
        .flatMap(getFieldCandidates)
        .map((candidate) => candidate.trim())
        .filter(Boolean)
        .sort((left, right) => right.length - left.length)
        .map((candidate) => escapeRegex(candidate).replace(/\s+/g, "\\s+"))

    if (candidates.length === 0) return null

    return new RegExp(`(^|\\s)(${candidates.join("|")})\\s*=`, "gi")
}

function getClosestFieldSuggestion(
    input: string,
    schema: QuickEntryReportSchema
) {
    const token = normalizeToken(input)
    if (!token) return undefined

    const ranked = schema.fields
        .flatMap((field) => getFieldCandidates(field).map((candidate) => ({
            key: field.key,
            candidate,
            distance: levenshteinDistance(token, normalizeToken(candidate)),
        })))
        .sort((left, right) => left.distance - right.distance)

    const best = ranked[0]
    if (!best || best.distance > Math.max(2, Math.floor(token.length / 3))) {
        return undefined
    }

    return best.key
}

type QuickEntryAssignment = {
    rawKey: string
    key: string
    rawValue: string
}

type QuickEntryUnknownAssignment = {
    rawKey: string
    rawValue: string
}

function splitUnknownAssignment(input: string): QuickEntryUnknownAssignment | null {
    const separatorIndex = input.indexOf("=")
    if (separatorIndex < 0) return null

    const rawKey = input.slice(0, separatorIndex).trim()
    const rawValue = input.slice(separatorIndex + 1).trim()

    if (!rawKey) return null

    return { rawKey, rawValue }
}

function parseAssignmentsFromText(
    text: string,
    schema: QuickEntryReportSchema
) {
    const matcher = createFieldMatcher(schema)
    if (!matcher) return { assignments: [], unknowns: [] }

    const matches = Array.from(text.matchAll(matcher))

    if (matches.length === 0) {
        const unknown = splitUnknownAssignment(text.trim())
        return {
            assignments: [] as QuickEntryAssignment[],
            unknowns: unknown ? [unknown] : [],
        }
    }

    const assignments: QuickEntryAssignment[] = []

    matches.forEach((match, index) => {
        const rawKey = match[2].trim()
        const key = normalizeFieldKey(rawKey, schema)
        const valueStart = match.index + match[0].length
        const valueEnd = matches[index + 1]?.index ?? text.length
        const rawValue = text.slice(valueStart, valueEnd).trim()

        if (key) {
            assignments.push({ rawKey, key, rawValue })
        }
    })

    return {
        assignments,
        unknowns: [] as QuickEntryUnknownAssignment[],
    }
}

function parseAssignments(
    input: string,
    schema: QuickEntryReportSchema
) {
    const lines = input.split(/\r?\n/).map((line) => line.trim()).filter(Boolean)
    const sourceLines = lines.length > 1 ? lines : [input.trim()]
    const assignments: QuickEntryAssignment[] = []
    const unknowns: QuickEntryUnknownAssignment[] = []

    for (const line of sourceLines) {
        const parsed = parseAssignmentsFromText(line, schema)
        assignments.push(...parsed.assignments)
        unknowns.push(...parsed.unknowns)
    }

    return { assignments, unknowns }
}

function formatSummaryItems(schema: QuickEntryReportSchema, values: Record<string, unknown>) {
    return schema.calculateSummary?.(values).map((item) => `${item.label}: ${item.value}`) ?? []
}

function appendSummaryUpdateMessage(
    result: ParsedQuickEntryResult,
    schema: QuickEntryReportSchema,
    previousValues: Record<string, unknown>,
    nextValues: Record<string, unknown>
) {
    const previousSummary = formatSummaryItems(schema, previousValues)
    const nextSummary = schema.calculateSummary?.(nextValues) ?? []
    const nextSummaryStrings = nextSummary.map((item) => `${item.label}: ${item.value}`)

    for (const [index, item] of nextSummary.entries()) {
        if (previousSummary[index] !== nextSummaryStrings[index]) {
            result.messages.push(`${item.label} updated to ${item.value}.`)
        }
    }
}

function levenshteinDistance(left: string, right: string) {
    const rows = left.length + 1
    const columns = right.length + 1
    const matrix: number[][] = Array.from({ length: rows }, (_, row) => [row])

    for (let column = 1; column < columns; column += 1) {
        matrix[0][column] = column
    }

    for (let row = 1; row < rows; row += 1) {
        for (let column = 1; column < columns; column += 1) {
            const cost = left[row - 1] === right[column - 1] ? 0 : 1
            matrix[row][column] = Math.min(
                matrix[row - 1][column] + 1,
                matrix[row][column - 1] + 1,
                matrix[row - 1][column - 1] + cost
            )
        }
    }

    return matrix[left.length][right.length]
}

function getClosestReportType(input: string) {
    const token = normalizeToken(input)
    const candidates = Object.entries(REPORT_TYPE_ALIASES)
        .map(([alias, canonical]) => ({ alias, canonical }))
        .concat(QUICK_ENTRY_SCHEMAS.map((schema) => ({
            alias: schema.type,
            canonical: schema.type,
        })))

    const ranked = candidates
        .map((candidate) => ({
            canonical: candidate.canonical,
            distance: levenshteinDistance(token, normalizeToken(candidate.alias)),
        }))
        .sort((left, right) => left.distance - right.distance)

    const best = ranked[0]
    if (!best || best.distance > 3) return undefined

    return best.canonical
}

export function resolveReportType(input: string) {
    const token = normalizeToken(input)
    const direct = REPORT_TYPE_ALIASES[token] ?? token

    return getQuickEntrySchema(direct)
}

export function parseCreateReportCommand(command: string): CreateReportCommandResult {
    const trimmed = command.trim()
    const validTypes = getQuickEntrySchemaLabels()
    const match = trimmed.match(CREATE_COMMAND_PATTERN)

    if (!match) {
        return {
            success: false,
            error: "Use /create followed by a report type.",
            validTypes,
        }
    }

    const reportType = match[1]?.trim()

    if (!reportType) {
        return {
            success: false,
            error: "Enter a report type after /create.",
            validTypes,
        }
    }

    const schema = resolveReportType(reportType)

    if (!schema) {
        return {
            success: false,
            error: `Unknown report type: ${reportType}`,
            suggestion: getClosestReportType(reportType),
            validTypes,
        }
    }

    return {
        success: true,
        schema,
    }
}

export function createReportDraft(schema: QuickEntryReportSchema): ReportDraft {
    return {
        reportType: schema.type,
        values: {},
        errors: {},
        warnings: [],
        touchedFields: [],
        source: "quick-entry",
        status: "editing",
    }
}

export function getFieldByKey(schema: QuickEntryReportSchema, key: string) {
    return schema.fields.find((field) => field.key === key) ?? null
}

export function parseQuickEntryValue(
    field: QuickEntryFieldDefinition,
    rawValue: string
): QuickEntryParseResult {
    const trimmed = rawValue.trim()

    if (!trimmed) {
        if (field.required) {
            return {
                success: false,
                error: `${field.label} is required.`,
            }
        }

        return {
            success: true,
            value: undefined,
            displayValue: "",
        }
    }

    if (field.parser) {
        return {
            success: true,
            value: field.parser(rawValue),
        }
    }

    if (field.type === "date") {
        const parsed = parseReportDate(rawValue)

        if (!parsed.success) {
            return {
                success: false,
                error: "Enter a valid date, such as 20-06-26 or 2026-06-20.",
            }
        }

        return {
            success: true,
            value: parsed.isoDate,
            displayValue: parsed.displayValue,
        }
    }

    if (field.type === "number") {
        return parseQuickEntryNumber(rawValue, {
            label: field.label,
            min: field.min,
            max: field.max,
            allowDecimal: field.allowDecimal,
        })
    }

    if (field.type === "currency") {
        return parseQuickEntryCurrency(rawValue, {
            label: field.label,
            min: field.min,
            max: field.max,
        })
    }

    if (field.type === "select") {
        const option = field.options?.find((item) => (
            normalizeToken(item.value) === normalizeToken(trimmed)
            || normalizeToken(item.label) === normalizeToken(trimmed)
        ))

        if (!option) {
            return {
                success: false,
                error: `${field.label} must match one of the available options.`,
            }
        }

        return {
            success: true,
            value: option.value,
            displayValue: option.label,
        }
    }

    if (field.type === "boolean") {
        const truthy = ["true", "yes", "y", "1"]
        const falsy = ["false", "no", "n", "0"]
        const normalized = normalizeToken(trimmed)

        if (truthy.includes(normalized)) {
            return { success: true, value: true, displayValue: "Yes" }
        }

        if (falsy.includes(normalized)) {
            return { success: true, value: false, displayValue: "No" }
        }

        return {
            success: false,
            error: `${field.label} must be yes or no.`,
        }
    }

    return {
        success: true,
        value: trimmed,
        displayValue: trimmed,
    }
}

export function validateReportDraft(
    draft: ReportDraft,
    schema: QuickEntryReportSchema
) {
    const errors: Record<string, string> = {}

    for (const field of schema.fields) {
        if (field.required && !hasValue(draft.values[field.key])) {
            errors[field.key] = `${field.label} is required.`
        }
    }

    for (const [key, error] of Object.entries(draft.errors)) {
        if (error) errors[key] = error
    }

    return errors
}

export function isReportDraftValid(
    draft: ReportDraft,
    schema: QuickEntryReportSchema
) {
    return Object.keys(validateReportDraft(draft, schema)).length === 0
}

export function shouldConfirmDuplicateFieldReplacement(
    currentValue: unknown,
    nextValue: unknown
) {
    return hasValue(currentValue) && String(currentValue) !== String(nextValue)
}

export function serializeQuickEntryDraft(
    draft: ReportDraft,
    schema: QuickEntryReportSchema
): QuickEntrySubmitPayload {
    return {
        report_type: schema.type,
        values: compactPayload(schema.serialize?.(draft.values) ?? draft.values),
        source: "quick-entry",
    }
}

export function serializeQuickEntryBackendPayload(
    draft: ReportDraft,
    schema: QuickEntryReportSchema
) {
    return serializeQuickEntryDraft(draft, schema).values
}

export function formatQuickEntryValue(
    field: QuickEntryFieldDefinition,
    value: unknown
) {
    if (!hasValue(value)) return ""

    if (field.formatter) return field.formatter(value)

    if (field.type === "currency" && typeof value === "number") {
        return value.toFixed(2)
    }

    if (field.type === "date" && typeof value === "string") {
        const parsed = parseReportDate(value)
        return parsed.success ? parsed.displayValue : value
    }

    if (field.type === "select" && typeof value === "string") {
        return field.options?.find((option) => option.value === value)?.label ?? value
    }

    if (field.type === "boolean") {
        return value ? "Yes" : "No"
    }

    return String(value)
}

export function parseQuickEntryInput({
    input,
    schema,
    currentValues,
}: ParseQuickEntryInputArgs): ParsedQuickEntryResult {
    const trimmed = input.trim()
    const commandMatch = trimmed.match(/^\/([a-z]+)(?:\s+(.+))?$/i)

    if (commandMatch) {
        const [, commandName, commandArgument = ""] = commandMatch
        const command = commandName.toLowerCase()
        const result = createEmptyParsedResult(true)

        if (command === "remove") {
            result.command = { name: "remove", field: commandArgument.trim() }

            const key = normalizeFieldKey(commandArgument, schema)

            if (!key) {
                result.errors.push({
                    message: `Unknown field: ${commandArgument || "field"}.`,
                    suggestion: getClosestFieldSuggestion(commandArgument, schema),
                })
                return result
            }

            const field = getFieldByKey(schema, key)

            if (!field) return result

            if (!hasValue(currentValues[key])) {
                result.messages.push(`No value has been entered for ${field.label}.`)
                return result
            }

            const nextValues = { ...currentValues }
            delete nextValues[key]
            result.removedKeys.push(key)
            result.messages.push(`${field.label} removed from this draft.`)
            appendSummaryUpdateMessage(result, schema, currentValues, nextValues)
            return result
        }

        if (command === "review") {
            result.command = { name: "review" }
            return result
        }

        if (command === "save") {
            result.command = { name: "save" }
            return result
        }

        if (command === "cancel") {
            result.command = { name: "cancel" }
            return result
        }

        if (command === "help") {
            result.command = { name: "help" }
            return result
        }

        result.errors.push({
            message: `Unknown command: /${commandName}.`,
        })
        return result
    }

    const result = createEmptyParsedResult(false)
    const { assignments, unknowns } = parseAssignments(trimmed, schema)
    const workingValues = { ...currentValues }
    const seenKeys = new Set<string>()
    const duplicateKeys = new Set<string>()

    for (const unknown of unknowns) {
        result.errors.push({
            key: unknown.rawKey,
            message: `Unknown field: ${unknown.rawKey}.`,
            suggestion: getClosestFieldSuggestion(unknown.rawKey, schema),
        })
    }

    if (assignments.length === 0 && unknowns.length === 0) {
        result.errors.push({
            message: "Use key=value, for example men=200.",
        })
        return result
    }

    for (const assignment of assignments) {
        const field = getFieldByKey(schema, assignment.key)
        if (!field) continue

        const parsed = parseQuickEntryValue(field, assignment.rawValue)

        if (!parsed.success) {
            result.errors.push({
                key: assignment.key,
                message: parsed.error,
            })
            continue
        }

        if (seenKeys.has(assignment.key)) {
            duplicateKeys.add(assignment.key)
        }
        seenKeys.add(assignment.key)

        const previousValue = workingValues[assignment.key]
        const previousDisplay = formatQuickEntryValue(field, previousValue)

        if (parsed.value === undefined) {
            delete workingValues[assignment.key]
            delete result.updates[assignment.key]
        } else {
            workingValues[assignment.key] = parsed.value
            result.updates[assignment.key] = parsed.value
            result.displayValues[assignment.key] = parsed.displayValue
                ?? formatQuickEntryValue(field, parsed.value)
        }

        const nextDisplay = result.displayValues[assignment.key]
            ?? formatQuickEntryValue(field, parsed.value)

        if (hasValue(previousValue) && previousDisplay !== nextDisplay) {
            result.messages.push(`${field.label} updated from ${previousDisplay} to ${nextDisplay}.`)
        } else if (nextDisplay) {
            result.messages.push(`${field.label} set to ${nextDisplay}.`)
        }
    }

    for (const key of duplicateKeys) {
        const field = getFieldByKey(schema, key)
        if (field) {
            result.warnings.push(`${field.label} was entered more than once. The last valid value was used.`)
        }
    }

    if (Object.keys(result.updates).length > 0) {
        appendSummaryUpdateMessage(result, schema, currentValues, workingValues)
    }

    return result
}

export function parseQuickEntryLine(
    line: string,
    schema: QuickEntryReportSchema
) {
    const trimmed = line.trim()
    if (!trimmed) return null

    const [fieldToken, ...valueParts] = trimmed.split(/\s+/)
    const key = normalizeFieldKey(fieldToken, schema)

    if (!key) {
        return {
            success: false as const,
            error: `Unknown field: ${fieldToken}`,
        }
    }

    const value = valueParts.join(" ")

    if (!value) {
        return {
            success: false as const,
            error: `Enter a value for ${getFieldByKey(schema, key)?.label ?? key}.`,
        }
    }

    return {
        success: true as const,
        key,
        value,
    }
}

export type QuickEntryBatchRowState =
    | "ready"
    | "needs_attention"
    | "duplicate"

export type ParsedQuickEntryBatchRow = {
    index: number
    raw: string
    values: Record<string, unknown>
    displayValues: Record<string, string>
    errors: Record<string, string>
    state: QuickEntryBatchRowState
}

export type ParsedQuickEntryBatchResult = {
    rows: ParsedQuickEntryBatchRow[]
    errors: string[]
    warnings: string[]
}

type ExtractedRecordBlock = {
    raw: string
    content: string
}

function stripMatchingQuotes(value: string) {
    const trimmed = value.trim()
    const first = trimmed[0]
    const last = trimmed[trimmed.length - 1]

    if ((first === `"` && last === `"`) || (first === `'` && last === `'`)) {
        return trimmed.slice(1, -1)
    }

    return trimmed
}

function splitUnquotedEquals(token: string) {
    let quote: string | null = null
    let equalsCount = 0
    let equalsIndex = -1

    for (let index = 0; index < token.length; index += 1) {
        const char = token[index]

        if ((char === `"` || char === `'`) && token[index - 1] !== "\\") {
            quote = quote === char ? null : quote ?? char
            continue
        }

        if (char === "=" && !quote) {
            equalsCount += 1
            equalsIndex = index
        }
    }

    if (equalsCount !== 1) return null

    return {
        rawKey: token.slice(0, equalsIndex).trim(),
        rawValue: token.slice(equalsIndex + 1).trim(),
    }
}

function tokenizeKeyValueRecord(input: string) {
    const tokens: string[] = []
    let token = ""
    let quote: string | null = null

    for (let index = 0; index < input.length; index += 1) {
        const char = input[index]

        if ((char === `"` || char === `'`) && input[index - 1] !== "\\") {
            quote = quote === char ? null : quote ?? char
            token += char
            continue
        }

        if (/\s/.test(char) && !quote) {
            if (token.trim()) {
                tokens.push(token.trim())
                token = ""
            }
            continue
        }

        token += char
    }

    if (quote) {
        return {
            tokens,
            error: `Input has an unmatched ${quote}.`,
        }
    }

    if (token.trim()) {
        tokens.push(token.trim())
    }

    return { tokens }
}

function extractBracketedRecords(input: string) {
    const blocks: ExtractedRecordBlock[] = []
    const errors: string[] = []
    let index = 0

    while (index < input.length) {
        while (index < input.length && /\s/.test(input[index])) {
            index += 1
        }

        if (index >= input.length) break

        if (input[index] !== "[") {
            errors.push("When using brackets, the entire input must be bracketed record blocks.")
            return { blocks, errors }
        }

        const start = index
        index += 1
        let quote: string | null = null
        let closed = false

        while (index < input.length) {
            const char = input[index]

            if ((char === `"` || char === `'`) && input[index - 1] !== "\\") {
                quote = quote === char ? null : quote ?? char
                index += 1
                continue
            }

            if (char === "]" && !quote) {
                const content = input.slice(start + 1, index).trim()
                const raw = input.slice(start, index + 1)

                if (!content) {
                    errors.push(`Record ${blocks.length + 1}: [] is empty.`)
                } else {
                    blocks.push({ raw, content })
                }

                index += 1
                closed = true
                break
            }

            index += 1
        }

        if (!closed) {
            errors.push("Input has an unmatched `[`. Close each attendance record with `]`.")
            return { blocks, errors }
        }
    }

    return { blocks, errors }
}

function parseQuickEntryRecordBlock(
    block: ExtractedRecordBlock,
    schema: QuickEntryReportSchema,
    index: number
): ParsedQuickEntryBatchRow {
    const values: Record<string, unknown> = {}
    const displayValues: Record<string, string> = {}
    const parseErrors: Record<string, string> = {}
    const seenKeys = new Set<string>()
    const tokenized = tokenizeKeyValueRecord(block.content)

    if (tokenized.error) {
        parseErrors._record = tokenized.error
    }

    for (const token of tokenized.tokens) {
        const assignment = splitUnquotedEquals(token)

        if (!assignment || !assignment.rawKey) {
            parseErrors._record = `Record ${index + 1}: use key=value pairs only.`
            continue
        }

        if (!assignment.rawValue) {
            parseErrors[assignment.rawKey] = `\`${assignment.rawKey}\` needs a value.`
            continue
        }

        const key = normalizeFieldKey(assignment.rawKey, schema)

        if (!key) {
            const suggestion = getClosestFieldSuggestion(assignment.rawKey, schema)
            parseErrors[assignment.rawKey] = suggestion
                ? `\`${assignment.rawKey}\` is not a recognised Attendance field. Did you mean \`${suggestion}\`?`
                : `\`${assignment.rawKey}\` is not a recognised Attendance field.`
            continue
        }

        const field = getFieldByKey(schema, key)

        if (!field) continue

        if (seenKeys.has(key)) {
            parseErrors[key] = `\`${key}\` was entered more than once in this record.`
            continue
        }

        seenKeys.add(key)

        const parsed = parseQuickEntryValue(field, stripMatchingQuotes(assignment.rawValue))

        if (!parsed.success) {
            parseErrors[key] = parsed.error
            continue
        }

        if (parsed.value !== undefined) {
            values[key] = parsed.value
            displayValues[key] = parsed.displayValue
                ?? formatQuickEntryValue(field, parsed.value)
        }
    }

    const draft = createReportDraft(schema)
    draft.values = values
    draft.errors = parseErrors
    const errors = validateReportDraft(draft, schema)

    return {
        index,
        raw: block.raw,
        values,
        displayValues,
        errors,
        state: Object.keys(errors).length > 0 ? "needs_attention" : "ready",
    }
}

function markPreviewDuplicates(
    rows: ParsedQuickEntryBatchRow[],
    schema: QuickEntryReportSchema
) {
    const dateField = schema.fields.find((field) => field.type === "date")
    const seen = new Map<string, number>()

    return rows.map((row, index) => {
        if (Object.keys(row.errors).length > 0 || !dateField) {
            return row
        }

        const naturalKey = [
            row.values[dateField.key],
            row.values.service_type ?? "sunday",
            row.values.homecell ?? "",
        ].join("|")

        const previousIndex = seen.get(naturalKey)

        if (previousIndex !== undefined) {
            return {
                ...row,
                errors: {
                    ...row.errors,
                    _record: `Duplicates preview row ${previousIndex + 1}.`,
                },
                state: "duplicate" as const,
            }
        }

        seen.set(naturalKey, index)
        return row
    })
}

export function parseQuickEntryBatchInput({
    input,
    schema,
}: {
    input: string
    schema: QuickEntryReportSchema
}): ParsedQuickEntryBatchResult {
    const trimmed = input.trim()
    const errors: string[] = []
    const warnings: string[] = []

    if (!trimmed) {
        return {
            rows: [],
            errors: ["Enter attendance values to create a preview."],
            warnings,
        }
    }

    const hasBracket = trimmed.includes("[") || trimmed.includes("]")
    const extracted = hasBracket
        ? extractBracketedRecords(trimmed)
        : {
            blocks: [{ raw: trimmed, content: trimmed }] as ExtractedRecordBlock[],
            errors: [] as string[],
        }

    errors.push(...extracted.errors)

    if (hasBracket && trimmed.includes("]") && !trimmed.includes("[")) {
        errors.push("Input has an unmatched `]`.")
    }

    const rows = extracted.blocks.map((block, index) => (
        parseQuickEntryRecordBlock(block, schema, index)
    ))

    return {
        rows: markPreviewDuplicates(rows, schema),
        errors,
        warnings,
    }
}
