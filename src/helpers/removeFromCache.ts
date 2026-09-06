export function removeRecordsFromCache(
    old: unknown,
    ids: number[]
) {
    if (!old) return old

    const filterRows = (
        rows: Record<string, unknown>[]
    ) =>
        rows.filter(
            (row) => !ids.includes(row.id as number)
        )

    if (Array.isArray(old)) {
        return filterRows(old)
    }

    if (typeof old === "object" && old !== null) {
        const envelope = old as Record<string, unknown>
        const updated = { ...envelope }

        for (const key of ["rows", "results", "data"] as const) {
            if (Array.isArray(envelope[key])) {
                updated[key] = filterRows(envelope[key] as Record<string, unknown>[])
            }
        }

        return updated
    }

    return old
}
