import type { ReadonlyURLSearchParams } from "next/navigation"
import { APP_ROUTES } from "@/config/app-routes"
import { createQueryString } from "@/features/reports/core/lib/create-query-string"
import type { ModulePageContext, ReportModuleKey, ReportRouteKey, ReportSection } from "../types/report-modules"

export type ReportSubmoduleKey =
    | "main-service"
    | "sunday-school"
    | "homecell"
    | "midweek"
    | "special-services"
    | "statement"
    | "revenue"
    | "expenses"
    | "transactions"
    | "contributors"
    | "cumulative"
    | "performance"
    | "receipts"
    | "audit-log"

export type ReportSubmoduleTab = {
    label: string
    key: ReportSubmoduleKey | "more"
    submodule: ReportSubmoduleKey | null
    pageTitle?: string
}

export type ReportSubmoduleMenuItem = {
    label: string
    key: string
    submodule: ReportSubmoduleKey | null
    pageTitle?: string
    query?: Record<string, string | number | boolean | null | undefined>
}

export type ReportSubmoduleGroup = {
    basePath?: string
    defaultSubmodule: ReportSubmoduleKey
    tabs: readonly ReportSubmoduleTab[]
    moreItems?: readonly ReportSubmoduleMenuItem[]
}

export type ReportSubmoduleLink = {
    label: string
    key: string
    href: string
}

const REPORT_SUBMODULE_GROUP_DEFINITIONS = {
    "ministry/attendance": {
        defaultSubmodule: "main-service",
        tabs: [
            { label: "General", key: "main-service", submodule: null, pageTitle: "Attendance" },
            { label: "Sunday School", key: "sunday-school", submodule: "sunday-school", pageTitle: "Sunday School" },
            { label: "Homecell", key: "homecell", submodule: "homecell", pageTitle: "Homecell" },
            { label: "Midweek", key: "midweek", submodule: "midweek", pageTitle: "Midweek" },
            { label: "Special Services", key: "special-services", submodule: "special-services", pageTitle: "Special Services" },
            { label: "Cumulative", key: "cumulative", submodule: "cumulative", pageTitle: "Attendance Cumulative" },
        ],
    },
    "finance/tithes": {
        defaultSubmodule: "transactions",
        tabs: [
            { label: "Transactions", key: "transactions", submodule: null, pageTitle: "Tithes" },
            { label: "Contributors", key: "contributors", submodule: "contributors", pageTitle: "Contributors" },
            { label: "Cumulative", key: "cumulative", submodule: "cumulative" },
            // { label: "Performance", key: "performance", submodule: "performance" },
            { label: "Receipts", key: "receipts", submodule: "receipts" },
            { label: "More", key: "more", submodule: "audit-log" },
        ],
        moreItems: [
            {
                label: "Voided",
                key: "voided",
                submodule: null,
                query: { status: "voided" },
            },
            {
                label: "Deleted",
                key: "deleted",
                submodule: null,
                query: { status: "deleted" },
            },
            {
                label: "Audit Log",
                key: "audit-log",
                submodule: "audit-log",
                pageTitle: "Audit Log",
                query: { status: null },
            },
        ],
    },
    "finance/income-expenditure": {
        defaultSubmodule: "statement",
        tabs: [
            { label: "Statement", key: "statement", submodule: null, pageTitle: "Income & Expenditure" },
            { label: "Cumulative", key: "cumulative", submodule: "cumulative", pageTitle: "Income & Expenditure Cumulative" },
        ],
    },
    "finance/financial-activity": {
        basePath: "/reports/financial-activity",
        defaultSubmodule: "statement",
        tabs: [
            { label: "Statement", key: "statement", submodule: "statement", pageTitle: "Income Statement" },
            { label: "Cumulative", key: "cumulative", submodule: "cumulative", pageTitle: "Cumulative" },
            { label: "Revenue", key: "revenue", submodule: "revenue", pageTitle: "Revenue" },
            { label: "Expenses", key: "expenses", submodule: "expenses", pageTitle: "Expenses" },
        ],
    },
} as const satisfies Partial<Record<ReportRouteKey, ReportSubmoduleGroup>>

export const REPORT_SUBMODULE_GROUPS: Partial<Record<ReportRouteKey, ReportSubmoduleGroup>> =
    REPORT_SUBMODULE_GROUP_DEFINITIONS

function getRouteKey(section: ReportSection, module: ReportModuleKey) {
    return `${section}/${module}` as ReportRouteKey
}

function getSubmoduleBasePath(
    section: ReportSection,
    module: ReportModuleKey,
    pageContext: ModulePageContext,
) {
    if (pageContext === "workspace") {
        const publicSection = section === "ministry" ? "engagement" : section
        return `/${publicSection}/${module}`
    }

    return getReportSubmoduleGroup(section, module)?.basePath ?? `/reports/${section}/${module}`
}

