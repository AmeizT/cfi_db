export function updateRecordInCache(
    old: unknown,
    recordId: number,
    updater: (row: Record<string, unknown>) => Record<string, unknown>
) {
    if (!old) return old

    const updateRow = (row: Record<string, unknown>) =>
        row.id === recordId
            ? updater(row)
            : row

    if (Array.isArray(old)) {
        return old.map(updateRow)
    }

    if (
        typeof old === "object" &&
        old !== null &&
        "results" in old &&
        Array.isArray(old.results)
    ) {
        return {
            ...old,
            results: old.results.map(updateRow),
        }
    }

    return old
}