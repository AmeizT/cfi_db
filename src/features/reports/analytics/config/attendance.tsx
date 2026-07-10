import { parseTab } from "@/utils/parse-tab"
import { formatNumber } from "@/utils/currency"
import { useSearchParams } from "next/navigation"
import { AnalyticsConfig } from "../types/analytics.types"
import { useAttendanceAnalytics } from "../../core/hooks/use-analytics"
import { createQueryString } from "../../core/lib/create-query-string"

export function useAttendanceConfig(): AnalyticsConfig {
    const searchParams = useSearchParams()
    const currentYear = new Date().getFullYear().toString()
    const period = searchParams.get("period") ?? currentYear
    const { sub: year } = parseTab(period)
    
    const { data: attendanceAnalytics } = useAttendanceAnalytics(year ?? currentYear)
    const kpi = searchParams.get("kpi") || "total"

    const KPI_META: Record<string, { title: string; description: string }> = {
        total: {
            title: "Total Giving Trends",
            description: "Track total contributions over time.",
        },
        givers: {
            title: "Giver Trends",
            description: "Track unique giver activity over time.",
        },
        average: {
            title: "Average Giving Trends",
            description: "Analyze average contribution patterns over time.",
        },
        median: {
            title: "Median Giving Trends",
            description: "Track median contribution trends over time.",
        },
        highest_amount: {
            title: "Peak Contribution Trends",
            description: "Monitor peak contribution values over time.",
        },
    }

    const meta = KPI_META[kpi || "total"]

    const title = meta?.title ?? "Performance Comparison"

    const description = meta?.description ?? "Compare trends and performance over time."

    const config: AnalyticsConfig = {
        title: "Attendance",
        sections: {
            headings: {
                chart: {
                    title: title,
                    description: description,
                },
                table: {
                    title: "kpis Statement",
                    description: "",
                }
            }
        },

        kpis: [
            {
                label: "Total Attendance",
                value: formatNumber(attendanceAnalytics?.meta?.kpis?.total_attendance ?? 0, { 
                    notation: "compact" 
                }),
                pathname: `/reports/analytics?${createQueryString(searchParams, { 
                    kpi: "total",
                    chart: "bar"
                })}`
            },
            {
                label: "Adult Attendance",
                value: formatNumber(attendanceAnalytics?.meta?.kpis?.total_adults ?? 0, { 
                    notation: "compact" 
                }),
                pathname: `/reports/analytics?${createQueryString(searchParams, { 
                    kpi: "adults",
                    chart: "bar"
                })}`
            },
            {
                label: "Children Attendance",
                value: formatNumber(attendanceAnalytics?.meta?.kpis?.total_children ?? 0, {
                    notation: "compact"
                }),
                pathname: `/reports/analytics?${createQueryString(searchParams, { 
                    kpi: "children",
                    chart: "bar"
                })}`
            },
            {
                label: "Visitor Attendance",
                value: formatNumber(attendanceAnalytics?.meta?.kpis?.total_visitors ?? 0, {
                    notation: "compact"
                }),
                pathname: `/reports/analytics?${createQueryString(searchParams, { 
                    kpi: "visitors",
                    chart: "bar"
                })}`
            },
        ],

        kpisWithChart: [
            {
                key: "total",
                label: "Total Attendance",
                value: formatNumber(attendanceAnalytics?.meta?.kpis?.total_attendance ?? 0, { 
                    notation: "compact" 
                }),
                pathname: "/reports/analytics?kpi=total",
                chart: {
                    xKey: "label",
                    series: [
                        {
                            key: "total",
                            label: "Total",
                            color: "var(--chart-1)",
                        },
                    ],
                },
            },

            {
                key: "total_adults",
                label: "Adults",
                value: formatNumber(attendanceAnalytics?.meta?.kpis?.total_adults ?? 0, { 
                    notation: "compact" 
                }),
                pathname: "/reports/analytics?kpi=highest_amount",
                chart: {
                    xKey: "label",
                    series: [
                        {
                            key: "total_adults",
                            label: "Adults",
                            color: "var(--chart-2)",
                        },
                    ],
                },
            },

            {
                key: "total_children",
                label: "Total Children",
                value: formatNumber(attendanceAnalytics?.meta?.kpis?.total_children ?? 0, {
                    notation: "compact"
                }),
                pathname: "/reports/analytics?kpi=givers",
                chart: {
                    xKey: "label",
                    series: [
                        {
                            key: "total_children",
                            label: "Children",
                            color: "var(--chart-3)",
                        },
                    ],
                },
            },

            {
                key: "total_visitors",
                label: "Visitors",
                value: formatNumber(attendanceAnalytics?.meta?.kpis?.total_visitors ?? 0, {
                    notation: "compact"
                }),
                pathname: "/reports/analytics?kpi=median",
                chart: {
                    xKey: "label",
                    series: [
                        {
                            key: "total_visitors",
                            label: "Visitors",
                            color: "var(--chart-4)",
                        },
                    ],
                },
            },

            
        ],

        table: attendanceAnalytics?.meta?.table_schema,

        performance: {
            best: {
                month: attendanceAnalytics?.meta?.insights?.best_month?.label ?? "",
                value: formatNumber(attendanceAnalytics?.meta?.insights?.best_month?.total ?? 0),
                change: (attendanceAnalytics?.meta?.insights?.best_month as unknown as { change: number })?.change ?? 0,
                advice: "Review outreach activities that increased attendance."
            },

            worst: {
                month: attendanceAnalytics?.meta?.insights?.worst_month?.label ?? "",
                value: formatNumber(attendanceAnalytics?.meta?.insights?.worst_month?.total ?? 0),
                change: (attendanceAnalytics?.meta?.insights?.worst_month as unknown as { change: number })?.change ?? 0,
                advice: "Investigate attendance declines and improve engagement."
            }
        },

        chart: {
            xKey: "label",
            series: [
                {
                    key: "total",
                    label: "Total Attendance",
                    color: "var(--chart-2)",
                },
                {
                    key: "total_adults",
                    label: "Adults",
                    color: "var(--chart-3)",
                },
                {
                    key: "total_children",
                    label: "Children",
                    color: "var(--chart-4)",
                },
                {
                    key: "total_visitors",
                    label: "Visitors",
                    color: "var(--chart-5)",
                },
            ],
        },
    }

    return config
}




