export function toNumber(value: string | number | null | undefined) {
    const number = Number(value ?? 0)
    return Number.isFinite(number) ? number : 0
}

export function formatDate(value?: string | null) {
    if (!value) return "-"
    return new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date(value))
}
