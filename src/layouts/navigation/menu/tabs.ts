import { QueryParams } from "../types"
import { createQueryString } from "@/features/reports/core/lib/create-query-string"

export const reportTabs = (searchParams: QueryParams) => {
    const tabs = [
        {
            label: "Attendance",
            key: "attendance",
            get href() {
                const params = createQueryString(searchParams, { tab: "attendance" })
                return `/reports/statements?${params}`
            },
        },
        {
            label: "Tithes",
            key: "tithes",
            get href() {
                const params = createQueryString(searchParams, { tab: "tithes" })
                return `/reports/statements?${params}`
            },
        },
        {
            label: "Cash Flow",
            key: "cashflow",
            get href() {
                const params = createQueryString(searchParams, { tab: "cashflow" })
                return `/reports/statements?${params}`
            },
        }
    ]

    return tabs
}