import type {
    ReportModuleKey,
    ReportSection,
} from "@/features/reports/modules/types/report-modules"
import { APP_ROUTES } from "../../../config/app-routes.ts"

export type WorkspaceSectionSlug = "finance" | "engagement"

export function workspaceSectionToInternal(section: string): ReportSection | null {
    if (section === "finance") return "finance"
    if (section === "engagement") return "ministry"
    return null
}

export function workspaceModuleRedirect(
    section: WorkspaceSectionSlug,
    module: string,
    tab?: string | string[],
) {
    if (section === "engagement" && module === "sunday-school-attendance") {
        return APP_ROUTES.engagement.sundaySchool
    }
    if (section === "engagement" && module === "attendance" && tab === "analytics") {
        return "/engagement/attendance/cumulative"
    }
    if (section === "finance" && module === "income-expenditure") {
        return APP_ROUTES.finance.statements
    }
    if (section === "finance" && module === "revenue") {
        return APP_ROUTES.finance.revenue
    }
    if (section === "finance" && module === "expenditures") {
        return APP_ROUTES.finance.expenses
    }
    return null
}

export function workspaceSubmoduleRedirect(
    section: WorkspaceSectionSlug,
    module: string,
    submodule: string,
) {
    if (section === "finance" && module === "financial-activity") {
        if (submodule === "revenue") return APP_ROUTES.finance.revenue
        if (submodule === "expenses") return APP_ROUTES.finance.expenses
        if (submodule === "statement") return APP_ROUTES.finance.statements
        if (submodule === "cumulative") return "/finance/financial-activity/cumulative"
    }
    if (submodule === "analytics" && ["attendance", "tithes", "income-expenditure"].includes(module)) {
        return module === "income-expenditure"
            ? "/finance/financial-activity/cumulative"
            : `/${section}/${module}/cumulative`
    }
    if (section === "finance" && module === "income-expenditure") {
        return submodule === "cumulative"
            ? "/finance/financial-activity/cumulative"
            : APP_ROUTES.finance.statements
    }
    return null
}

export function asReportModuleKey(module: string) {
    return module as ReportModuleKey
}
