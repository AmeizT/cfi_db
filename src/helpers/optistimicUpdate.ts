export function optimisticUpdateRecord(
    old: unknown,
    recordId: number,
    columnId: string,
    value: unknown
) {
    if (!old) return old

    const updateRow = (row: Record<string, unknown>) =>
        row.id === recordId
            ? { ...row, [columnId]: value }
            : row

    if (Array.isArray(old)) {
        return old.map((row) => updateRow(row))
    }

    if (
        typeof old === "object" &&
        old !== null &&
        "results" in old &&
        Array.isArray(old.results)
    ) {
        return {
            ...old,
            results: old.results.map((row) => updateRow(row)),
        }
    }

    return old
}