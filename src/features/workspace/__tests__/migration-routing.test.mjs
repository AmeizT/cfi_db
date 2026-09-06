import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import test from "node:test"

import { workspaceNavigation } from "../../../config/workspace-navigation.ts"
import { reportHref } from "../../reports/modules/lib/report-route-redirect.ts"
import { getReportContextActionVisibility } from "../config/report-context.ts"
import {
    REPORT_SOURCE_RECORD_ROUTES,
    createSourceRecordsHref,
} from "../config/report-source-routing.ts"
import {
    workspaceModuleRedirect,
    workspaceSectionToInternal,
    workspaceSubmoduleRedirect,
} from "../config/workspace-module-routing.ts"

const sharedModulePages = [
    "app/(authenticated)/(shell)/(workspace)/finance/tithes/page.tsx",
    "app/(authenticated)/(shell)/(workspace)/finance/revenue/page.tsx",
    "app/(authenticated)/(shell)/(workspace)/finance/expenses/page.tsx",
    "app/(authenticated)/(shell)/(workspace)/finance/statements/page.tsx",
    "app/(authenticated)/(shell)/(workspace)/finance/remittance/page.tsx",
    "app/(authenticated)/(shell)/(workspace)/engagement/attendance/page.tsx",
    "app/(authenticated)/(shell)/(workspace)/engagement/outreach/page.tsx",
    "app/(authenticated)/(shell)/(workspace)/engagement/check-ins/page.tsx",
]

test("Workspace module and submodule routes reuse ReportModulePageView on the shared shell", async () => {
    const [moduleRoute, submoduleRoute, shellLayout, authenticatedLayout, ...explicitRoutes] = await Promise.all([
        readFile("app/(authenticated)/(shell)/(workspace)/finance/[module]/page.tsx", "utf8"),
        readFile("app/(authenticated)/(shell)/(workspace)/finance/[module]/[submodule]/page.tsx", "utf8"),
        readFile("app/(authenticated)/(shell)/layout.tsx", "utf8"),
        readFile("app/(authenticated)/layout.tsx", "utf8"),
        ...sharedModulePages.map((path) => readFile(path, "utf8")),
    ])
    assert.match(shellLayout, /AppShell/)
    assert.match(authenticatedLayout, /AuthenticatedAppLayout/)
    assert.match(moduleRoute, /workspaceModuleRedirect/)
    assert.match(moduleRoute, /pageContext="workspace"/)
    assert.match(submoduleRoute, /isReportSubmoduleRoute/)
    assert.match(submoduleRoute, /submodule=\{submodule\}/)
    for (const source of explicitRoutes) {
        assert.match(source, /ReportModulePageView/)
        assert.match(source, /pageContext="workspace"/)
        assert.doesNotMatch(source, /WorkspaceFinanceRecordsView|AttendanceContainer/)
    }
})

test("engagement maps to ministry only at the Workspace route boundary", () => {
    assert.equal(workspaceSectionToInternal("engagement"), "ministry")
    assert.equal(workspaceSectionToInternal("finance"), "finance")
    assert.equal(workspaceSectionToInternal("ministry"), null)
    assert.equal(workspaceSectionToInternal("unknown"), null)
})

test("Workspace route redirects resolve to simplified canonical destinations", () => {
    assert.equal(workspaceModuleRedirect("finance", "revenue"), "/finance/revenue")
    assert.equal(workspaceModuleRedirect("engagement", "sunday-school-attendance"), "/engagement/attendance/sunday-school")
    assert.equal(workspaceSubmoduleRedirect("finance", "income-expenditure", "analytics"), "/finance/financial-activity/cumulative")
    assert.equal(workspaceSubmoduleRedirect("engagement", "attendance", "analytics"), "/engagement/attendance/cumulative")
})

