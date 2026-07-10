import type { ReadonlyURLSearchParams } from "next/navigation"
import { createQueryString } from "@/features/reports/core/lib/create-query-string"

export function getComplianceTabs(searchParams?: ReadonlyURLSearchParams) {
    const hrefFor = (tab: string) =>
        `/reports/review/compliance?${createQueryString(searchParams, { tab })}`

    const tabs = [
        {
            label: "Status",
            key: "status",
            get href() {
                return hrefFor("status")
            },
        },
        {
            label: "Issues",
            key: "issues",
            get href() {
                return hrefFor("issues")
            },
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
