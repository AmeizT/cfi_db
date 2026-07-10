"use client"

import * as React from "react"
import { useQueryClient } from "@tanstack/react-query"
import { PlusIcon, RotateCcwIcon } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { apiRoutes } from "@/config/urls"
import { QuickEntryCommandInput } from "./QuickEntryCommandInput"
import { QuickEntryEmptyState } from "./QuickEntryEmptyState"
import { QuickEntryFieldAutocomplete } from "./QuickEntryFieldAutocomplete"
import { QuickEntryGrid } from "./QuickEntryGrid"
import { QuickEntryReview } from "./QuickEntryReview"
import { getFieldSuggestions, normalizeFieldKey } from "./parsers/normalize-field-key"
import { getQuickEntrySchemaLabels } from "./report-schema-registry"
import {
    createReportDraft,
    formatQuickEntryValue,
    getFieldByKey,
    isReportDraftValid,
    parseCreateReportCommand,
    parseQuickEntryValue,
    resolveReportType,
    serializeQuickEntryBackendPayload,
    shouldConfirmDuplicateFieldReplacement,
    validateReportDraft,
} from "./quick-entry-utils"
import type {
    DuplicateFieldPrompt,
    QuickEntryFieldDefinition,
    QuickEntryParseSuccess,
    QuickEntryReportSchema,
    ReportDraft,
} from "./quick-entry-types"

type QuickEntryComposerProps = {
    initialReportType?: string
    currentSectionId?: string
    contextLabel?: string
    sectionStatusId?: number
}

type DraftBuildResult = {
    draft: ReportDraft
    displayValues: Record<string, string>
}

type ApiErrorBody = {
    detail?: string
    error?: string
    message?: string
    non_field_errors?: string[]
}

function initializeRawValues(schema: QuickEntryReportSchema) {
    return Object.fromEntries(schema.fields.map((field) => [field.key, ""]))
}

function initializeFieldKeyValues(schema: QuickEntryReportSchema) {
    return Object.fromEntries(schema.fields.map((field) => [field.key, field.key]))
}

function buildDraftFromRawValues(
    schema: QuickEntryReportSchema,
    draft: ReportDraft,
    rawValues: Record<string, string>
): DraftBuildResult {
    const values: Record<string, unknown> = {}
    const errors: Record<string, string> = {}
    const touchedFields = new Set(draft.touchedFields)
    const displayValues: Record<string, string> = {}

    for (const field of schema.fields) {
        const rawValue = rawValues[field.key] ?? ""
        const parsed = parseQuickEntryValue(field, rawValue)

        if (rawValue.trim()) touchedFields.add(field.key)

        if (parsed.success) {
            if (parsed.value !== undefined) {
                values[field.key] = parsed.value
            }

            if (parsed.displayValue) {
                displayValues[field.key] = parsed.displayValue
            }
        } else {
            errors[field.key] = parsed.error
        }
    }

    const nextDraft: ReportDraft = {
        ...draft,
        values,
        errors,
        touchedFields: Array.from(touchedFields),
    }

    return {
        draft: {
            ...nextDraft,
            errors: validateReportDraft(nextDraft, schema),
        },
        displayValues,
    }
}

function getInputTypeForField(field: QuickEntryFieldDefinition) {
    if (field.type === "number") return "numeric"
    if (field.type === "currency") return "decimal"
    return undefined
}

async function getResponseError(response: Response) {
    try {
        const body = await response.json() as ApiErrorBody
        return body.detail
            ?? body.error
            ?? body.message
            ?? body.non_field_errors?.join(", ")
            ?? "Could not save report."
    } catch {
        return "Could not save report."
    }
}