test("removed overview URLs redirect to useful destinations and preserve query state", async () => {
    const [workspaceOverview, financeOverview, engagementOverview, legacyFinance] = await Promise.all([
        readFile("app/(authenticated)/(shell)/(workspace)/workspace/page.tsx", "utf8"),
        readFile("app/(authenticated)/(shell)/(workspace)/workspace/finance/page.tsx", "utf8"),
        readFile("app/(authenticated)/(shell)/(workspace)/workspace/engagement/page.tsx", "utf8"),
        readFile("app/(authenticated)/(shell)/(dashboard)/app/finance/overview/page.tsx", "utf8"),
    ])
    assert.match(workspaceOverview, /reportHref\("\/", await searchParams\)/)
    assert.match(financeOverview, /reportHref\("\/finance\/tithes", await searchParams\)/)
    assert.match(engagementOverview, /reportHref\("\/engagement\/attendance", await searchParams\)/)
    assert.match(legacyFinance, /reportHref\("\/finance\/tithes", await searchParams\)/)
})

test("server redirects preserve arrays and supported search parameters without renaming", () => {
    const href = reportHref("/finance/tithes/contributors", {
        period: "2026-06",
        report_id: "42",
        page: "3",
        search: "Motlhabi",
        ordering: "-amount",
        status: ["active", "review"],
        type: "operating",
    })
    const url = new URL(href, "https://workspace.test")
    assert.equal(url.pathname, "/finance/tithes/contributors")
    assert.equal(url.searchParams.get("period"), "2026-06")
    assert.equal(url.searchParams.get("report_id"), "42")
    assert.equal(url.searchParams.get("reportId"), null)
    assert.equal(url.searchParams.get("page"), "3")
    assert.equal(url.searchParams.get("search"), "Motlhabi")
    assert.equal(url.searchParams.get("ordering"), "-amount")
    assert.deepEqual(url.searchParams.getAll("status"), ["active", "review"])
    assert.equal(url.searchParams.get("type"), "operating")
})

