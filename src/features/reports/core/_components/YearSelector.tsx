"use client"

import React from "react"
import { VerticalYearPicker } from "./YearCarousel"
import { MonthNavigator } from "./MonthNavigator"
import { useRouter, useSearchParams } from "next/navigation"
import { HoverYearMonthSelector, SegmentedYearMonthSelector } from "./YearSelectors"

export function ReportsHeader() {
    const router = useRouter()
    const searchParams = useSearchParams()

    // Parse URL params - this is the source of truth
    const periodParam = searchParams.get("period")
    const [yearParam, monthParam] = periodParam?.split("-") ?? []
    const urlYear = yearParam ? Number(yearParam) : null
    const urlMonth = monthParam ? Number(monthParam) : null

    // Initialize from URL, then fall back to defaults
    const defaultYear = new Date().getFullYear() - 1
    const defaultMonth = new Date().getMonth() + 1
    const [year, setYear] = React.useState<number>(urlYear ?? defaultYear)
    const [month, setMonth] = React.useState<number>(urlMonth ?? defaultMonth)

    // Sync state with URL on mount and when URL changes
    React.useEffect(() => {
        queueMicrotask(() => {
            if (urlYear !== null) {
                setYear(urlYear)
            }
            if (urlMonth !== null) {
                setMonth(urlMonth)
            }
        })
    }, [urlYear, urlMonth])

    const period = React.useMemo(
        () => `${year}-${String(month).padStart(2, "0")}`,
        [year, month]
    )

    React.useEffect(() => {
        const params = new URLSearchParams(searchParams.toString())

        if (params.get("period") !== period) {
            params.set("period", period)
            router.replace(`?${params.toString()}`, { scroll: false })
        }
    }, [period, router, searchParams])

    return (
        <div className="flex flex-col items-center space-y-4">
            <h1 className="text-xl font-semibold">Reports</h1>
            {/* <VerticalYearPicker
                value={year}
                minYear={2023}
                onChange={(y) => setYear(y)}
                visibleCount={1}
            /> */}

            <VerticalYearPicker
                value={year}
                onChange={setYear}
                minYear={2023} // or church founding year
                maxYear={new Date().getFullYear()}
                
                visibleCount={1}

            />

            <SegmentedYearMonthSelector />
            <HoverYearMonthSelector />

            <MonthNavigator
                mode="timeline"

            />
            <p className="text-sm text-muted-foreground">
                Period: <strong>{period}</strong>
            </p>
        </div>
    )
}
