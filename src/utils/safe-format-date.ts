import { format, parseISO, isValid } from "date-fns"

export function safeFormatDate(date?: string | null) {
    if (!date) return "—"

    const parsed = parseISO(date)
    if (!isValid(parsed)) return "—"

    return format(parsed, "MMM d, yyyy")
}