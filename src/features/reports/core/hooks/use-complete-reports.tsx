
"use client"

import { useReports } from "./use-reports"
import { useSearchParams } from "next/navigation"
import { MonthlyReport } from "../schemas/report"
import { eachMonthOfInterval, startOfYear, getYear } from "date-fns"

export function useCompleteReports() {
    const searchParams = useSearchParams()
    const currentYear = getYear(new Date())
    const year = searchParams.get("year")
    const yearValue = typeof year === "string" ? parseInt(year, 10) : currentYear

    const { data: reports = [], isLoading, isError } = useReports({ year: year ?? undefined })

    function getReportingMonth(date: Date) {
        const d = new Date(date)
        if (d.getDate() < 5) d.setMonth(d.getMonth() - 1)
        return d.getMonth()
    }

    const reportingMonth = getReportingMonth(new Date())

    // Build the full list of months for the year up to current reporting month
    const allMonths = eachMonthOfInterval({
        start: startOfYear(new Date(yearValue)),
        end: new Date(yearValue, reportingMonth, 1),
    })

    // Ensure each month has a report (real or placeholder)
    // const completeReports = allMonths.map((monthDate) => {
    //     const existingReport = reports.find(
    //         (r: MonthlyReport) =>
    //             new Date(r.period_start).getMonth() === monthDate.getMonth() &&
    //             new Date(r.period_start).getFullYear() === monthDate.getFullYear()
    //     )

    //     if (existingReport) return existingReport

    //     return {
    //         id: -1 * (monthDate.getFullYear() * 100 + monthDate.getMonth()),
    //         period_start: monthDate.toISOString(),
    //         status: "missing",
    //         data: { attendances: [], tithes: [], incomes: [], expenditures: [] },
    //         isPlaceholder: true,
    //     }
    // })

    // return { completeReports, isLoading, isError, yearValue }
}