test("module URL helpers are explicitly parameterized for Workspace context", async () => {
    const [modules, submodules, pagination, filters] = await Promise.all([
        readFile("src/features/reports/modules/config/report-modules.ts", "utf8"),
        readFile("src/features/reports/modules/config/report-submodules.ts", "utf8"),
        readFile("src/features/reports/core/components/hooks/useDataTablePagination.ts", "utf8"),
        readFile("src/features/reports/finance/tithes/components/Filters.tsx", "utf8"),
    ])
    assert.match(modules, /pageContext: ModulePageContext/)
    assert.match(submodules, /pageContext === "workspace"/)
    assert.match(submodules, /return `\/\$\{publicSection\}\/\$\{module\}`/)
    assert.match(pagination, /usePathname\(\)/)
    assert.match(pagination, /new URLSearchParams\(searchParams\.toString\(\)\)/)
    assert.match(filters, /createQueryString\(searchParams/)
    assert.match(filters, /`\$\{pathname\}\?\$\{query\}`/)
})

test("every monthly report section maps to its canonical raw source route", () => {
    assert.deepEqual(Object.keys(REPORT_SOURCE_RECORD_ROUTES), [
        "general_attendance", "sunday_school_attendance", "tithes", "revenue",
        "operating_expenses", "activity_other_expenses",
    ])
    assert.equal(
        createSourceRecordsHref("general_attendance", { period: "2026-06-01", reportId: 42 }),
        "/engagement/attendance?period=2026-06&report_id=42&section=general_attendance",
    )
    assert.equal(
        createSourceRecordsHref("operating_expenses", { period: "2026-06", reportId: 42 }),
        "/finance/expenses?period=2026-06&report_id=42&section=operating_expenses&type=operating",
    )
})

test("report context actions separate editable, submitted, and locked reports", () => {
    assert.deepEqual(
        getReportContextActionVisibility("draft", { is_editable: true, can_amend: false, can_request_reopen: false }),
        { editInWizard: true, viewSubmittedSection: false, viewReport: true, amendReport: false, requestReopening: false },
    )
    assert.equal(getReportContextActionVisibility("submitted", { is_editable: true, can_amend: true, can_request_reopen: false }).editInWizard, false)
    assert.equal(getReportContextActionVisibility("locked", { is_editable: false, can_amend: false, can_request_reopen: true }).requestReopening, true)
})

test("Workspace report banner accepts canonical context aliases and disappears without a report", async () => {
    const [banner, moduleView] = await Promise.all([
        readFile("src/features/reports/workflow/components/ReportSourceBanner.tsx", "utf8"),
        readFile("src/features/reports/modules/views/ReportModulePageView.tsx", "utf8"),
    ])
    assert.match(banner, /searchParams\.get\("report_id"\)/)
    assert.match(banner, /searchParams\.get\("reportId"\)/)
    assert.match(banner, /if \(!query\.data\) return null/)
    assert.match(moduleView, /pageContext === "workspace" \? <ReportSourceBanner/)
})

test("Workspace navigation uses the required static groups and child hierarchy", () => {
    assert.deepEqual(workspaceNavigation.map((section) => section.title), [
        undefined, "AI Assistant", "Reporting", "Operations", "Organization", "Administration",
    ])
    assert.deepEqual(workspaceNavigation[2].items.map((item) => item.label), [
        "Reports Overview", "Current Report", "Report Activity", "Compliance", "Performance",
    ])
    assert.deepEqual(workspaceNavigation[3].items.map((item) => item.label), ["Finance", "Engagement"])
    assert.deepEqual(workspaceNavigation[3].items[0].children.map((item) => item.label), [
        "Tithes", "Revenue", "Expenses", "Statements", "Remittance",
    ])
    assert.deepEqual(workspaceNavigation[4].items.map((item) => item.label), ["Members", "Communities", "Assets", "Library"])
    assert.ok(workspaceNavigation[3].items.every((item) => item.children?.length))
    assert.equal(JSON.stringify(workspaceNavigation).includes('"label":"Overview"'), false)
    assert.equal(JSON.stringify(workspaceNavigation).includes('"label":"People"'), false)
})

test("the app shell renders one global sidebar with the recovered shortcut integration", async () => {
    const [sidebar, navigation, shell] = await Promise.all([
        readFile("src/layouts/ContextSidebar.tsx", "utf8"),
        readFile("src/layouts/sidebar/UnifiedSidebarNavigation.tsx", "utf8"),
        readFile("src/layouts/app-shell.tsx", "utf8"),
    ])
    assert.doesNotMatch(sidebar, /NavRail/)
    assert.match(sidebar, /useSidebarShortcuts/)
    assert.match(sidebar, /<SidebarShortcuts/)
    assert.match(sidebar, /AssemblySwitcher/)
    assert.match(sidebar, /ProfileDropdown variant="sidebar"/)
    assert.match(navigation, /expandedKey/)
    assert.match(navigation, /setExpandedKey\(nextOpen \? item\.key : null\)/)
    assert.equal((shell.match(/<ContextSidebar/g) ?? []).length, 1)
})

test("Members workflows live in shared page navigation", async () => {
    const [layout, navigation] = await Promise.all([
        readFile("app/(authenticated)/(shell)/(dashboard)/members/layout.tsx", "utf8"),
        readFile("src/features/people/members/config/members-section-navigation.ts", "utf8"),
    ])
    assert.match(layout, /MembersSectionNavigation/)
    for (const label of ["Directory", "Households", "Onboarding", "Baptisms", "Dedications", "Transfers"]) {
        assert.match(navigation, new RegExp(`label: "${label}"`))
    }
})

test("new report snapshots record Workspace source routes", async () => {
    const lifecycle = await readFile("backend/cfidb/apps/reports/services/lifecycle.py", "utf8")
    assert.match(lifecycle, /route = "\/engagement\/attendance"/)
    assert.match(lifecycle, /route = "\/finance\/tithes"/)
    assert.match(lifecycle, /route = "\/finance\/expenses\?type=operating"/)
})
