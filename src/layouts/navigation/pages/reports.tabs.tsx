import { createQueryString } from "@/features/reports/core/lib/create-query-string";
import { getCurrentYear } from "@/layouts/utils/get-current-year";
import { buildPeriod } from "../helpers/build-period";
import { ReadonlyURLSearchParams } from "next/navigation";

export const getReportTabs = (searchParams: ReadonlyURLSearchParams) => {
    const currentYear = getCurrentYear()

    const params = createQueryString(searchParams ?? null, {
        period: buildPeriod({
            type: "year",
            value: Number(currentYear),
        }),

    })

    const tabs = [
        {
            label: "Review Queue",
            key: "overview",
            description: "Monitor report completion, submission status, and deadlines",
            href: `/reports/review/queue?${params}`
        },
        {
            label: "Compliance",
            key: "compliance",
            description: "Monitor report completion, submission status, and deadlines",
            get href() {
                return `/reports/review/compliance`
            },
        },
        {
            label: "Exceptions",
            key: "exceptions",
            description: "Exceptions related to report submissions, including errors and issues that require attention",
            get href() {
                return `/reports/review/exceptions`
            },
        },
    ]

    return tabs
}