export function QuickEntryComposer({
    initialReportType = "attendance",
    currentSectionId,
    contextLabel = "Current assembly",
    sectionStatusId,
}: QuickEntryComposerProps) {
    const queryClient = useQueryClient()
    const suggestedSchema = resolveReportType(initialReportType) ?? resolveReportType("attendance")
    const suggestedCommand = `/create ${suggestedSchema?.type ?? "attendance"}`
    const validReportTypes = React.useMemo(() => getQuickEntrySchemaLabels(), [])
    const [command, setCommand] = React.useState("")
    const [commandError, setCommandError] = React.useState<string | null>(null)
    const [commandSuggestion, setCommandSuggestion] = React.useState<string | undefined>()
    const [schema, setSchema] = React.useState<QuickEntryReportSchema | null>(null)
    const [draft, setDraft] = React.useState<ReportDraft | null>(null)
    const [fieldKeyValues, setFieldKeyValues] = React.useState<Record<string, string>>({})
    const [fieldKeyErrors, setFieldKeyErrors] = React.useState<Record<string, string>>({})
    const [rawValues, setRawValues] = React.useState<Record<string, string>>({})
    const [displayValues, setDisplayValues] = React.useState<Record<string, string>>({})
    const [activeRow, setActiveRow] = React.useState(0)
    const [focusVersion, setFocusVersion] = React.useState(0)
    const [quickField, setQuickField] = React.useState("")
    const [quickValue, setQuickValue] = React.useState("")
    const [quickRowError, setQuickRowError] = React.useState<string | null>(null)
    const [autocompleteOpen, setAutocompleteOpen] = React.useState(false)
    const [activeSuggestion, setActiveSuggestion] = React.useState(0)
    const [duplicatePrompt, setDuplicatePrompt] = React.useState<DuplicateFieldPrompt | null>(null)
    const duplicatePromptRef = React.useRef<HTMLDivElement | null>(null)
    const quickValueRef = React.useRef<HTMLInputElement | null>(null)
    const quickFieldId = React.useId()
    const autocompleteId = `${quickFieldId}-suggestions`

    const fieldSuggestions = schema
        ? getFieldSuggestions(quickField, schema)
        : []
    const isSaving = draft?.status === "saving"
    const isReviewing = draft?.status === "reviewing" || draft?.status === "saving"

    React.useEffect(() => {
        if (duplicatePrompt) {
            duplicatePromptRef.current?.focus()
        }
    }, [duplicatePrompt])

    function handleCommandSubmit() {
        const result = parseCreateReportCommand(command)

        if (!result.success) {
            setCommandError(result.error)
            setCommandSuggestion(result.suggestion)
            return
        }

        const nextDraft = createReportDraft(result.schema)

        setSchema(result.schema)
        setDraft(nextDraft)
        setFieldKeyValues(initializeFieldKeyValues(result.schema))
        setFieldKeyErrors({})
        setRawValues(initializeRawValues(result.schema))
        setDisplayValues({})
        setActiveRow(0)
        setCommandError(null)
        setCommandSuggestion(undefined)
        setQuickField("")
        setQuickValue("")
        setQuickRowError(null)
        setDuplicatePrompt(null)
        setFocusVersion((current) => current + 1)
    }

    function commitParsedField(
        field: QuickEntryFieldDefinition,
        rawValue: string,
        parsed: QuickEntryParseSuccess
    ) {
        if (!draft) return

        setDraft((current) => {
            if (!current) return current

            const values = { ...current.values }
            const errors = { ...current.errors }
            const touchedFields = new Set(current.touchedFields)

            touchedFields.add(field.key)
            delete errors[field.key]

            if (parsed.value === undefined) {
                delete values[field.key]
            } else {
                values[field.key] = parsed.value
            }

            return {
                ...current,
                values,
                errors,
                touchedFields: Array.from(touchedFields),
                status: current.status === "saved" ? "editing" : current.status,
            }
        })

        setRawValues((current) => ({
            ...current,
            [field.key]: rawValue,
        }))
        setDisplayValues((current) => {
            const next = { ...current }

            if (parsed.displayValue) {
                next[field.key] = parsed.displayValue
            } else {
                delete next[field.key]
            }

            return next
        })
    }

    function commitField(key: string) {
        if (!schema || !draft) return false

        const field = getFieldByKey(schema, key)
        if (!field) return false

        const rawValue = rawValues[key] ?? ""
        const parsed = parseQuickEntryValue(field, rawValue)

        if (parsed.success) {
            commitParsedField(field, rawValue, parsed)
            return true
        }

        setDraft((current) => {
            if (!current) return current

            const values = { ...current.values }
            const touchedFields = new Set(current.touchedFields)
            touchedFields.add(key)
            delete values[key]

            return {
                ...current,
                values,
                errors: {
                    ...current.errors,
                    [key]: parsed.error,
                },
                touchedFields: Array.from(touchedFields),
            }
        })
        setDisplayValues((current) => {
            const next = { ...current }
            delete next[key]
            return next
        })

        return false
    }

    function setRawFieldValue(key: string, value: string) {
        setRawValues((current) => ({
            ...current,
            [key]: value,
        }))

        setDraft((current) => current
            ? {
                ...current,
                status: current.status === "saved" ? "editing" : current.status,
            }
            : current)
    }

    function clearField(key: string) {
        if (!schema) return

        setRawValues((current) => ({
            ...current,
            [key]: "",
        }))
        setDisplayValues((current) => {
            const next = { ...current }
            delete next[key]
            return next
        })
        setDraft((current) => {
            if (!current) return current

            const values = { ...current.values }
            const errors = { ...current.errors }
            const touchedFields = current.touchedFields.filter((fieldKey) => fieldKey !== key)
            delete values[key]
            delete errors[key]

            const nextDraft = {
                ...current,
                values,
                errors,
                touchedFields,
                status: "editing" as const,
            }

            return {
                ...nextDraft,
                errors: validateReportDraft(nextDraft, schema),
            }
        })
    }

    function moveFieldValue(fromKey: string, toKey: string, nextRawValue: string) {
        if (!schema) return

        const targetField = getFieldByKey(schema, toKey)
        if (!targetField) return

        const parsed = parseQuickEntryValue(targetField, nextRawValue)
        if (!parsed.success) return

        setRawValues((current) => ({
            ...current,
            [fromKey]: "",
            [toKey]: nextRawValue,
        }))
        setDisplayValues((current) => {
            const next = { ...current }
            delete next[fromKey]

            if (parsed.displayValue) {
                next[toKey] = parsed.displayValue
            } else {
                delete next[toKey]
            }

            return next
        })
        setDraft((current) => {
            if (!current) return current

            const values = { ...current.values }
            const errors = { ...current.errors }
            const touchedFields = new Set(current.touchedFields)

            delete values[fromKey]
            delete errors[fromKey]
            delete errors[toKey]
            touchedFields.delete(fromKey)
            touchedFields.add(toKey)

            if (parsed.value === undefined) {
                delete values[toKey]
            } else {
                values[toKey] = parsed.value
            }

            return {
                ...current,
                values,
                errors,
                touchedFields: Array.from(touchedFields),
                status: "editing",
            }
        })
    }

    function resetFieldKeyValue(key: string) {
        setFieldKeyValues((current) => ({
            ...current,
            [key]: key,
        }))
    }

    function commitFieldKey(fromKey: string) {
        if (!schema || !draft) return

        const rawKey = fieldKeyValues[fromKey] ?? fromKey
        const toKey = normalizeFieldKey(rawKey, schema)

        if (!toKey) {
            setFieldKeyErrors((current) => ({
                ...current,
                [fromKey]: `Unknown field: ${rawKey || "field"}.`,
            }))
            return
        }

        setFieldKeyErrors((current) => {
            const next = { ...current }
            delete next[fromKey]
            return next
        })

        setFieldKeyValues((current) => ({
            ...current,
            [fromKey]: toKey,
        }))

        if (toKey === fromKey) return

        const nextRawValue = rawValues[fromKey] ?? ""
        const targetField = getFieldByKey(schema, toKey)
        if (!targetField) return

        if (!nextRawValue.trim()) {
            resetFieldKeyValue(fromKey)
            return
        }

        const parsed = parseQuickEntryValue(targetField, nextRawValue)

        if (!parsed.success) {
            setFieldKeyErrors((current) => ({
                ...current,
                [fromKey]: parsed.error,
            }))
            return
        }

        if (shouldConfirmDuplicateFieldReplacement(draft.values[toKey], parsed.value)) {
            setDuplicatePrompt({
                key: toKey,
                label: targetField.label,
                currentValue: draft.values[toKey],
                nextRawValue,
                fromKey,
                source: "key-edit",
            })
            return
        }

        moveFieldValue(fromKey, toKey, nextRawValue)
        resetFieldKeyValue(fromKey)
    }

    function focusFirstError(nextDraft: ReportDraft, nextSchema: QuickEntryReportSchema) {
        const firstErrorIndex = nextSchema.fields.findIndex((field) => nextDraft.errors[field.key])

        if (firstErrorIndex >= 0) {
            setActiveRow(firstErrorIndex)
            setFocusVersion((current) => current + 1)
        }
    }

    function prepareReview() {
        if (!schema || !draft) return false

        const result = buildDraftFromRawValues(schema, draft, rawValues)
        const hasErrors = Object.keys(result.draft.errors).length > 0

        setDisplayValues(result.displayValues)
        setDraft({
            ...result.draft,
            status: hasErrors ? "editing" : "reviewing",
        })

        if (hasErrors) {
            focusFirstError(result.draft, schema)
            return false
        }

        return true
    }

    async function handleSave() {
        if (!schema || !draft || !schema.backend) return

        const result = buildDraftFromRawValues(schema, draft, rawValues)

        if (!isReportDraftValid(result.draft, schema)) {
            setDisplayValues(result.displayValues)
            setDraft({
                ...result.draft,
                status: "editing",
            })
            focusFirstError(result.draft, schema)
            return
        }

        if (draft.status !== "reviewing") {
            setDisplayValues(result.displayValues)
            setDraft({
                ...result.draft,
                status: "reviewing",
            })
            return
        }

        setDraft({
            ...result.draft,
            status: "saving",
        })

        try {
            const response = await fetch(schema.backend.endpoint, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(serializeQuickEntryBackendPayload(result.draft, schema)),
            })

            if (!response.ok) {
                throw new Error(await getResponseError(response))
            }

            if (sectionStatusId && schema.backend.sectionId === currentSectionId) {
                const sectionResponse = await fetch(apiRoutes.reports.sections.submit(sectionStatusId), {
                    method: "POST",
                    credentials: "include",
                })

                if (!sectionResponse.ok) {
                    throw new Error(await getResponseError(sectionResponse))
                }
            }

            await queryClient.invalidateQueries({ queryKey: ["reports"] })
            setDraft({
                ...result.draft,
                status: "saved",
            })
            toast.success(`${schema.label} report saved`)
        } catch (error) {
            setDraft({
                ...result.draft,
                status: "error",
            })
            toast.error(error instanceof Error ? error.message : "Could not save report.")
        }
    }

    function selectSuggestion(index: number) {
        const suggestion = fieldSuggestions[index]
        if (!suggestion) return

        setQuickField(suggestion.key)
        setAutocompleteOpen(false)
        quickValueRef.current?.focus()
    }

    function clearQuickRow() {
        setQuickField("")
        setQuickValue("")
        setQuickRowError(null)
        setDuplicatePrompt(null)
    }

    function applyQuickRow(key: string, rawValue: string) {
        if (!schema) return false

        const field = getFieldByKey(schema, key)
        if (!field) return false

        const parsed = parseQuickEntryValue(field, rawValue)

        if (!parsed.success) {
            setQuickRowError(parsed.error)
            return false
        }

        commitParsedField(field, rawValue, parsed)
        setQuickRowError(null)
        clearQuickRow()
        return true
    }

    function commitQuickRow(forceReplace = false) {
        if (!schema || !draft) return false

        const key = normalizeFieldKey(quickField, schema)

        if (!key) {
            setQuickRowError(`Unknown field: ${quickField || "field"}.`)
            return false
        }

        const field = getFieldByKey(schema, key)
        if (!field) return false

        const parsed = parseQuickEntryValue(field, quickValue)

        if (!parsed.success) {
            setQuickRowError(parsed.error)
            return false
        }

        const currentValue = draft.values[key]

        if (
            !forceReplace
            && shouldConfirmDuplicateFieldReplacement(currentValue, parsed.value)
        ) {
            setDuplicatePrompt({
                key,
                label: field.label,
                currentValue,
                nextRawValue: quickValue,
            })
            return false
        }

        return applyQuickRow(key, quickValue)
    }

    function keepExistingDuplicateValue() {
        if (duplicatePrompt?.source === "key-edit" && duplicatePrompt.fromKey) {
            resetFieldKeyValue(duplicatePrompt.fromKey)
            setDuplicatePrompt(null)
            return
        }

        clearQuickRow()
    }

    function replaceDuplicateValue() {
        if (!duplicatePrompt) return

        const key = duplicatePrompt.key
        const rawValue = duplicatePrompt.nextRawValue
        setDuplicatePrompt(null)

        if (duplicatePrompt.source === "key-edit" && duplicatePrompt.fromKey) {
            moveFieldValue(duplicatePrompt.fromKey, key, rawValue)
            resetFieldKeyValue(duplicatePrompt.fromKey)
            return
        }

        applyQuickRow(key, rawValue)
    }

    function handleQuickFieldKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
        if (event.key === "Escape") {
            setAutocompleteOpen(false)
            return
        }

        if (autocompleteOpen && fieldSuggestions.length > 0) {
            if (event.key === "ArrowDown") {
                event.preventDefault()
                setActiveSuggestion((current) => Math.min(current + 1, fieldSuggestions.length - 1))
                return
            }

            if (event.key === "ArrowUp") {
                event.preventDefault()
                setActiveSuggestion((current) => Math.max(current - 1, 0))
                return
            }

            if (event.key === "Enter") {
                event.preventDefault()
                selectSuggestion(activeSuggestion)
                return
            }
        }

        if (event.key === "Enter") {
            event.preventDefault()
            quickValueRef.current?.focus()
        }
    }

    function handleQuickValueKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
        if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
            event.preventDefault()
            prepareReview()
            return
        }

        if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "s") {
            event.preventDefault()
            void handleSave()
            return
        }

        if (event.key === "Escape") {
            setAutocompleteOpen(false)
            setDuplicatePrompt(null)
            return
        }

        if (event.key === "Enter") {
            event.preventDefault()
            commitQuickRow()
        }
    }

    function handleDuplicatePromptKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
        if (event.key === "Enter") {
            event.preventDefault()
            replaceDuplicateValue()
        }

        if (event.key === "Escape") {
            event.preventDefault()
            keepExistingDuplicateValue()
        }
    }

    const quickFieldInputMode = schema
        ? getInputTypeForField(getFieldByKey(schema, normalizeFieldKey(quickField, schema) ?? "") ?? schema.fields[0])
        : undefined
    const enteredFieldCount = schema
        ? schema.fields.filter((field) => (rawValues[field.key] ?? "").trim().length > 0).length
        : 0
    const validationErrorCount = Object.keys(draft?.errors ?? {}).length
    const summaryItems = schema?.calculateSummary?.(draft?.values ?? {}) ?? []

    return (
        <div className="grid gap-5">
            {!schema || !draft ? (
                <div className="grid gap-4 rounded-lg border border-border bg-background p-4">
                    <QuickEntryCommandInput
                        value={command}
                        placeholder={suggestedCommand}
                        error={commandError}
                        suggestion={commandSuggestion}
                        validTypes={validReportTypes}
                        disabled={isSaving}
                        onChange={setCommand}
                        onSubmit={handleCommandSubmit}
                        onClearSuggestions={() => {
                            setCommandError(null)
                            setCommandSuggestion(undefined)
                        }}
                    />
                    <QuickEntryEmptyState suggestedCommand={suggestedCommand} />
                </div>
            ) : isReviewing ? (
                <QuickEntryReview
                    schema={schema}
                    draft={draft}
                    contextLabel={contextLabel}
                    saving={isSaving}
                    onEdit={() => setDraft((current) => current ? { ...current, status: "editing" } : current)}
                    onSave={() => void handleSave()}
                />
            ) : (
                <section className="overflow-hidden rounded-lg border border-border bg-background">
                    <header className="flex flex-col gap-3 border-b border-border px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h2 className="text-sm font-semibold text-foreground">
                                {schema.label} - quick entry
                            </h2>
                            <p className="mt-0.5 text-xs text-muted-foreground">
                                {contextLabel}
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-1.5">
                            <span className="rounded-md bg-muted px-2.5 py-1 text-xs font-semibold text-muted-foreground">
                                Manual
                            </span>
                            <span className="rounded-md bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                                Quick entry
                            </span>
                            <span className="rounded-md bg-muted px-2.5 py-1 text-xs font-semibold text-muted-foreground">
                                Upload file
                            </span>
                        </div>
                    </header>

                    <div className="px-4 py-4">
                        <QuickEntryGrid
                            schema={schema}
                            draft={draft}
                            fieldKeyValues={fieldKeyValues}
                            fieldKeyErrors={fieldKeyErrors}
                            rawValues={rawValues}
                            displayValues={displayValues}
                            activeRow={activeRow}
                            focusVersion={focusVersion}
                            onActiveRowChange={setActiveRow}
                            onFieldKeyChange={(key, value) => {
                                setFieldKeyValues((current) => ({
                                    ...current,
                                    [key]: value,
                                }))
                            }}
                            onCommitFieldKey={commitFieldKey}
                            onRawValueChange={setRawFieldValue}
                            onCommitField={commitField}
                            onClearField={clearField}
                            onReview={prepareReview}
                            onSave={() => void handleSave()}
                        />
                    </div>

                    <div className="border-t border-border px-4 py-3">
                        <div className="flex flex-col gap-2">
                            <div className="flex flex-col gap-2 rounded-lg border border-primary bg-muted/25 px-3 py-2 ring-4 ring-primary/10 sm:flex-row sm:items-center">
                                <span className="font-mono text-sm font-bold text-primary">
                                    /create
                                </span>

                                <div className="relative min-w-0 flex-1">
                                    <Label htmlFor={quickFieldId} className="sr-only">
                                        Field
                                    </Label>
                                    <Input
                                        id={quickFieldId}
                                        value={quickField}
                                        autoComplete="off"
                                        autoCapitalize="none"
                                        spellCheck={false}
                                        aria-controls={autocompleteId}
                                        aria-expanded={autocompleteOpen}
                                        aria-autocomplete="list"
                                        role="combobox"
                                        placeholder="visitor_men"
                                        className="h-7 rounded-none border-0 bg-transparent px-0 font-mono text-sm shadow-none focus-visible:ring-0"
                                        onChange={(event) => {
                                            setQuickField(event.target.value)
                                            setActiveSuggestion(0)
                                            setAutocompleteOpen(true)
                                        }}
                                        onFocus={() => setAutocompleteOpen(true)}
                                        onKeyDown={handleQuickFieldKeyDown}
                                    />
                                    <QuickEntryFieldAutocomplete
                                        id={autocompleteId}
                                        open={autocompleteOpen}
                                        activeIndex={activeSuggestion}
                                        suggestions={fieldSuggestions}
                                        onSelect={(suggestion) => {
                                            setQuickField(suggestion.key)
                                            setAutocompleteOpen(false)
                                            quickValueRef.current?.focus()
                                        }}
                                    />
                                </div>

                                <span className="hidden font-mono text-sm text-muted-foreground sm:block">
                                    =
                                </span>

                                <div className="min-w-0 flex-1">
                                    <Label htmlFor="quick-entry-row-value" className="sr-only">
                                        Value
                                    </Label>
                                    <Input
                                        id="quick-entry-row-value"
                                        ref={quickValueRef}
                                        value={quickValue}
                                        inputMode={quickFieldInputMode}
                                        placeholder="200"
                                        aria-invalid={Boolean(quickRowError)}
                                        className="h-7 rounded-none border-0 bg-transparent px-0 font-mono text-sm shadow-none focus-visible:ring-0"
                                        onChange={(event) => setQuickValue(event.target.value)}
                                        onKeyDown={handleQuickValueKeyDown}
                                    />
                                </div>

                                <Button type="button" size="sm" onClick={() => commitQuickRow()}>
                                    <PlusIcon className="size-4" />
                                    Add
                                </Button>
                            </div>

                            <p className="text-xs text-muted-foreground">
                                Press Enter to add a row. Date fields accept DD-MM-YY, DD/MM/YYYY, or YYYY-MM-DD.
                            </p>

                            {quickRowError ? (
                                <p role="alert" className="text-sm font-medium text-destructive">
                                    {quickRowError}
                                </p>
                            ) : null}

                            {duplicatePrompt ? (
                                <div
                                    ref={duplicatePromptRef}
                                    tabIndex={-1}
                                    role="alertdialog"
                                    aria-label="Duplicate field value"
                                    className="rounded-md border border-amber-300 bg-amber-50 p-3 text-sm text-amber-950 outline-none dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-100"
                                    onKeyDown={handleDuplicatePromptKeyDown}
                                >
                                    <p>
                                        {duplicatePrompt.label} already has a value of{" "}
                                        <span className="font-semibold">
                                            {formatQuickEntryValue(
                                                getFieldByKey(schema, duplicatePrompt.key) ?? schema.fields[0],
                                                duplicatePrompt.currentValue
                                            )}
                                        </span>
                                        . Replace it with {duplicatePrompt.nextRawValue}?
                                    </p>
                                    <div className="mt-3 flex flex-wrap gap-2">
                                        <Button type="button" size="sm" onClick={replaceDuplicateValue}>
                                            Replace
                                        </Button>
                                        <Button
                                            type="button"
                                            size="sm"
                                            variant="outline"
                                            onClick={keepExistingDuplicateValue}
                                        >
                                            Keep existing
                                        </Button>
                                    </div>
                                </div>
                            ) : null}
                        </div>
                    </div>

                    <footer className="flex flex-col gap-3 border-t border-border bg-muted/25 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="grid gap-1">
                            <p className="text-sm font-semibold text-foreground">
                                {enteredFieldCount} of {schema.fields.length} fields entered
                                {validationErrorCount > 0 ? ` - ${validationErrorCount} issue${validationErrorCount === 1 ? "" : "s"}` : ""}
                            </p>
                            {summaryItems.length > 0 ? (
                                <p className="text-xs text-muted-foreground">
                                    {summaryItems.map((item) => `${item.label}: ${item.value}`).join(" · ")}
                                </p>
                            ) : (
                                <p className="text-xs text-muted-foreground">
                                    Values are normalized before review.
                                </p>
                            )}
                        </div>

                        <div className="flex flex-wrap gap-2 sm:justify-end">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    const nextDraft = createReportDraft(schema)
                                    setDraft(nextDraft)
                                    setFieldKeyValues(initializeFieldKeyValues(schema))
                                    setFieldKeyErrors({})
                                    setRawValues(initializeRawValues(schema))
                                    setDisplayValues({})
                                    setQuickField("")
                                    setQuickValue("")
                                    setQuickRowError(null)
                                    setDuplicatePrompt(null)
                                    setFocusVersion((current) => current + 1)
                                }}
                            >
                                <RotateCcwIcon className="size-4" />
                                Reset
                            </Button>
                            <Button
                                type="button"
                                onClick={prepareReview}
                            >
                                Review report
                            </Button>
                        </div>
                    </footer>
                </section>
            )}
        </div>
    )
}
