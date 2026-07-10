import type { ReadonlyURLSearchParams } from "next/navigation"
import { createQueryString } from "@/features/reports/core/lib/create-query-string"

export function getMembersTabs(searchParams?: ReadonlyURLSearchParams) {
    const hrefFor = (tab: string) =>
        `/reports/review/members?${createQueryString(searchParams, { tab })}`

    const tabs = [
        {
            label: "All",
            key: "directory",
            href: "/app/members/directory",
        },
        {
            label: "Adults",
            key: "adults",
            href: "/app/members/directory/adults",
        },
        {
            label: "Children",
            key: "children",
            href: "/app/members/directory/children",
        },
    ]

    return tabs
}
