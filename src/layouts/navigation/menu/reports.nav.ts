import { NavItem } from "../types"
import {
    Analytics03Icon,
    ArchiveIcon,
    BookOpen02Icon,
    ChartBreakoutCircleIcon,
    Note05Icon,
    Queue01Icon,
    Queue02Icon,
    Target02Icon,
    Wallet03Icon,
} from "@hugeicons/core-free-icons"
import { getCurrentYear } from "@/layouts/utils/get-current-year"
import { buildPeriod } from "../helpers/build-period"
import { ReadonlyURLSearchParams } from "next/navigation"
import { createQueryString } from "@/features/reports/core/lib/create-query-string"

function getReportId(searchParams: ReadonlyURLSearchParams, reportId: string) {
    return (
        reportId ||
        searchParams.get("reportId") ||
        searchParams.get("reportid") ||
        searchParams.get("report_id") ||
        searchParams.get("id") ||
        undefined
    )
}

export function reports(
    searchParams: ReadonlyURLSearchParams,
    reportId: string
): NavItem[] {
    const currentReportId = getReportId(searchParams, reportId)

    function hrefFor(
        pathname: string,
        updates: Record<string, string | number | boolean | null | undefined> = {}
    ) {
        const params = createQueryString(searchParams, {
            period: buildPeriod({
                type: "year",
                value: Number(getCurrentYear()),
            }),
            reportId: currentReportId ?? null,
            reportid: null,
            report_id: null,
            ...updates,
        })

        return params ? `${pathname}?${params}` : pathname
    }

    return [
        {
            label: "Overview",
            description: "Reporting dashboard for KPIs, trends, and charts",
            icon: Analytics03Icon,
            activeIcon: Analytics03Icon,
            href: hrefFor("/reports/overview", { tab: null, view: null }),
            exact: true,
        },
        {
            label: "Review",
            description: "Review queue, compliance status, and exceptions",
            icon: Note05Icon,
            activeIcon: Note05Icon,
            href: hrefFor("/reports/review/queue", { tab: null, view: null }),
            children: [
                {
                    label: "Queue",
                    href: hrefFor("/reports/review/queue", { tab: null, view: null }),
                },
                {
                    label: "Compliance",
                    href: hrefFor("/reports/review/compliance", {
                        tab: null,
                        view: null,
                    }),
                },
                {
                    label: "Exceptions",
                    href: hrefFor("/reports/review/exceptions", {
                        tab: null,
                        view: null,
                    }),
                },
            ],
        },
        {
            label: "Performance",
            description: "Actuals versus targets for core reporting modules",
            icon: Target02Icon,
            activeIcon: Target02Icon,
            href: hrefFor("/reports/performance", { tab: null, view: null }),
        },
        {
            label: "Finance",
            description: "Tithes, remittance, income, revenue, and expenditure reports",
            icon: Wallet03Icon,
            activeIcon: Wallet03Icon,
            href: hrefFor("/reports/finance/tithes", { tab: null, view: null }),
            children: [
                {
                    label: "Tithes",
                    href: hrefFor("/reports/finance/tithes", {
                        tab: "data",
                        view: null,
                    }),
                },
                {
                    label: "Remittance",
                    href: hrefFor("/reports/finance/remittance", {
                        tab: null,
                        view: null,
                    }),
                },
                {
                    label: "Financial Activity",
                    href: hrefFor("/reports/finance/income-expenditure", {
                        tab: "statement",
                        view: null,
                    }),
                },
                {
                    label: "Expenses",
                    href: hrefFor("/reports/finance/expenditures", {
                        tab: null,
                        view: null,
                    }),
                },
                {
                    label: "Revenue",
                    href: hrefFor("/reports/finance/revenue", {
                        tab: null,
                        view: null,
                    }),
                },
            ],
        },
        {
            label: "Ministry",
            description: "Attendance, Sunday School attendance, and check-ins",
            icon: BookOpen02Icon,
            activeIcon: BookOpen02Icon,
            href: hrefFor("/reports/ministry/attendance", { tab: null, view: null }),
            children: [
                {
                    label: "Attendance",
                    href: hrefFor("/reports/ministry/attendance", {
                        tab: "monthly",
                        view: null,
                    }),
                },
                {
                    label: "Sunday School",
                    href: hrefFor("/reports/ministry/sunday-school-attendance", {
                        tab: null,
                        view: null,
                    }),
                },
                {
                    label: "Check-ins",
                    href: hrefFor("/reports/ministry/check-ins", {
                        tab: null,
                        view: null,
                    }),
                    disabled: true,
                },
            ],
        },
    ]
}
