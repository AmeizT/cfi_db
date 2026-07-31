import { buildTab } from "@/utils/build-tab"
import { createQueryString } from "@/features/reports/core/lib/create-query-string"
import { ReadonlyURLSearchParams } from "next/navigation"

export const getCumulativeTabs = (searchParams: ReadonlyURLSearchParams) => {
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
                return `/reports/ministry/attendance/cumulative?${params}`
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
                return `/reports/finance/tithes/cumulative?${params}`
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
                return `/reports/financial-activity/cumulative?${params}`
            },
        }
    ]

    return tabs
}

/** @deprecated Use module-specific Cumulative tabs. */
export const getAnalyticsTabs = getCumulativeTabs
