import { formatCurrency } from "@/utils";
import { AnalyticsConfig } from "../types/analytics.types"
import { useTithesAnalytics } from "../../core/hooks/use-analytics";
import { useUser } from "@/hooks/query/use-user";
import { useSearchParams } from "next/navigation";
import { parseTab } from "@/utils/parse-tab";
import { createQueryString } from "../../core/lib/create-query-string";

export function useTithesConfig(): AnalyticsConfig {
    const { data: user } = useUser()
    const searchParams = useSearchParams()
    const currentYear = new Date().getFullYear().toString()
    const period = searchParams.get("period") ?? currentYear
    const { sub: year } = parseTab(period)
    
    const { data: tithesAnalytics } = useTithesAnalytics(year ?? currentYear)
    console.log("YTD Tithes Data:", tithesAnalytics, "year", year) 

    const LANGUAGE = user?.assembly?.locale ?? user?.assembly?.language
    const CURRENCY = user?.assembly?.currency

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

    const description = meta?.description ?? 
        "Compare trends and performance over time."

    const config: AnalyticsConfig = {
        title: "Tithes",
        sections: {
            headings: {
                chart: {
                    title: title,
                    description: description,
                },
                table: {
                    title: "YTD Statement",
                    description: "",
                }
            }
        },

        kpis: [
            {
                label: "Total",
                value: formatCurrency(tithesAnalytics?.meta?.kpis?.total ?? 0, { notation: "compact", language: LANGUAGE, currency: CURRENCY }),
                pathname: `/reports/analytics?${createQueryString(searchParams, { 
                    kpi: "total",
                    chart: "bar"
                })}`
            },
            {
                label: "Top Contribution",
                value: formatCurrency(tithesAnalytics?.meta?.kpis?.highest_amount ?? 0, { notation: "compact", language: LANGUAGE, currency: CURRENCY }),
                pathname: `/reports/analytics?${createQueryString(searchParams, { 
                    kpi: "highest_amount",
                    chart: "bar"
                })}`
            },
            {
                label: "Median Contribution",
                value: formatCurrency(tithesAnalytics?.meta?.kpis?.median ?? 0, { notation: "compact", language: LANGUAGE, currency: CURRENCY }),
                pathname: `/reports/analytics?${createQueryString(searchParams, { 
                    kpi: "median",
                    chart: "bar"
                })}`
            },
            {
                label: "Active Givers",
                value: tithesAnalytics?.meta?.kpis?.givers ?? 0,
                pathname: `/reports/analytics?${createQueryString(searchParams, { 
                    kpi: "givers",
                    chart: "bar"
                })}`
            },
        ],

        chart: {
            xKey: "label",
            series: [
                {
                    key: "total",
                    label: "Revenue",
                    color: "var(--chart-2)",
                },
                {
                    key: "median",
                    label: "Median",
                    color: "var(--chart-5)",
                },
                {
                    key: "highest_amount",
                    label: "Highest Amount",
                    color: "var(--chart-3)",
                },
                {
                    key: "givers",
                    label: "Givers",
                    color: "var(--chart-4)",
                },
            ],
        },

        kpisWithChart: [
            {
                key: "total",
                label: "Total Giving",
                value: formatCurrency(tithesAnalytics?.meta?.kpis?.total ?? 0, { notation: "compact", language: LANGUAGE, currency: CURRENCY }),
                pathname: "/reports/analytics?kpi=total",
                chart: {
                    xKey: "label",
                    series: [
                        {
                            key: "total",
                            label: "Total Giving",
                            color: "var(--chart-1)",
                        },
                    ],
                },
            },

            {
                key: "highest_amount",
                label: "Peak",
                value: formatCurrency(tithesAnalytics?.meta?.kpis?.highest_amount ?? 0, { notation: "compact", language: LANGUAGE, currency: CURRENCY }),
                pathname: "/reports/analytics?kpi=highest_amount",
                chart: {
                    xKey: "label",
                    series: [
                        {
                            key: "highest_amount",
                            label: "Top Contribution",
                            color: "var(--chart-2)",
                        },
                    ],
                },
            },

            {
                key: "median",
                label: "Median",
                value: formatCurrency(tithesAnalytics?.meta?.kpis?.median ?? 0, { notation: "compact", language: LANGUAGE, currency: CURRENCY }),
                pathname: "/reports/analytics?kpi=median",
                chart: {
                    xKey: "label",
                    series: [
                        {
                            key: "median",
                            label: "Median",
                            color: "var(--chart-3)",
                        },
                    ],
                },
            },

            {
                key: "givers",
                label: "Givers",
                value: tithesAnalytics?.meta?.kpis?.givers ?? 0,
                pathname: "/reports/analytics?kpi=givers",
                chart: {
                    xKey: "label",
                    series: [
                        {
                            key: "givers",
                            label: "Givers",
                            color: "var(--chart-4)",
                        },
                    ],
                },
            },
        ],

        table: tithesAnalytics?.meta?.table_schema,

        performance: {
            best: {
                month: tithesAnalytics?.meta?.insights?.best_month?.label ?? "",
                value: formatCurrency(tithesAnalytics?.meta?.insights?.best_month?.total ?? 0, {
                    notation: "compact", language: LANGUAGE, currency: CURRENCY
                }),
                change: (tithesAnalytics?.meta?.insights?.best_month as unknown as { change: number })?.change ?? 0,
                advice: "Identify what contributed to this strong month and replicate it."
            },

            worst: {
                month: tithesAnalytics?.meta?.insights?.worst_month?.label ?? "",
                value: formatCurrency(tithesAnalytics?.meta?.insights?.worst_month?.total ?? 0, {
                    notation: "compact", language: LANGUAGE, currency: CURRENCY
                }),
                change: (tithesAnalytics?.meta?.insights?.worst_month as unknown as { change: number })?.change ?? 0,
                advice: "Follow up with members who have not contributed recently."
            }
        }
    }

    return config
}
