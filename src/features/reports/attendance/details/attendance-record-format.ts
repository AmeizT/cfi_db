import type { AttendanceRecordDetail } from "./attendance-record-detail"

export function humanizeAttendanceValue(value?: string | null) {
    if (!value) return "Not recorded"

    return value
        .replaceAll("_", " ")
        .replaceAll("-", " ")
        .replace(/\b\w/g, (letter) => letter.toUpperCase())
}

export function getAttendanceRecordTitle(record: AttendanceRecordDetail) {
    if (record.is_special_event && record.special_event_name?.trim()) {
        return record.special_event_name.trim()
    }

    const service = humanizeAttendanceValue(record.service_type)
    return service.toLowerCase().endsWith("service")
        ? service
        : `${service} Service`
}

export function formatAttendanceDate(value: string) {
    const date = new Date(`${value.slice(0, 10)}T00:00:00`)

    if (Number.isNaN(date.getTime())) return value

    return new Intl.DateTimeFormat("en", {
        day: "numeric",
        month: "long",
        year: "numeric",
    }).format(date)
}

export function getAttendanceDateParts(value: string) {
    const date = new Date(`${value.slice(0, 10)}T00:00:00`)

    if (Number.isNaN(date.getTime())) {
        return { day: value, month: "Date" }
    }

    return {
        day: new Intl.DateTimeFormat("en", { day: "2-digit" }).format(date),
        month: new Intl.DateTimeFormat("en", { month: "short" })
            .format(date)
            .toUpperCase(),
    }
}

export function formatAttendanceDateTime(value?: string | null) {
    if (!value) return "Not recorded"

    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return value

    return new Intl.DateTimeFormat("en", {
        dateStyle: "medium",
        timeStyle: "short",
    }).format(date)
}

export function parseAttendanceList(value?: string | null) {
    if (!value?.trim()) return []

    return value
        .split(/[,;\n]+/)
        .map((item) => item.trim())
        .filter(Boolean)
}

export function safeAttendanceReturnPath(
    value: string | null,
    fallback: string
) {
    if (!value?.startsWith("/") || value.startsWith("//")) return fallback
    return value
}
