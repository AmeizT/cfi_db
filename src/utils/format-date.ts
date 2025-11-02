import { format, parseISO } from "date-fns"

export function formatDate(dateString: string | null | undefined): string {
    if (!dateString) return "No date provided"
    try {
        return format(parseISO(dateString), "MMMM d, yyyy")
    } catch (error: unknown) {
        console.error("Failed to format date:", error)
        return "Invalid date"
    }
}