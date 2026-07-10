import type { ReadonlyURLSearchParams } from "next/navigation"
import { createQueryString } from "@/features/reports/core/lib/create-query-string"

export function getMembersTabs(searchParams?: ReadonlyURLSearchParams) {
    const hrefFor = (tab: string) =>
        `/reports/review/members?${createQueryString(searchParams, { tab })}`

    const tabs = [
        {
            label: "Children",
            key: "children",
            href: "/app/people/families-children",
        },
        {
            label: "Transfers",
            key: "transfers",
            href: "/app/people/transfers",
        },
        {
            label: "Audit Logs",
            key: "audit-logs",
            get href() {
                return hrefFor("audit-logs")
            },
        },
    ]

    return tabs
}
