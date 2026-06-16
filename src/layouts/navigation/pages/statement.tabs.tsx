import { buildTab } from "@/utils/build-tab"
import { createQueryString } from "@/features/reports/core/lib/create-query-string"
import { ReadonlyURLSearchParams } from "next/navigation"

export const getStatementTabs = (searchParams: ReadonlyURLSearchParams) => {
    const tabs = [
        {
            label: "Attendance",
            key: "attendance",
            get href() {
                const params = createQueryString(searchParams, { 
                    tab: buildTab("attendance", "sunday"),
                })
                return `/reports/statements?${params}`
            },
        },
        {
            label: "Income & Expenditure",
            key: "cashflow",
            get href() {
                const params = createQueryString(searchParams, { tab: "cashflow" })
                return `/reports/statements?${params}`
            },
        },
        {
            label: "Giving",
            key: "tithes",
            get href() {
                const params = createQueryString(searchParams, { tab: "tithes" })
                return `/reports/statements?${params}`
            },
        },
        {
            label: "Remittance",
            key: "remittance",
            get href() {
                const params = createQueryString(searchParams, { tab: "remittance" })
                return `/reports/statements?${params}`
            },
        },
        // {
        //     label: "Check-ins",
        //     key: "checkin",
        //     get href() {
        //         const params = createQueryString(searchParams, { tab: "" })
        //         return `/reports/statements?${params}`
        //     },
        // },
        // {
        //     label: "Prayer Meetings",
        //     key: "prayermeet",
        //     get href() {
        //         const params = createQueryString(searchParams, { tab: "" })
        //         return `/reports/statements?${params}`
        //     },
        // }
    ]

    return tabs
}