import type { AssemblyReport } from "@/dal/types"

export const ALL_REPORTS_PAGE_SIZE = 500

export type ReportPeriod = {
    date: Date
    month: number
    year: number
}

export function getReportRows(response: unknown): AssemblyReport[] {
    if (Array.isArray(response)) return response as AssemblyReport[]
    if (!response || typeof response !== "object") return []

    const data = "data" in response ? response.data : undefined
    const results = "results" in response ? response.results : undefined

    if (Array.isArray(data)) return data as AssemblyReport[]
    if (Array.isArray(results)) return results as AssemblyReport[]

    return []
}

export function getReportPeriod(report: Pick<AssemblyReport, "period_start">): ReportPeriod | null {
    const match = /^(\d{4})-(\d{2})/.exec(report.period_start)
    if (!match) return null

    const year = Number(match[1])
    const month = Number(match[2]) - 1
    if (!Number.isInteger(year) || month < 0 || month > 11) return null

    return {
        date: new Date(year, month, 1),
        month,
        year,
    }
}

export function getReportPeriodKey(year: number, month: number) {
    return `${year}-${String(month + 1).padStart(2, "0")}`
}

export function sortReportsByPeriod(reports: AssemblyReport[]) {
    return [...reports]
        .filter((report) => getReportPeriod(report) !== null)
        .sort((left, right) => {
            const leftPeriod = getReportPeriod(left)
            const rightPeriod = getReportPeriod(right)
            return (leftPeriod?.date.getTime() ?? 0) - (rightPeriod?.date.getTime() ?? 0)
        })
}

/**
 * Selects the newest available report before the current calendar month. When
 * no prior period exists, the newest valid report is used as a safe fallback.
 */
export function resolveLatestRelevantReport(
    reports: AssemblyReport[],
    now = new Date(),
) {
    const sorted = sortReportsByPeriod(reports)
    const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime()

    return sorted.findLast((report) => {
        const period = getReportPeriod(report)
        return period ? period.date.getTime() < currentMonth : false
    }) ?? sorted.at(-1)
}

export function hasValidReportId(reportId: string | null | undefined) {
    if (!reportId) return false
    const value = Number(reportId)
    return Number.isInteger(value) && value > 0
}

export function resolveReportSelection(
    reports: AssemblyReport[],
    reportId?: string | null,
    now = new Date(),
) {
    if (hasValidReportId(reportId)) {
        const explicitReport = reports.find((report) => String(report.id) === reportId)
        if (explicitReport) return explicitReport
    }

    return resolveLatestRelevantReport(reports, now)
}

export function createReportSelectionQuery(
    searchParams: URLSearchParams | Readonly<URLSearchParams>,
    report: AssemblyReport,
    options: {
        defaultTab?: string
        resetPage?: boolean
    } = {},
) {
    const params = new URLSearchParams(searchParams)
    const period = getReportPeriod(report)

    params.set("reportId", String(report.id))
    for (const alias of ["reportid", "report_id", "id"]) {
        params.delete(alias)
    }

    const currentPage = Number(params.get("page"))
    if (options.resetPage || !Number.isInteger(currentPage) || currentPage < 1) {
        params.set("page", "1")
    }

    if (period) {
        params.set("period", `year:${period.year}`)
    }

    if (options.defaultTab && !params.get("tab")) {
        params.set("tab", options.defaultTab)
    }

    return params.toString()
}
