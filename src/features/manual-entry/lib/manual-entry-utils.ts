import type { BatchKind } from "../hooks/use-batch-entry"

type EntryLike = Record<string, unknown>

export function calculateEntryTotal(kind: BatchKind, rows: EntryLike[]) {
    return rows.reduce((sum, row) => {
        if (kind === "expenses") {
            return sum + (Number(row.price) || 0) * (Number(row.quantity) || 0)
        }
        return sum + (Number(row.amount) || 0)
    }, 0)
}

export function findDuplicateEntryIndices(kind: BatchKind, rows: EntryLike[]) {
    const field = kind === "tithes" ? "member" : kind === "revenue" ? "category" : kind === "overhead" ? "overhead_type" : null
    if (!field) return []
    const seen = new Set<string>()
    const duplicates: number[] = []
    rows.forEach((row, index) => {
        const value = String(row[field] ?? "")
        if (!value || (kind === "tithes" && value === "anonymous")) return
        if (seen.has(value)) duplicates.push(index)
        seen.add(value)
    })
    return duplicates
}

export function flattenRowErrors(errors: Record<string, string[] | string>) {
    return Object.fromEntries(
        Object.entries(errors).map(([field, messages]) => [
            field,
            Array.isArray(messages) ? messages.join(" ") : messages,
        ]),
    )
}
