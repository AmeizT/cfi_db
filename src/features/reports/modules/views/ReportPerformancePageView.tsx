"use client"

import type { ReactNode } from "react"
import Link from "next/link"
import {
    usePathname,
    useSearchParams,
    type ReadonlyURLSearchParams,
} from "next/navigation"
import { ActivityIcon, GaugeIcon, TargetIcon, TrendingUpIcon } from "lucide-react"
import View from "@/components/ui/view"
import { PeriodSelector } from "@/features/reports/statements/components/PeriodSelector"
import { createQueryString } from "@/features/reports/core/lib/create-query-string"

type PerformanceModule = "overview" | "tithes" | "attendance"

const performanceTabs = [
    { label: "Overview", key: "overview", href: "/reports/performance" },
    { label: "Tithes", key: "tithes", href: "/reports/performance/tithes" },
    { label: "Attendance", key: "attendance", href: "/reports/performance/attendance" },
] as const

const performanceRows = [
    {
        module: "Tithes",
        actual: "BWP 89,450",
        target: "BWP 95,000",
        variance: "-BWP 5,550",
        achievement: "94%",
        grade: "On Track",
    },
    {
        module: "Attendance",
        actual: "642 avg.",
        target: "700 avg.",
        variance: "-58",
        achievement: "92%",
        grade: "Watch",
    },
] as const

function getTabs(searchParams: ReadonlyURLSearchParams) {
    return performanceTabs.map((tab) => {
        const query = createQueryString(searchParams, {})
        return {
            ...tab,
            href: query ? `${tab.href}?${query}` : tab.href,
        }
    })
}

function MetricCard({
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

function PerformanceTable({
    module,
    searchParams,
}: {
    module: PerformanceModule
    searchParams: ReadonlyURLSearchParams
}) {
    const rows =
        module === "overview"
            ? performanceRows
            : performanceRows.filter((row) => row.module.toLowerCase() === module)
    const query = createQueryString(searchParams, {})

    return (
        <div className="overflow-hidden rounded-lg border border-border bg-card">
            <div className="grid grid-cols-6 border-b border-border bg-muted/40 px-4 py-3 text-xs font-semibold uppercase text-muted-foreground">
                <span>Module</span>
                <span>Actual</span>
                <span>Target</span>
                <span>Variance</span>
                <span>Achievement</span>
                <span>Grade</span>
            </div>
            {rows.map((row) => (
                <div
                    key={row.module}
                    className="grid grid-cols-6 items-center border-b border-border px-4 py-3 text-sm last:border-b-0"
                >
                    <Link
                        href={
                            query
                                ? `/reports/performance/${row.module.toLowerCase()}?${query}`
                                : `/reports/performance/${row.module.toLowerCase()}`
                        }
                        className="font-medium text-foreground hover:text-primary"
                    >
                        {row.module}
                    </Link>
                    <span>{row.actual}</span>
                    <span>{row.target}</span>
                    <span className="text-amber-700">{row.variance}</span>
                    <span>{row.achievement}</span>
                    <span>{row.grade}</span>
                </div>
            ))}
        </div>
    )
}

export function ReportPerformancePageView({
    module = "overview",
}: {
    module?: PerformanceModule
}) {
    const pathname = usePathname()
    const searchParams = useSearchParams()

    return (
        <View className="gap-0">
            <View.Header
                pagename="Performance"
                description="Actuals versus targets for core reporting modules."
                actions={<PeriodSelector />}
                pathname={pathname}
                tabs={getTabs(searchParams)}
                activeTab={module}
            />

            <View.Body className="gap-4 py-4">
                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                    <MetricCard
                        label="Achievement"
                        value={module === "attendance" ? "92%" : "94%"}
                        detail="Actual against target"
                        icon={<TargetIcon className="size-4" />}
                    />
                    <MetricCard
                        label="Variance"
                        value={module === "attendance" ? "-58" : "-5.8%"}
                        detail="Current period gap"
                        icon={<ActivityIcon className="size-4" />}
                    />
                    <MetricCard
                        label="Grade"
                        value={module === "attendance" ? "B" : "A-"}
                        detail="Placeholder grading model"
                        icon={<GaugeIcon className="size-4" />}
                    />
                    <MetricCard
                        label="Trend"
                        value="+3.2%"
                        detail="Compared with prior period"
                        icon={<TrendingUpIcon className="size-4" />}
                    />
                </div>

                <PerformanceTable
                    module={module}
                    searchParams={searchParams}
                />
            </View.Body>
        </View>
    )
}
