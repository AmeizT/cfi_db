"use client"

import React from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { useSearchParams } from "next/navigation"

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
    const scrollContainerRef = React.useRef<HTMLDivElement>(null)

    // Get month and year from the URL
    const dateParams = {
        month: params.get("month")?.toLowerCase() || "",
        year: params.get("year") || "",
    }

    // Find the index of the active month based on query params
    const activeMonthIndex = MONTHS.findIndex(
        (m) => m.long === dateParams.month || m.short === dateParams.month
    )

    // Set selectedMonth to the found index or default to the current month
    const [selectedMonth, setSelectedMonth] = React.useState(
        activeMonthIndex !== -1 ? activeMonthIndex : new Date().getMonth()
    )

    React.useEffect(() => {
        if (activeMonthIndex !== -1) {
            setSelectedMonth(activeMonthIndex)
        }
    }, [activeMonthIndex])

    React.
    useEffect(() => {
        if (mode === "timeline" && scrollContainerRef.current) {
            const selectedButton = scrollContainerRef.current.querySelector(
                `[data-month="${selectedMonth}"]`
            )
            if (selectedButton) {
                selectedButton.scrollIntoView({
                    behavior: "smooth",
                    block: "nearest",
                    inline: "center",
                })
            }
        }
    }, [mode, selectedMonth])

    return (
        <div className="space-y-3 pb-4">
            {mode === "timeline" && (
                <div className="relative">
                    {/* Left gradient mask */}
                    <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-12 bg-gradient-to-r from-background to-transparent" />

                    {/* Right gradient mask */}
                    <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-12 bg-gradient-to-l from-background to-transparent" />

                    {/* Scrollable month container */}
                    <div ref={scrollContainerRef} className="grid grid-cols-12 gap-3 overflow-x-auto py-2 no-scrollbar">
                        {MONTHS.map((month, index) => (
                            <Link
                                href={`/reports/stats/monthly?month=${month.long}&year=2025`}
                                key={month.short}
                                data-month={index}
                                className={cn(
                                    "flex-shrink-0 rounded-xl px-6 py-3 text-lg font-semibold transition-all capitalize",
                                    index === selectedMonth
                                        ? "bg-primary text-primary-foreground shadow-md scale-105"
                                        : "bg-slate-100 text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                                )}
                            >
                                {month.short}
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
