export function getInitials(value: string) {
    const parts = value.trim().split(/\s+/).filter(Boolean)
    return `${parts[0]?.[0] ?? "?"}${parts[1]?.[0] ?? ""}`.toUpperCase()
}

export function displayValue(value: string | number | null | undefined) {
    if (value === null || value === undefined || value === "") return "—"
    return String(value)
}

export function formatEntityDate(value: string | null | undefined) {
    if (!value) return "—"
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return "—"
    return new Intl.DateTimeFormat("en", {
        day: "numeric",
        month: "short",
        year: "numeric",
    }).format(date)
}

export function clampPage(page: number) {
    return Number.isFinite(page) && page > 0 ? Math.floor(page) : 1
}

export function getErrorMessage(error: unknown, fallback = "This directory could not be loaded.") {
    return error instanceof Error && error.message ? error.message : fallback
}

export function applySearchParamUpdates(
    current: URLSearchParams | string,
    changes: Record<string, string | number | null | undefined>,
) {
    const params = new URLSearchParams(typeof current === "string" ? current : current.toString())
    Object.entries(changes).forEach(([key, value]) => {
        if (value === null || value === undefined || value === "") params.delete(key)
        else params.set(key, String(value))
    })
    return params
}
