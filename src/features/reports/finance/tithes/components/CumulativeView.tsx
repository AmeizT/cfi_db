"use client"

import * as React from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { formatCurrency } from "@/utils"
import { useUser } from "@/hooks/query/use-user"
import { createQueryString } from "@/features/reports/core/lib/create-query-string"
import { useCumulativeAnalytics } from "../hooks/useCumulativeAnalytics"
import type { CumulativeTableRow } from "../types"
import { BASE_PATH, getSelectedYear, getVisibleMonthCount, MONTHS } from "../utils/helpers"
import { toNumber } from "../utils/formatters"
import { EmptyState } from "./EmptyState"
import { MonthlySummaryTable } from "./MonthlySummaryTable"

export function CumulativeView({
    reportId,
}: {
    reportId: string | null
}) {
    const searchParams = useSearchParams()
    const { data: user } = useUser()
    const year = getSelectedYear(searchParams)
    const language = user?.assembly?.locale
    const currency = user?.assembly?.currency
    const scopeFilters = React.useMemo(() => ({
        country: searchParams.get("country"),
        region_id: searchParams.get("region_id"),
        zone_id: searchParams.get("zone_id"),
        assembly_id: searchParams.get("assembly_id"),
    }), [searchParams])
    const analytics = useCumulativeAnalytics({
        reportId,
        period: `year:${year}`,
        scopeFilters,
    })
    const visibleMonthCount = getVisibleMonthCount(year)
    const statements = analytics.data?.data?.statements ?? []
    const visibleStatements = statements.filter((row) => (
        Number(row.month) <= visibleMonthCount
    ))
    const config = analytics.data?.meta?.config ?? analytics.data?.table_schema

    if (analytics.isLoading) {
        return <EmptyState>Loading cumulative tithe analytics...</EmptyState>
    }

    if (visibleMonthCount === 0) {
        return <EmptyState>Cumulative tithe data is not available for a future reporting year.</EmptyState>
    }

    const cumulativeData = visibleStatements.reduce<{
        runningTotal: number
        rows: CumulativeTableRow[]
    }>((acc, row) => {
        const monthIndex = Number(row.month) - 1
        const total = toNumber(row.total)
        const nextRunningTotal = acc.runningTotal + total

        return {
            runningTotal: nextRunningTotal,
            rows: [
                ...acc.rows,
                {
                    id: Number(row.month),
                    label: row.label || MONTHS[monthIndex],
                    total: row.total,
                    previous_total: row.previous_total,
                    change: row.change,
                    givers: row.givers,
                    median: row.median,
                    highest_amount: row.highest_amount,
                },
            ],
        }
    }, { runningTotal: 0, rows: [] })
    const tableRows = cumulativeData.rows
    const runningTotal = cumulativeData.runningTotal

    if (tableRows.every((row) => toNumber(row.total) === 0)) {
        return <EmptyState>No cumulative tithe data is available for this year.</EmptyState>
    }

    const now = new Date()
    const currentMonth = year === now.getFullYear() ? now.getMonth() + 1 : 12
    const currentMonthTotal = tableRows.find((row) => row.id === currentMonth)?.total ?? tableRows.at(-1)?.total ?? 0
    const contributorsYtd = toNumber(analytics.data?.meta?.kpis?.givers)
    const average = toNumber(analytics.data?.meta?.kpis?.average)
    const maxTotal = Math.max(...tableRows.map((row) => toNumber(row.total)), 1)

    return (
        <div className="grid gap-4">
            <div className="grid gap-3 md:grid-cols-4">
                {[
                    ["Year-to-Date Tithes", runningTotal],
                    ["Current Month Tithes", toNumber(currentMonthTotal)],
                    ["Average Monthly Tithes", average],
                    ["Contributors Year-to-Date", contributorsYtd],
                ].map(([label, value]) => (
                    <div key={label} className="rounded-lg border border-border bg-card p-4">
                        <p className="text-sm text-muted-foreground">{label}</p>
                        <p className="mt-2 text-xl font-semibold text-foreground">
                            {typeof value === "number" && label !== "Contributors Year-to-Date"
                                ? formatCurrency(value, { language, currency })
                                : value}
                        </p>
                    </div>
                ))}
            </div>

            <div className="rounded-lg border border-border p-4">
                <p className="text-sm font-semibold text-foreground">Monthly Tithes and Running Year-to-Date Total</p>
                <div className="mt-4 grid gap-2">
                    {tableRows.map((row) => {
                        const total = toNumber(row.total)

                        return (
                            <Link
                                key={row.id}
                                href={`${BASE_PATH}?${createQueryString(searchParams, {
                                    status: null,
                                    year,
                                    month: row.id,
                                })}`}
                                className="grid gap-2 rounded-md p-2 hover:bg-accent sm:grid-cols-[120px_1fr_160px]"
                            >
                                <span className="text-sm font-medium">{row.label}</span>
                                <span className="h-3 rounded-full bg-muted">
                                    <span
                                        className="block h-3 rounded-full bg-primary"
                                        style={{ width: `${Math.max(4, (total / maxTotal) * 100)}%` }}
                                    />
                                </span>
                                <span className="text-right text-sm tabular-nums">
                                    {formatCurrency(total, { language, currency })}
                                </span>
                            </Link>
                        )
                    })}
                </div>
            </div>

            <MonthlySummaryTable rows={tableRows} config={config} />
        </div>
    )
}
