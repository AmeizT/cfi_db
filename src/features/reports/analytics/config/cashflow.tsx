import { useUser } from "@/hooks/query/use-user"
import { AnalyticsConfig } from "../types/analytics.types"
import { useSearchParams } from "next/navigation"
import { parseTab } from "@/utils/parse-tab"
import {useCashflowAnalytics } from "../../core/hooks/use-analytics"
import { formatCurrency } from "@/utils/currency"
import { createQueryString } from "../../core/lib/create-query-string"

export function useCashflowConfig(): AnalyticsConfig {
    const { data: user } = useUser()
    const searchParams = useSearchParams()
    const currentYear = new Date().getFullYear().toString()
    const period = searchParams.get("period") ?? currentYear
    const { sub: year } = parseTab(period)
    
    const { data: cashflowAnalytics } = useCashflowAnalytics(year ?? currentYear)

    const LANGUAGE = user?.assembly?.language
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

    const description = meta?.description ?? "Compare trends and performance over time."

    const config: AnalyticsConfig = {
        title: "Cashflow",
        sections: {
            headings: {
                chart: {
                    title: title,
                    description: description,
                },
                table: {
                    title: "kpis Cash Flow Statement",
                    description: "",
                }
            }
        },

        kpis: [
            {
                label: "Total Revenue",
                value: formatCurrency(cashflowAnalytics?.meta?.kpis?.total_revenue ?? 0, { 
                    notation: "compact", language: LANGUAGE, currency: CURRENCY 
                }),
                pathname: `/reports/analytics?${createQueryString(searchParams, { 
                    kpi: "revenue_total",
                    chart: "bar"
                })}`
            },
            {
                label: "Expenditures",
                value: formatCurrency(cashflowAnalytics?.meta?.kpis?.total_expense ?? 0, { 
                    notation: "compact", language: LANGUAGE, currency: CURRENCY 
                }),
                pathname: `/reports/analytics?${createQueryString(searchParams, { 
                    kpi: "expense_total",
                    chart: "bar"
                })}`
            },
            {
                label: "Net Cash Flow",
                value: formatCurrency(cashflowAnalytics?.meta?.kpis?.net_cashflow ?? 0, {
                    notation: "compact", language: LANGUAGE, currency: CURRENCY
                }),
                pathname: `/reports/analytics?${createQueryString(searchParams, { 
                    kpi: "balance",
                    chart: "bar"
                })}`
            },
        ],

        kpisWithChart: [
            {
                key: "revenue",
                label: "Total Revenue",
                value: formatCurrency(cashflowAnalytics?.meta?.kpis?.total_revenue ?? 0, { 
                    notation: "compact", language: LANGUAGE, currency: CURRENCY 
                }),
                pathname: "/reports/analytics?kpi=total",
                chart: {
                    xKey: "label",
                    series: [
                        {
                            key: "revenue_total",
                            label: "Revenue",
                            color: "var(--chart-1)",
                        },
                    ],
                },
            },

            {
                key: "expenditure",
                label: "Total Expenditure",
                value: formatCurrency(cashflowAnalytics?.meta?.kpis?.total_expense ?? 0, { 
                    notation: "compact", language: LANGUAGE, currency: CURRENCY 
                }),
                pathname: "/reports/analytics?kpi=highest_amount",
                chart: {
                    xKey: "label",
                    series: [
                        {
                            key: "expense_total",
                            label: "Expenditure",
                            color: "var(--chart-2)",
                        },
                    ],
                },
            },

            {
                key: "balance",
                label: "Net Cash Flow",
                value: formatCurrency(cashflowAnalytics?.meta?.kpis?.net_cashflow ?? 0, {
                    notation: "compact", language: LANGUAGE, currency: CURRENCY
                }),
                pathname: "/reports/analytics?kpi=median",
                chart: {
                    xKey: "label",
                    series: [
                        {
                            key: "balance",
                            label: "Balance",
                            color: "var(--chart-3)",
                        },
                    ],
                },
            },

            // {
            //     key: "givers",
            //     label: "Givers",
            //     value: tithesAnalytics?.meta?.kpis?.givers ?? 0,
            //     pathname: "/reports/analytics?kpi=givers",
            //     chart: {
            //         xKey: "label",
            //         series: [
            //             {
            //                 key: "givers",
            //                 label: "Givers",
            //                 color: "var(--chart-4)",
            //             },
            //         ],
            //     },
            // },
        ],

        table: cashflowAnalytics?.meta?.table_schema,

        performance: {
            best: {
                month: cashflowAnalytics?.meta?.insights?.best_month?.label ?? "",
                value: formatCurrency(cashflowAnalytics?.meta?.insights?.best_month?.balance ?? 0, {
                    notation: "compact", language: LANGUAGE, currency: CURRENCY
                }),
                change: cashflowAnalytics?.meta?.insights?.best_month?.change ?? 0,
                advice: "Maintain the revenue sources that produced this surplus."
            },

            worst: {
                month: cashflowAnalytics?.meta?.insights?.worst_month?.label ?? "",
                value: formatCurrency(cashflowAnalytics?.meta?.insights?.worst_month?.balance ?? 0, {
                    notation: "compact", language: LANGUAGE, currency: CURRENCY
                }),
                change: cashflowAnalytics?.meta?.insights?.worst_month?.change ?? 0,
                advice: "Review spending patterns and improve cost control."
            }
        },

        chart: {
            xKey: "label",
            series: [
                {
                    key: "revenue_total",
                    label: "Revenue",
                    color: "var(--chart-2)",
                },
                {
                    key: "expense_total",
                    label: "Expenditure",
                    color: "var(--chart-3)",
                },
                {
                    key: "balance",
                    label: "Net Cash Flow",
                    color: "var(--chart-4)",
                },
            ],
        },
    }

    return config
}






