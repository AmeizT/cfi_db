"use client"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { format, getMonth, getYear } from "date-fns"
import { Button } from "@/components/ui/button"
import { IconCaretDownFilled } from "@tabler/icons-react"
import { MonthlyReport } from "@/features/reports/core/schemas/report"
import { resolveMonth } from "../lib/format-month"
import { buildQuery } from "../lib/build-query"
import { Separator } from "@/components/ui/separator"

interface ReportSelectorProps {
    selectedMonth: string | null
    selectedYear: number
    reports: MonthlyReport[]
}

function getReportMonthYear(report: MonthlyReport | null) {
    if (!report) {
        const now = new Date()
        return {
            month: format(now, "MMMM"),
            year: getYear(now),
        }
    }

    const date = new Date(report.period_start)

    return {
        month: format(date, "MMMM"),
        year: getYear(date),
    }
}

export function ReportSelector({ reports }: ReportSelectorProps) {
    const searchParams = useSearchParams()
    const reportId = searchParams.get("reportId")

    const selectedReport =
        reports.find(r => String(r.id) === reportId) ??
        (resolveMonth({
            year: getYear(new Date()),
            reports,
        })
            ? reports.find(
                r =>
                    getMonth(new Date(r.period_start)) + 1 ===
                    resolveMonth({
                        year: getYear(new Date()),
                        reports,
                    })
            )
            : null)

    const { month: displayMonth, year: displayYear } = getReportMonthYear(selectedReport || null)

    const reportsByYear = reports.reduce<Record<number, MonthlyReport[]>>(
        (acc, report) => {
            const year = getYear(new Date(report.period_start))
            acc[year] ??= []
            acc[year].push(report)
            return acc
        },
        {}
    )

    const years = Object.keys(reportsByYear)
        .map(Number)
        .sort((a, b) => b - a)

    return (
        <div className="p-0.5 h-8 flex items-center border border-border rounded-lg shadow-xs">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="px-2 border-none shadow-none min-h-full hover:scale-100 active:scale-100">
                        {displayMonth}
                        <IconCaretDownFilled className="size-4" />
                    </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent>
                    {!selectedReport && (
                        <DropdownMenuItem disabled>
                            No reports available
                        </DropdownMenuItem>
                    )}

                    {reportsByYear[displayYear]?.map(report => (
                        <DropdownMenuItem key={report.id} asChild>
                            <Link
                                href={{
                                    pathname: "/manage",
                                    search: buildQuery(searchParams, {
                                        reportId: report.id,
                                    }),
                                }}
                                className="py-1! rounded-md! text-sm focus:bg-gray-200/60"
                            >
                                {format(
                                    new Date(report.period_start),
                                    "MMMM"
                                )}
                            </Link>
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>

            <Separator 
                orientation="vertical" 
                className="data-[orientation=vertical]:h-4.5" 
            />

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="px-2 border-none shadow-none min-h-full hover:scale-100 active:scale-100">
                        {displayYear}
                        <IconCaretDownFilled className="size-4" />
                    </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent>
                {years.map(year => {
                    const firstReportOfYear =
                        reportsByYear[year]?.[0]

                    return (
                        <DropdownMenuItem key={year} asChild>
                            <Link
                                href={{
                                    pathname: "/manage",
                                    search: buildQuery(searchParams, {
                                        reportId:
                                            firstReportOfYear?.id ?? null,
                                    }),
                                }}
                                className="py-1! rounded-md! text-sm focus:bg-gray-200/60"
                            >
                                {year}
                            </Link>
                        </DropdownMenuItem>
                    )
                })}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}