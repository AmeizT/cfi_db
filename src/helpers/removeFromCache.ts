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

    if (
        typeof old === "object" &&
        old !== null &&
        "results" in old &&
        Array.isArray(old.results)
    ) {
        return {
            ...old,
            results: filterRows(old.results),
        }
    }

    return old
}