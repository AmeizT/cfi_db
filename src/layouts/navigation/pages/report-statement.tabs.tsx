import { ReadonlyURLSearchParams } from "next/navigation"
import { createQueryString } from "@/features/reports/core/lib/create-query-string"

const TAB_CONFIG = [
    { label: "Monthly", key: "monthly", view: "monthly" },
    { label: "Analytics", key: "analytics", view: "analytics" },
] as const

export const getReportStatementTabs = (
    page: string,
    searchParams: ReadonlyURLSearchParams,
) =>
    TAB_CONFIG.map((tab) => ({
        label: tab.label,
        key: tab.key,
        href:
            `/reports/statements/${page}?` +
            createQueryString(searchParams, { tab: tab.view }),
    }))