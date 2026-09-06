const DAY = 86_400_000

function dateOnly(value: string) {
    const parsed = new Date(`${value.slice(0, 10)}T00:00:00Z`)
    return Number.isNaN(parsed.getTime()) ? null : parsed
}

function monday(date: Date) {
    return date.getTime() - ((date.getUTCDay() + 6) % 7) * DAY
}

/** Label existing attendance records using Monday–Sunday reporting weeks. */
export function attendanceReportingWeek(timestamp: string, periodStart?: string, periodEnd?: string) {
    const date = dateOnly(timestamp)
    if (!date) return { key: "undated", label: "Homecell Attendance — date unavailable" }
    const start = (periodStart && dateOnly(periodStart)) || dateOnly(`${timestamp.slice(0, 7)}-01`)!
    const end = (periodEnd && dateOnly(periodEnd)) || new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth() + 1, 0))
    const weekStart = monday(date)
    const weekNumber = Math.floor((weekStart - monday(start)) / (7 * DAY)) + 1
    const from = new Date(Math.max(weekStart, start.getTime()))
    const to = new Date(Math.min(weekStart + 6 * DAY, end.getTime()))
    const format = (value: Date) => value.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" })
    return {
        key: new Date(weekStart).toISOString().slice(0, 10),
        label: `Week ${weekNumber} — Homecell Attendance · ${format(from)} – ${format(to)}`,
    }
}
