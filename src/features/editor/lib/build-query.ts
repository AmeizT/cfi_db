export function buildQuery(
    searchParams: URLSearchParams,
    updates: Record<string, string | number | null>
) {
    const params = new URLSearchParams(searchParams)

    Object.entries(updates).forEach(([key, value]) => {
        if (value === null) {
            params.delete(key)
        } else {
            params.set(key, String(value))
        }
    })

    return params.toString()
}