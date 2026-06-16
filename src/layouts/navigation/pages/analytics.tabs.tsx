import { buildTab } from "@/utils/build-tab"
import { createQueryString } from "@/features/reports/core/lib/create-query-string"
import { ReadonlyURLSearchParams } from "next/navigation"

export const getAnalyticsTabs = (searchParams: ReadonlyURLSearchParams) => {
    const tabs = [
        {
            label: "Attendance",
            key: "attendance",
            get href() {
                const params = createQueryString(searchParams, { 
                    tab: buildTab("attendance", "sunday"),
                    kpi: "total",
                    chart: "bar"
                })
                return `/reports/analytics?${params}`
            },
        },
        {
            label: "Tithes",
            key: "tithes",
            get href() {
                const params = createQueryString(searchParams, { 
                    tab: "tithes",
                    kpi: "total",
                    chart: "bar"
                })
                return `/reports/analytics?${params}`
            },
        },
        {
            label: "Cash Flow",
            key: "cashflow",
            get href() {
                const params = createQueryString(searchParams, { 
                    tab: "cashflow", 
                    kpi: "revenue_total",
                    chart: "bar"
                })
                return `/reports/analytics?${params}`
            },
        }
    ]

    return tabs
}