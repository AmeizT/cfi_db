"use client"

import { useMemo } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import {
    format,
    eachMonthOfInterval,
    startOfYear,
    endOfYear,
} from "date-fns"

import {
    Accordion,
    AccordionItem,
    AccordionTrigger,
    AccordionContent,
} from "@/components/ui/accordion"
import { useReports } from "../hooks/use-reports"
import { ReportCard } from "./ReportCard"
import React from "react"
import { MonthlyReport } from "../schemas/report"
import { PlaceholderReport } from "../types/placeholder-report"
import { Section } from "../types/section.type"
import Link from "next/link"

type ViewMode = "grouped" | "board" | "timeline"

const BASE_YEAR = 2023

export function ReportsList() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const pathname = usePathname()
    const currentYear = new Date().getFullYear()
    const periodParam = searchParams.get("period")
    const selectedYear = String(periodParam ?? currentYear)
    const viewParam = (searchParams.get("view") as ViewMode) ?? "grouped"

    // ----------------------------
    // 2️⃣ Fetch reports
    // ----------------------------
    const { data: reports = [], isLoading } = useReports({
        year: selectedYear,
    })

    // ----------------------------
    // 3️⃣ Generate expected months + detect missing
    // ----------------------------
    const groupedReports = useMemo(() => {
        const expectedMonths = eachMonthOfInterval({
            start: startOfYear(new Date(Number(selectedYear), 0)),
            end: endOfYear(new Date(Number(selectedYear), 0)),
        })

        const reportMap = new Map(
            reports.map((r) => [
                format(new Date(r.period_start), "yyyy-MM"),
                r,
            ])
        )

        interface ReportPartialProps {
            id: string
            period_start: string
            status: string | "missing"
        }

        const missing: ReportPartialProps[] = []
        const draft: MonthlyReport[] = []
        const finalized: MonthlyReport[] = []

        expectedMonths.forEach((monthDate) => {
            const key = format(monthDate, "yyyy-MM")
            const existing = reportMap.get(key)

            if (!existing) {
                missing.push({
                    id: `missing-${key}`,
                    period_start: String(monthDate),
                    status: "missing",
                })
            } else if (existing.status === "draft") {
                // draft.push(existing)
            } else {
                // finalized.push(existing)
            }
        })

        return { missing, draft, finalized }
    }, [reports, selectedYear])

    // ----------------------------
    // 4️⃣ Year navigation
    // ----------------------------
    const years = useMemo(() => {
        return Array.from(
            { length: currentYear - BASE_YEAR + 1 },
            (_, i) => BASE_YEAR + i
        )
    }, [currentYear])



    // ----------------------------
    // 5️⃣ View navigation
    // ----------------------------
    const createQueryString = React.useCallback(
        (updates: Record<string, string | null>) => {
            const params = new URLSearchParams(searchParams.toString())

            Object.entries(updates).forEach(([key, value]) => {
                if (value === null) {
                    params.delete(key)
                } else {
                    params.set(key, value)
                }
            })

            return params.toString()
        },
        [searchParams]
    )

    const handleYearChange = (year: number) => {
        router.push(pathname + '?' + createQueryString({ period: String(year) }))
    }

    const handleViewChange = (view: ViewMode) => {
        router.push(pathname + '?' + createQueryString({ view }))
    }

    // ----------------------------
    // 6️⃣ Navigation handler
    // ----------------------------
    const handleReportClick = (reportId: string | number) => {
        router.push(pathname + '?' + createQueryString({ rid: String(reportId) }))
    }

    const getSections = (report: MonthlyReport | PlaceholderReport): Section[] => {
        const data = report.data || { attendances: [], tithes: [], incomes: [], expenditures: [] }
        return [
            { id: "attendance", title: "Attendance", submitted: data.attendances.length > 0 },
            { id: "tithes", title: "Tithes", submitted: data.tithes.length > 0 },
            { id: "incomes", title: "Incomes", submitted: data.incomes.length > 0 },
            { id: "expenditures", title: "Expenditures", submitted: data.expenditures.length > 0 },
        ]
    }

    if (isLoading) {
        return <div className="p-6">Loading reports...</div>
    }

    return (
        <div className="space-y-6 flex gap-4">
            <div className="w-60 flex flex-wrap gap-2 sticky top-80">
                <ul className="flex flex-col gap-2">
                    {years.map((year) => (
                        <li key={year}>
                            <button
                                
                                onClick={() => handleYearChange(year)}
                                className={`font-bold ${Number(selectedYear) === year
                                    ? "text-gray-800 text-3xl"
                                    : "text-gray-300 text-3xl"
                                    }`}
                            >
                                {year}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="grow">
                <div className="flex gap-2">
                    {(["grouped", "board", "timeline"] as ViewMode[]).map((mode) => (
                        <button
                            key={mode}
                            onClick={() => handleViewChange(mode)}
                            className={`px-3 py-1 rounded-md border ${viewParam === mode
                                ? "text-gray-800 text-3xl"
                                : "text-gray-400 text-2xl"
                                }`}
                        >
                            {mode}
                        </button>
                    ))}
                </div>

                {viewParam === "grouped" && (
                    <Accordion type="multiple" className="w-full space-y-4">

                        {/* Missing */}
                        <AccordionItem value="missing">
                            <AccordionTrigger>
                                Missing ({groupedReports.missing.length})
                            </AccordionTrigger>
                            <AccordionContent>
                                <div className="grid md:grid-cols-3 gap-4">
                                    {groupedReports.missing.map((report) => (
                                        <div key={report?.id}>
                                            {report?.status}
                                        </div>
                                    ))}
                                </div>
                            </AccordionContent>
                        </AccordionItem>

                        {/* Draft */}
                        <AccordionItem value="draft">
                            <AccordionTrigger>
                                Draft ({groupedReports.draft.length})
                            </AccordionTrigger>
                            <AccordionContent>
                                <div className="grid md:grid-cols-3 gap-4">
                                    {groupedReports.draft.map((report) => (
                                        <Link key={report?.id}
                                            href={`${pathname}?${createQueryString({ rid: String(report?.id), mode: "details", tab: "attendance" })}`}>
                                            <ReportCard
                                                month={format(
                                                    new Date(report.period_start),
                                                    "MMMM"
                                                )}
                                                status={report.status}
                                                onClick={() =>
                                                    handleReportClick(report.id)
                                                }
                                                sections={getSections(report)}
                                            />
                                        </Link>
                                    ))}
                                </div>
                            </AccordionContent>
                        </AccordionItem>

                        {/* Finalized */}
                        <AccordionItem value="finalized">
                            <AccordionTrigger>
                                Finalized ({groupedReports.finalized.length})
                            </AccordionTrigger>
                            <AccordionContent>
                                <div className="grid md:grid-cols-3 gap-4">
                                    {groupedReports.finalized.map((report) => (
                                        <Link
                                            key={report?.id}
                                            href={`${pathname}?${createQueryString({ rid: String(report?.id), mode: "details", tab: "attendance" })}`}>
                                            <ReportCard
                                                key={report.id}
                                                month={format(
                                                    new Date(report.period_start),
                                                    "MMMM"
                                                )}
                                                status={report.status}
                                                onClick={() =>
                                                    handleReportClick(report.id)
                                                }
                                                sections={getSections(report)}
                                            />
                                        </Link>
                                    ))}
                                </div>
                            </AccordionContent>
                        </AccordionItem>

                    </Accordion>
                )}

                {viewParam === "board" && (
                    <div className="text-muted-foreground">
                        Board view implementation here
                    </div>
                )}

                {viewParam === "timeline" && (
                    <div className="text-muted-foreground">
                        Timeline view implementation here
                    </div>
                )}
            </div>
        </div>
    )
}



