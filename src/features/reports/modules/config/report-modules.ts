import type { ReadonlyURLSearchParams } from "next/navigation"
import { createQueryString } from "@/features/reports/core/lib/create-query-string"
import type {
    ModulePageContext,
    ReportModuleConfig,
    ReportModuleKey,
    ReportSection,
} from "../types/report-modules"

function publicSectionSlug(section: ReportSection, pageContext: ModulePageContext) {
    return pageContext === "workspace" && section === "ministry" ? "engagement" : section
}

export function getModuleRoutePath(
    section: ReportSection,
    module: ReportModuleKey,
    pageContext: ModulePageContext = "reports",
) {
    if (pageContext === "workspace") {
        return `/${publicSectionSlug(section, pageContext)}/${module}`
    }

    return getReportModuleConfig(section, module)?.href ?? "#"
}

export const REPORT_MODULES = {
    activity: {
        all: {
            title: "All Reports",
            description: "View submitted reports and their current status.",
            href: "/reports/activity",
        },
        queue: {
            title: "Queue",
            description: "activity submitted reports, completion status, and pending actions.",
            href: "/reports/activity/queue",
        },
        compliance: {
            title: "Compliance",
            description: "Monitor report completion, skipped sections, and follow-up status.",
            href: "/reports/compliance",
        },
        flagged: {
            title: "Need Attention",
            tabLabel: "Flagged",
            description: "activity missing values, mismatches, and report anomalies.",
            href: "/reports/activity/flagged",
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
        "financial-activity": {
            title: "Financial Activity",
            description: "Income statements, cumulative trends, revenue, and expenses.",
            href: "/reports/financial-activity/statement",
        },
    },
    ministry: {
        attendance: {
            title: "Attendance",
            description: "Track service attendance reports.",
            href: "/reports/ministry/attendance",
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
        outreach: {
            title: "Evangelism & Outreach",
            tabLabel: "Outreach",
            description: "Evangelism, campaigns, crusades, community outreach, and follow-up.",
            href: "/reports/ministry/outreach",
            showPeriodSelector: false,
        },
    },
    performance: {
        overview: {
            title: "Performance",
            tabLabel: "Overview",
            description: "Compare actuals against targets across reporting modules.",
            href: "/reports/performance",
        },
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
    updates: Record<string, string | number | boolean | null | undefined> = {},
    pageContext: ModulePageContext = "reports",
) {
    const config = getReportModuleConfig(section, module)

    if (!config) {
        return "#"
    }

    const query = createQueryString(searchParams, updates)

    const pathname = getModuleRoutePath(section, module, pageContext)

    return query ? `${pathname}?${query}` : pathname
}

export function getReportModuleTabs(
    section: ReportSection,
    searchParams: ReadonlyURLSearchParams,
    pageContext: ModulePageContext = "reports",
) {
    return Object.entries(REPORT_MODULE_REGISTRY[section])
        .filter(([, config]) => config.state !== "disabled")
        .map(([module, config]) => ({
            label: config.tabLabel ?? config.title,
            key: module,
            href: getReportModuleHref(
                section,
                module as ReportModuleKey,
                searchParams,
                { tab: null, view: null },
                pageContext,
            ),
        }))
}

export function getReportModuleViewTabs(
    section: ReportSection,
    module: ReportModuleKey,
    searchParams: ReadonlyURLSearchParams,
    pageContext: ModulePageContext = "reports",
) {
    const config = getReportModuleConfig(section, module)

    return (
        config?.viewTabs?.map((tab) => ({
            ...tab,
            href: getReportModuleHref(
                section,
                module,
                searchParams,
                { tab: tab.key },
                pageContext,
            ),
        })) ?? []
    )
}
