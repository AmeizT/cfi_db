"use client"

import React from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { useSearchParams } from "next/navigation"
import { useCompleteReports } from "../hooks/use-complete-reports"

const MONTHS = [
    { short: "jan", long: "january" },
    { short: "feb", long: "february" },
    { short: "mar", long: "march" },
    { short: "apr", long: "april" },
    { short: "may", long: "may" },
    { short: "jun", long: "june" },
    { short: "jul", long: "july" },
    { short: "aug", long: "august" },
    { short: "sep", long: "september" },
    { short: "oct", long: "october" },
    { short: "nov", long: "november" },
    { short: "dec", long: "december" },
]

interface MonthNavigatorProps {
    mode: "arrows" | "timeline"
}

export function MonthNavigator({ mode }: MonthNavigatorProps) {
    const params = useSearchParams()
    // const { completeReports, yearValue } = useCompleteReports()
    const scrollContainerRef = React.useRef<HTMLDivElement>(null)

    const period = params.get("period") // format: YYYY-MM

    const [yearParam, monthParam] = period?.split("-") ?? []

    // const activeYear = yearParam ? Number(yearParam) : yearValue
    const activeYear = yearParam ? Number(yearParam) : 2026
    const activeMonthIndex = monthParam
        ? Number(monthParam) - 1
        : new Date().getMonth()

    React.useEffect(() => {
        if (mode === "timeline" && scrollContainerRef.current) {
            const selectedButton = scrollContainerRef.current.querySelector(
                `[data-month="${activeMonthIndex}"]`
            )
            if (selectedButton) {
                selectedButton.scrollIntoView({
                    behavior: "smooth",
                    block: "nearest",
                    inline: "center",
                })
            }
        }
    }, [mode, activeMonthIndex])

    const getStatusBadge = (status?: string) => {
        const map: Record<string, string> = {
            finalized: "text-emerald-500 bg-emerald-500/15",
            draft: "text-amber-500 bg-amber-500/15",
            missing: "text-rose-500 bg-rose-500/15",
        }
        return map[status || "missing"] || map.missing
    }

    const getStatusBorder = (status?: string) => {
        const map: Record<string, string> = {
            finalized: "border-emerald-500/40 bg-emerald-500/5 dark:bg-emerald-500/10 text-emerald-500",
            draft: "border-amber-500/30 bg-amber-500/5 dark:bg-amber-500/10 text-amber-500",
            missing: "border-rose-500/30 bg-rose-500/5 dark:bg-rose-500/10 text-rose-500",
        }
        return map[status || "missing"] || map.missing
    }

    return (
        <div className="py-2">
            {mode === "timeline" && (
                <div className="relative">
                    <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-12 bg-linear-to-r from-background to-transparent" />
                    <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-12 bg-linear-to-l from-background to-transparent" />

                    <div
                        ref={scrollContainerRef}
                        className="py-2 grid grid-cols-12 gap-3 overflow-x-auto no-scrollbar"
                    >
                        {MONTHS.map((month, index) => {
                            // const report = completeReports.find(
                            //     (r) =>
                            //         new Date(r.period_start).getMonth() === index &&
                            //         new Date(r.period_start).getFullYear() === activeYear
                            // )
                            const status = "missing"

                            const nextPeriod = `${activeYear}-${String(index + 1).padStart(2, "0")}`

                            return (
                                <Link
                                    href={`/reports/finance?period=${nextPeriod}`}
                                    key={month.short}
                                    data-month={index}
                                    className={cn(
                                        "p-1.5 w-full h-20 relative flex flex-col justify-between items-center shrink-0 rounded-[14px] text-lg font-semibold transition-all capitalize border active:scale-95 ease-[cubic-bezier(0.25,1,0.5,1)]",
                                        index === activeMonthIndex
                                            ? `${getStatusBorder(status)} shadow-md`
                                            : "border-gray-200 dark:border-neutral-700 bg-white dark:bg-linear-to-b dark:from-neutral-800 dark:to-neutral-900 text-muted-foreground dark:text-white dark:hover:border-neutral-600 hover:bg-slate-50 hover:text-foreground"
                                    )}
                                >
                                    {month.short}
                                    <span
                                        className={cn(
                                            "py-1.5 w-full flex justify-center text-xs rounded-xl",
                                            getStatusBadge(status)
                                        )}
                                    >
                                    </span>
                                </Link>
                            )
                        })}
                    </div>
                </div>
            )}
        </div>
    )
}