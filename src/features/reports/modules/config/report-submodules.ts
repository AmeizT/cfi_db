import type { ReadonlyURLSearchParams } from "next/navigation"
import { createQueryString } from "@/features/reports/core/lib/create-query-string"
import type { ReportModuleKey, ReportRouteKey, ReportSection } from "../types/report-modules"

export type ReportSubmoduleKey =
    | "records"
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
    "finance/tithes": {
        defaultSubmodule: "records",
        tabs: [
            { label: "Records", key: "records", submodule: null, pageTitle: "Tithes" },
            { label: "Contributors", key: "contributors", submodule: "contributors", pageTitle: "Tithe Contributors" },
            { label: "Cumulative", key: "cumulative", submodule: "cumulative" },
            { label: "Performance", key: "performance", submodule: "performance" },
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
} as const satisfies Partial<Record<ReportRouteKey, ReportSubmoduleGroup>>

export const REPORT_SUBMODULE_GROUPS: Partial<Record<ReportRouteKey, ReportSubmoduleGroup>> =
    REPORT_SUBMODULE_GROUP_DEFINITIONS

function getRouteKey(section: ReportSection, module: ReportModuleKey) {
    return `${section}/${module}` as ReportRouteKey
}

function getSubmoduleBasePath(section: ReportSection, module: ReportModuleKey) {
    return `/reports/${section}/${module}`
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
}: {
    section: ReportSection
    module: ReportModuleKey
    searchParams: ReadonlyURLSearchParams
    submodule: ReportSubmoduleKey | null
    updates?: Record<string, string | number | boolean | null | undefined>
}) {
    const basePath = getSubmoduleBasePath(section, module)
    const pathname = submodule ? `${basePath}/${submodule}` : basePath
    const query = createQueryString(searchParams, {
        tab: null,
        view: null,
        ...updates,
    })

    return query ? `${pathname}?${query}` : pathname
}

export function getReportSubmoduleTabs(
    section: ReportSection,
    module: ReportModuleKey,
    searchParams: ReadonlyURLSearchParams
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
            updates: tab.key === "records" ? { status: null } : {},
        }),
    }))
}

export function getReportSubmoduleMoreItems(
    section: ReportSection,
    module: ReportModuleKey,
    searchParams: ReadonlyURLSearchParams
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
        }),
    }))
}
