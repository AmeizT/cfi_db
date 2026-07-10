"use client"

import type { ReactNode } from "react"
import { BarChart3Icon, LineChartIcon, TrendingUpIcon, WalletIcon } from "lucide-react"
import View from "@/components/ui/view"
import { PeriodSelector } from "@/features/reports/statements/components/PeriodSelector"

const kpis = [
    {
        label: "Reports Filed",
        value: "4 / 4",
        detail: "Core modules complete",
        icon: <BarChart3Icon className="size-4" />,
    },
    {
        label: "Total Tithes",
        value: "BWP 89,450",
        detail: "Placeholder year-to-date value",
        icon: <WalletIcon className="size-4" />,
    },
    {
        label: "Avg. Attendance",
        value: "642",
        detail: "Sunday service average",
        icon: <TrendingUpIcon className="size-4" />,
    },
    {
        label: "Net Balance",
        value: "BWP 84,660",
        detail: "Income less expenditure",
        icon: <LineChartIcon className="size-4" />,
    },
] as const

function KpiCard({
    label,
    value,
    detail,
    icon,
}: {
    label: string
    value: string
    detail: string
    icon: ReactNode
}) {
    return (
        <div className="rounded-lg border border-border bg-card p-4">
            <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-medium text-muted-foreground">
                    {label}
                </p>
                <div className="text-muted-foreground">{icon}</div>
            </div>
            <p className="mt-3 text-2xl font-semibold tracking-tight text-foreground">
                {value}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">{detail}</p>
        </div>
    )
}

function ChartPanel({
    title,
    description,
}: {
    title: string
    description: string
}) {
    return (
        <div className="rounded-lg border border-border bg-card p-4">
            <div>
                <h2 className="text-base font-semibold text-foreground">
                    {title}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                    {description}
                </p>
            </div>
            <div className="mt-4 flex h-64 items-center justify-center rounded-lg border border-dashed border-border bg-muted/30 text-sm text-muted-foreground">
                Chart data will appear when the analytics API is connected.
            </div>
        </div>
    )
}

export function ReportsOverviewPageView() {
    return (
        <View className="gap-0">
            <View.Header
                pagename="Overview"
                description="Reporting KPIs, trends, and charts across finance and ministry."
                actions={<PeriodSelector />}
            />

            <View.Body className="gap-4 py-4">
                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                    {kpis.map((kpi) => (
                        <KpiCard key={kpi.label} {...kpi} />
                    ))}
                </div>

                <div className="grid gap-4 xl:grid-cols-2">
                    <ChartPanel
                        title="Financial Trend"
                        description="Revenue, tithes, expenditure, and balance over time."
                    />
                    <ChartPanel
                        title="Ministry Trend"
                        description="Attendance movement and ministry participation."
                    />
                </div>
            </View.Body>
        </View>
    )
}
