import { format, getMonth, getYear } from "date-fns"

interface ResolveMonthParams {
    year: number
    reports: { period_start: string }[]
}

export function resolveMonth({ year, reports }: ResolveMonthParams) {
    if (!reports.length) return null

    const currentYear = getYear(new Date())
    const currentMonth = getMonth(new Date()) + 1

    if (year === currentYear) {
        const previousMonth = Math.max(currentMonth - 1, 1)

        const match = reports.find(
            r => getMonth(new Date(r.period_start)) + 1 === previousMonth
        )

        return match
            ? previousMonth
            : getMonth(new Date(reports.at(-1)!.period_start)) + 1
    }

    return getMonth(new Date(reports[0].period_start)) + 1
}

export function formatMonthLabel(month: string | number | null, year: number) {
    const m = Number(month)
    if (!m || m < 1 || m > 12) return "Select month"

    return format(new Date(year, m - 1, 1), "MMMM")
}