function getWorkspaceSubmodulePath(
    section: ReportSection,
    module: ReportModuleKey,
    submodule: ReportSubmoduleKey | null,
) {
    if (section === "finance" && module === "financial-activity") {
        if (submodule === "statement" || submodule === null) return APP_ROUTES.finance.statements
        if (submodule === "revenue") return APP_ROUTES.finance.revenue
        if (submodule === "expenses") return APP_ROUTES.finance.expenses
    }
    if (section === "ministry" && module === "attendance") {
        if (submodule === null) return APP_ROUTES.engagement.attendance
        if (submodule === "sunday-school") return APP_ROUTES.engagement.sundaySchool
    }

    const basePath = getSubmoduleBasePath(section, module, "workspace")
    return submodule ? `${basePath}/${submodule}` : basePath
}

export function getReportSubmoduleGroup(
    section: ReportSection,
    module: ReportModuleKey
) {
    return REPORT_SUBMODULE_GROUPS[getRouteKey(section, module)]
}

export function hasReportSubmodules(
    section: ReportSection,
    module: ReportModuleKey
) {
    return Boolean(getReportSubmoduleGroup(section, module))
}

export function isReportSubmoduleRoute(
    section: ReportSection,
    module: ReportModuleKey,
    submodule: string
) {
    const group = getReportSubmoduleGroup(section, module)

    if (!group) {
        return false
    }

    return group.tabs.some((tab) => tab.submodule === submodule)
        || group.moreItems?.some((item) => item.submodule === submodule)
        || false
}

export function getActiveReportSubmodule(
    section: ReportSection,
    module: ReportModuleKey,
    submodule?: string
) {
    const group = getReportSubmoduleGroup(section, module)

    if (!group) {
        return undefined
    }

    if (!submodule) {
        return group.defaultSubmodule
    }

    const tab = group.tabs.find((item) => item.submodule === submodule)
    const menuItem = group.moreItems?.find((item) => item.submodule === submodule)

    return tab?.key ?? menuItem?.key ?? group.defaultSubmodule
}

export function getReportSubmoduleTitle(
    section: ReportSection,
    module: ReportModuleKey,
    activeKey?: string
) {
    const group = getReportSubmoduleGroup(section, module)

    if (!group || !activeKey) {
        return undefined
    }

    const tab = group.tabs.find((item) => item.key === activeKey)
    const menuItem = group.moreItems?.find((item) => item.key === activeKey)
        ?? group.moreItems?.find((item) => item.submodule === activeKey)
    const submoduleTab = group.tabs.find((item) => item.submodule === activeKey)
    const item = tab ?? menuItem ?? submoduleTab

    return item?.pageTitle ?? item?.label
}

export function getReportSubmoduleHref({
    section,
    module,
    searchParams,
    submodule,
    updates = {},
    pageContext = "reports",
}: {
    section: ReportSection
    module: ReportModuleKey
    searchParams: ReadonlyURLSearchParams
    submodule: ReportSubmoduleKey | null
    updates?: Record<string, string | number | boolean | null | undefined>
    pageContext?: ModulePageContext
}) {
    const basePath = getSubmoduleBasePath(section, module, pageContext)
    const pathname = pageContext === "workspace"
        ? getWorkspaceSubmodulePath(section, module, submodule)
        : submodule ? `${basePath}/${submodule}` : basePath
    const query = createQueryString(searchParams, {
        tab: null,
        view: null,
        page: 1,
        ...updates,
    })

    return query ? `${pathname}?${query}` : pathname
}

export function getReportSubmoduleTabs(
    section: ReportSection,
    module: ReportModuleKey,
    searchParams: ReadonlyURLSearchParams,
    pageContext: ModulePageContext = "reports",
): ReportSubmoduleLink[] {
    const group = getReportSubmoduleGroup(section, module)

    if (!group) {
        return []
    }

    return group.tabs.map((tab) => ({
        label: tab.label,
        key: tab.key,
        href: getReportSubmoduleHref({
            section,
            module,
            searchParams,
            submodule: tab.submodule,
            updates: tab.key === "transactions" ? { status: null } : {},
            pageContext,
        }),
    }))
}

export function getReportSubmoduleMoreItems(
    section: ReportSection,
    module: ReportModuleKey,
    searchParams: ReadonlyURLSearchParams,
    pageContext: ModulePageContext = "reports",
): ReportSubmoduleLink[] {
    const group = getReportSubmoduleGroup(section, module)

    if (!group?.moreItems) {
        return []
    }

    return group.moreItems.map((item) => ({
        label: item.label,
        key: item.key,
        href: getReportSubmoduleHref({
            section,
            module,
            searchParams,
            submodule: item.submodule,
            updates: item.query ?? {},
            pageContext,
        }),
    }))
}
