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

    if (typeof old === "object" && old !== null) {
        const envelope = old as Record<string, unknown>
        const updated = { ...envelope }

        for (const key of ["rows", "results", "data"] as const) {
            if (Array.isArray(envelope[key])) {
                updated[key] = envelope[key].map((row) => updateRow(row as Record<string, unknown>))
            }
        }

        return updated
    }

    return old
}
