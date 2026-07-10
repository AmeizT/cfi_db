import type {
    QuickEntryFieldSuggestion,
    QuickEntryReportSchema,
} from "../quick-entry-types"

function normalizeToken(value: string) {
    return value
        .trim()
        .toLowerCase()
        .replace(/[_-]+/g, " ")
        .replace(/\s+/g, " ")
}

export function normalizeFieldKey(
    input: string,
    schema: QuickEntryReportSchema
): string | null {
    const token = normalizeToken(input)
    if (!token) return null

    for (const field of schema.fields) {
        const candidates = [
            field.key,
            field.label,
            ...(field.aliases ?? []),
        ]

        if (candidates.some((candidate) => normalizeToken(candidate) === token)) {
            return field.key
        }
    }

    return null
}

export function getFieldSuggestions(
    input: string,
    schema: QuickEntryReportSchema
): QuickEntryFieldSuggestion[] {
    const token = normalizeToken(input)
    const suggestions = new Map<string, QuickEntryFieldSuggestion>()

    for (const field of schema.fields) {
        const candidates = [
            field.key,
            field.label,
            ...(field.aliases ?? []),
        ]

        const match = candidates.find((candidate) => {
            if (!token) return true

            const normalizedCandidate = normalizeToken(candidate)
            return normalizedCandidate.includes(token)
                || normalizeToken(field.label).includes(token)
                || normalizeToken(field.key).includes(token)
        })

        if (match) {
            suggestions.set(field.key, {
                key: field.key,
                label: field.label,
                matchedBy: match,
            })
        }
    }

    return Array.from(suggestions.values()).slice(0, 6)
}
