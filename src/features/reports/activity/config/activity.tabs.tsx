import { createQueryString } from "@/features/reports/core/lib/create-query-string"
import { ReadonlyURLSearchParams } from "next/navigation"

export const getReportsActivityTabs = (searchParams: ReadonlyURLSearchParams) => {
    const tabs = [
        {
            label: "All Reports",
            key: "all",
            get href() {
                const params = createQueryString(searchParams, { 
                    tab: null,
                })
                return `/reports/activity?${params}`
            },
        },
        {
            label: "Queue",
            key: "queue",
            get href() {
                const params = createQueryString(searchParams, { 
                    tab: null,
                })
                return `/reports/activity/queue?${params}`
            },
        },
        {
            label: "Compliance",
            key: "compliance",
            get href() {
                const params = createQueryString(searchParams, { 
                    tab: null,
                })
                return `/reports/activity/compliance?${params}`
            },
        },
        {
            label: "Flagged",
            key: "flagged",
            get href() {
                const params = createQueryString(searchParams, { 
                    tab: null,
                })
                return `/reports/activity/flagged?${params}`
            },
        },
    ]

    return tabs
}
