import type { ReadonlyURLSearchParams } from "next/navigation"
import { createQueryString } from "@/features/reports/core/lib/create-query-string"
import type {
    ReportModuleConfig,
    ReportModuleKey,
    ReportSection,
} from "../types/report-modules"

export const REPORT_MODULES = {
    review: {
        queue: {
            title: "Queue",
            description: "Review submitted reports, completion status, and pending actions.",
            href: "/reports/review/queue",
        },
        compliance: {
            title: "Compliance",
            description: "Monitor report completion, skipped sections, and follow-up status.",
            href: "/reports/review/compliance",
        },
        exceptions: {
            title: "Exceptions",
            description: "Review missing values, mismatches, and report anomalies.",
            href: "/reports/review/exceptions",
        },
    },
    finance: {
        tithes: {
            title: "Tithes",
            description: "Track tithe reports and giving trends.",
            href: "/reports/finance/tithes",
        },
        remittance: {
            title: "Remittance",
            description: "View remittance reports and verification status.",
            href: "/reports/finance/remittance",
            state: "placeholder",
        },
        "income-expenditure": {
            title: "Income & Expenditure",
            description: "Combined income and expenditure statement.",
            href: "/reports/finance/income-expenditure",
            defaultView: "statement",
            viewTabs: [
                { label: "Statement", key: "statement" },
                { label: "Summary", key: "summary" },
            ],
        },
        revenue: {
            title: "Revenue",
            description: "Standalone revenue reporting module.",
            href: "/reports/finance/revenue",
            state: "placeholder",
        },
        expenditures: {
            title: "Expenditures",
            description: "Standalone expenditure reporting module.",
            href: "/reports/finance/expenditures",
            state: "placeholder",
        },
    },
    ministry: {
        attendance: {
            title: "Attendance",
            description: "Track service attendance reports.",
            href: "/reports/ministry/attendance",
            defaultView: "monthly",
            viewTabs: [
                { label: "Monthly", key: "monthly" },
                { label: "Analytics", key: "analytics" },
            ],
        },
        "sunday-school-attendance": {
            title: "Sunday School Attendance",
            description: "Track Sunday School attendance reports.",
            href: "/reports/ministry/sunday-school-attendance",
        },
        "check-ins": {
            title: "Check-ins",
            description: "Check-in reporting will be available in a future release.",
            href: "/reports/ministry/check-ins",
            state: "disabled",
        },
    },
    performance: {
        tithes: {
            title: "Tithes Performance",
            description: "Compare tithe actuals against targets and grade performance.",
            href: "/reports/performance/tithes",
        },
        attendance: {
            title: "Attendance Performance",
            description: "Compare attendance actuals against targets and grade performance.",
            href: "/reports/performance/attendance",
        },
    },
} as const satisfies Record<ReportSection, Partial<Record<ReportModuleKey, ReportModuleConfig>>>

const REPORT_MODULE_REGISTRY = REPORT_MODULES as Record<
    ReportSection,
    Partial<Record<ReportModuleKey, ReportModuleConfig>>
>

export function isReportSection(section: string): section is ReportSection {
    return Object.prototype.hasOwnProperty.call(REPORT_MODULES, section)
}

export function isReportModuleRoute(
    section: string,
    module: string
): section is ReportSection {
    return (
        isReportSection(section) &&
        Object.prototype.hasOwnProperty.call(REPORT_MODULE_REGISTRY[section], module)
    )
}

export function getReportModuleConfig(
    section: ReportSection,
    module: ReportModuleKey
) {
    return REPORT_MODULE_REGISTRY[section][module]
}

export function getReportModuleHref(
    section: ReportSection,
    module: ReportModuleKey,
    searchParams: ReadonlyURLSearchParams,
    updates: Record<string, string | number | boolean | null | undefined> = {}
) {
    const config = getReportModuleConfig(section, module)

    if (!config) {
        return "#"
    }

    const query = createQueryString(searchParams, updates)

    return query ? `${config.href}?${query}` : config.href
}

export function getReportModuleTabs(
    section: ReportSection,
    searchParams: ReadonlyURLSearchParams
) {
    return Object.entries(REPORT_MODULE_REGISTRY[section])
        .filter(([, config]) => config.state !== "disabled")
        .map(([module, config]) => ({
            label: config.title,
            key: module,
            href: getReportModuleHref(
                section,
                module as ReportModuleKey,
                searchParams,
                { tab: null, view: null }
            ),
        }))
}

export function getReportModuleViewTabs(
    section: ReportSection,
    module: ReportModuleKey,
    searchParams: ReadonlyURLSearchParams
) {
    const config = getReportModuleConfig(section, module)

    return (
        config?.viewTabs?.map((tab) => ({
            ...tab,
            href: getReportModuleHref(section, module, searchParams, {
                tab: tab.key,
            }),
        })) ?? []
    )
}
