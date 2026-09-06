"use client"

import type { ReactNode } from "react"
import {
    useSearchParams,
    type ReadonlyURLSearchParams,
} from "next/navigation"
import { EmptyState } from "@/components/ui/empty-state"
import { Skeleton } from "@/components/ui/skeleton"
import View from "@/components/ui/view"
import type { AssemblyReport, AttendanceResponse } from "@/dal/types"
import AttendanceView from "@/features/reports/attendance/views/AttendanceDataGrid"
import { ComplianceStatusView } from "@/features/reports/compliance/status/views/ComplianceStatusView"
import { useDataTablePagination } from "@/features/reports/core/components/hooks/useDataTablePagination"
import { useReportAttendance } from "@/features/reports/core/hooks/use-attendance"
import { useReportFinance } from "@/features/reports/core/hooks/use-report-finance"
import { useReportSelection } from "@/features/reports/core/hooks/use-report-selection"
import { getReportPeriod } from "@/features/reports/core/lib/report-selection"
import type { FinanceResponse } from "@/features/reports/core/services/get-report-finance"
import { ExceptionView } from "@/features/reports/exceptions/views/ExceptionView"
import { CumulativeDataPageView } from "@/features/reports/cumulative/views/CumulativeDataPageView"
import CashFlowView from "@/features/reports/finance/cashflow/CashflowView"
import { WeeklyFinancialActivityView } from "@/features/reports/finance/financial-activity/WeeklyFinancialActivityView"
import {
    TithesRouteContent,
    type TithesRouteView,
} from "@/features/reports/finance/tithes/workspace/TithesWorkspace"
import { TithesCumulativeToolbar } from "@/features/reports/finance/tithes/components/TithesDataToolbar"
import { ReportCumulativeToolbar } from "@/features/reports/core/components/ReportDataToolbar"
import { ReportsOverview as ReportsQueueView } from "@/features/reports/activity/views/ReportOverview"
import { SundaySchoolAttendanceView } from "@/features/people/sunday-school/views/SundaySchoolAttendanceView"
import { ReportStatusPopover } from "@/features/reports/workflow/components/ReportStatusPopover"
import {
    getReportModuleConfig,
    getReportModuleTabs,
    getReportModuleViewTabs,
} from "../config/report-modules"
import {
    getActiveReportSubmodule,
    getReportSubmoduleTitle,
    getReportSubmoduleTabs,
} from "../config/report-submodules"
import { ReportModuleDataTable } from "../components/ReportModuleDataTable"
import { ReportModuleHeader } from "../components/ReportModuleHeader"
import { ReportModuleTabs } from "../components/ReportModuleTabs"
import type {
    ReportModuleConfig,
    ReportModuleKey,
    ModulePageContext,
    ReportRouteKey,
    ReportSection,
} from "../types/report-modules"
import { ReportPerformancePageView } from "./ReportPerformancePageView"
import { Separator } from "@/components/ui/separator";

type RendererContext = {
    attendance: AttendanceResponse | undefined
    config: ReportModuleConfig
    finance: FinanceResponse | undefined
    isAttendanceLoading: boolean
    isFinanceLoading: boolean
    pagination: ReturnType<typeof useDataTablePagination>
    reportId: string | undefined
    selectedReport: AssemblyReport | undefined
    submodule: string | undefined
    view: string
    pageContext: ModulePageContext
}

type ModuleRenderer = (context: RendererContext) => ReactNode

function getReportId(searchParams: ReadonlyURLSearchParams) {
    return (
        searchParams.get("reportId") ??
        searchParams.get("reportid") ??
        searchParams.get("report_id") ??
        searchParams.get("id") ??
        undefined
    )
}

function ReportModulePlaceholder({
    title,
    description,
}: {
    title: string
    description: string
}) {
    return (
        <EmptyState
            type="reports"
            title={title}
            description={description}
            className="min-h-72"
        />
    )
}

function MissingReportState({ label }: { label: string }) {
    return (
        <div className="flex min-h-72 items-center justify-center">
            <EmptyState
                type="reports"
                variant="both"
                context={{ label }}
            />
        </div>
    )
}

const REPORT_MODULE_RENDERERS: Partial<Record<ReportRouteKey, ModuleRenderer>> = {
    "activity/all": () => <ReportsQueueView />,
    "activity/queue": () => <ReportsQueueView />,
    "activity/compliance": () => <ComplianceStatusView embedded />,
    "activity/flagged": () => <ExceptionView embedded />,

    "finance/tithes": ({
        config,
        pageContext,
        reportId,
        selectedReport,
        view,
    }) => {
        if (view === "cumulative") {
            return (
                <>
                    {pageContext === "workspace" ? <TithesCumulativeToolbar /> : null}
                    <CumulativeDataPageView module="tithes" pageContext={pageContext} />
                </>
            )
        }

        if (!reportId) {
            return <MissingReportState label={config.title} />
        }

        if (isTithesRouteView(view)) {
            return (
                <TithesRouteContent
                    view={view}
                    pageContext={pageContext}
                    readOnly={Boolean(selectedReport && selectedReport.status !== "draft")}
                />
            )
        }

        if (view === "more") {
            return <TithesRouteContent view="audit-log" pageContext={pageContext} />
        }

        return (
            <ReportModulePlaceholder
                title={`${config.title} ${view}`}
                description="This Tithes submodule is not registered."
            />
        )
    },
    "finance/income-expenditure": ({
        config,
        finance,
        isFinanceLoading,
        pagination,
        reportId,
        view,
        pageContext,
    }) => {
        if (view === "cumulative") {
            return (
                <>
                    {pageContext === "workspace" ? (
                        <ReportCumulativeToolbar
                            section="finance"
                            module="income-expenditure"
                            pageContext={pageContext}
                            monthlySubmodule="statement"
                            label="Income & Expenditure"
                        />
                    ) : null}
                    <CumulativeDataPageView module="income-expenditure" pageContext={pageContext} />
                </>
            )
        }

        if (!reportId) {
            return <MissingReportState label={config.title} />
        }

        return (
            <CashFlowView
                cashflow={finance?.cashflow}
                isLoading={isFinanceLoading}
                pagination={pagination}
                toolbarScope={pageContext === "workspace" ? {
                    section: "finance",
                    module: "income-expenditure",
                    pageContext,
                    monthlySubmodule: "statement",
                    label: "Income & Expenditure",
                } : undefined}
            />
        )
    },
    "finance/financial-activity": ({
        config,
        finance,
        isFinanceLoading,
        pagination,
        reportId,
        view,
        pageContext,
    }) => {
        if (view === "cumulative") {
            return (
                <>
                    {pageContext === "workspace" ? (
                        <ReportCumulativeToolbar
                            section="finance"
                            module="financial-activity"
                            pageContext={pageContext}
                            monthlySubmodule="statement"
                            label="Financial Activity"
                        />
                    ) : null}
                    <CumulativeDataPageView module="income-expenditure" pageContext={pageContext} />
                </>
            )
        }

        if (!reportId) {
            return <MissingReportState label={config.title} />
        }

        if (view === "revenue" || view === "expenses") {
            return (
                <WeeklyFinancialActivityView
                    finance={finance}
                    kind={view}
                    isLoading={isFinanceLoading}
                />
            )
        }

        return (
            <CashFlowView
                cashflow={finance?.cashflow}
                isLoading={isFinanceLoading}
                pagination={pagination}
                showSummary
                toolbarScope={pageContext === "workspace" ? {
                    section: "finance",
                    module: "financial-activity",
                    pageContext,
                    monthlySubmodule: "statement",
                    label: "Financial Activity",
                } : undefined}
            />
        )
    },
    "ministry/attendance": ({
        attendance,
        config,
        isAttendanceLoading,
        pagination,
        reportId,
        selectedReport,
        view,
        pageContext,
    }) => {
        if (view === "cumulative") {
            return (
                <>
                    {pageContext === "workspace" ? (
                        <ReportCumulativeToolbar
                            section="ministry"
                            module="attendance"
                            pageContext={pageContext}
                            monthlySubmodule={null}
                            label="Attendance"
                        />
                    ) : null}
                    <CumulativeDataPageView module="attendance" pageContext={pageContext} />
                </>
            )
        }

        if (view === "special-services") {
            return <ReportModulePlaceholder
                title="No special service attendance yet"
                description="Attendance recorded for conferences, special meetings, celebrations and other special services will appear here."
            />
        }

        if (!reportId) return <MissingReportState label={config.title} />
        const reportPeriod = selectedReport ? getReportPeriod(selectedReport) : null
        const period = reportPeriod
            ? `${reportPeriod.year}-${String(reportPeriod.month + 1).padStart(2, "0")}`
            : undefined
        const sharedProps = {
            attendance,
            isLoading: isAttendanceLoading,
            pagination,
            reportId,
            pageContext,
            readOnly: Boolean(selectedReport && selectedReport.status !== "draft"),
        }

        if (view === "homecell") {
            return <AttendanceView
                {...sharedProps}
                service="homecell"
                reportingPeriod={selectedReport ? { start: selectedReport.period_start, end: selectedReport.period_end } : undefined}
            />
        }

        return (
            <div className="flex flex-col gap-10 py-4">
                <section aria-labelledby="general-sunday-heading">
                    <h2 id="general-sunday-heading" className="pb-3 text-lg font-semibold text-foreground">Main Service</h2>
                    <AttendanceView {...sharedProps} service="main-service" />
                </section>
                <Separator className="border-border-subtle dark:border-neutral-800" />
                <section aria-labelledby="sunday-school-heading">
                    <h2 id="sunday-school-heading" className="pb-3 text-lg font-semibold text-foreground">Sunday School</h2>
                    {period ? <SundaySchoolAttendanceView embedded period={period} reportId={reportId} />
                        : <MissingReportState label="Sunday School attendance for this period" />}
                </section>
                <Separator className="border-border-subtle dark:border-neutral-800" />
                <section aria-labelledby="midweek-heading">
                    <h2 id="midweek-heading" className="pb-3 text-lg font-semibold text-foreground">Midweek (Fasting and Prayer)</h2>
                    <AttendanceView {...sharedProps} service="midweek" />
                </section>
            </div>
        )
    },
    "finance/remittance": ({ config }) => (
        <ReportModulePlaceholder
            title={config.title}
            description="Remittance reporting is registered in navigation and will use this shell when the data source is ready."
        />
    ),
    "finance/revenue": ({ config }) => (
        <ReportModulePlaceholder
            title={config.title}
            description="Standalone revenue reporting will be enabled once supported by the report data API."
        />
    ),
    "finance/expenditures": ({ config }) => (
        <ReportModulePlaceholder
            title={config.title}
            description="Standalone expenditure reporting will be enabled once supported by the report data API."
        />
    ),
    "ministry/check-ins": ({ config }) => (
        <ReportModulePlaceholder
            title={config.title}
            description="Check-ins is a future reporting module and is disabled in the sidebar for now."
        />
    ),
    "ministry/outreach": () => (
        <ReportModulePlaceholder
            title="Evangelism & Outreach"
            description="This is the starting point for evangelism activities, outreach campaigns, crusades, community outreach, and visitor or convert follow-up."
        />
    ),
    "performance/overview": () => <ReportPerformancePageView module="overview" embedded />,
    "performance/tithes": () => <ReportPerformancePageView module="tithes" embedded />,
    "performance/attendance": () => <ReportPerformancePageView module="attendance" embedded />,
}

const TITHE_ROUTE_VIEWS = new Set<string>([
    "transactions",
    "contributors",
    "cumulative",
    "receipts",
    "audit-log",
])

const REPORT_NAVIGATOR_HIDDEN_VIEWS = new Set<string>([
    "audit-log",
    "contributors",
    "cumulative",
    "performance",
    "summary",
])

const REPORT_NAVIGATOR_HIDDEN_ROUTES = new Set<ReportRouteKey>([
    "activity/compliance",
    "activity/flagged",
])

const REPORT_BACKED_ROUTES = new Set<ReportRouteKey>([
    "finance/tithes",
    "finance/income-expenditure",
    "finance/financial-activity",
    "ministry/attendance",
])

function isTithesRouteView(view: string): view is TithesRouteView {
    return TITHE_ROUTE_VIEWS.has(view)
}

export function ReportModulePageView({
    section,
    module,
    submodule,
    pageContext = "reports",
}: {
    section: ReportSection
    module: ReportModuleKey
    submodule?: string
    pageContext?: ModulePageContext
}) {
    const searchParams = useSearchParams()
    const pagination = useDataTablePagination()
    const routeKey = `${section}/${module}` as ReportRouteKey
    const config = getReportModuleConfig(section, module)
    const submoduleTabs = getReportSubmoduleTabs(section, module, searchParams, pageContext)
    const moduleTabs = getReportModuleTabs(section, searchParams, pageContext)
    const resolvedViewTabs = submoduleTabs.length
        ? submoduleTabs
        : section === "activity" || section === "performance"
            ? moduleTabs
            : getReportModuleViewTabs(section, module, searchParams, pageContext)
    const usesWorkspaceDataToolbar = pageContext === "workspace"
        && (
            routeKey === "finance/tithes"
            || routeKey === "finance/income-expenditure"
            || routeKey === "finance/financial-activity"
            || routeKey === "ministry/attendance"
        )
    const viewTabs = usesWorkspaceDataToolbar
        ? resolvedViewTabs.filter((tab) => tab.key !== "cumulative")
        : resolvedViewTabs
    const activeSubmodule = getActiveReportSubmodule(section, module, submodule)
    const activeView =
        activeSubmodule ??
        searchParams.get("tab") ??
        (section === "activity" || section === "performance" ? module : undefined) ??
        config?.defaultView ??
        viewTabs.at(0)?.key ??
        "data"
    const renderView = submoduleTabs.length
        ? submodule ?? activeView
        : activeView
    const reportId = getReportId(searchParams)
    const needsReportSelection = REPORT_BACKED_ROUTES.has(routeKey)
        && renderView !== "cumulative"
    const reportSelection = useReportSelection({
        enabled: needsReportSelection,
        reportId,
        defaultTab: !submoduleTabs.length && viewTabs.length ? activeView : undefined,
    })
    const shouldLoadAttendance = routeKey === "ministry/attendance"
    const shouldLoadFinance = routeKey === "finance/income-expenditure" || routeKey === "finance/financial-activity"
    const paginationParams = {
        page: pagination.currentPage,
        pageSize: pagination.pageSize,
        search: searchParams.get("search") ?? undefined,
    }
    const { data: attendance, isLoading: isAttendanceLoading } =
        useReportAttendance(shouldLoadAttendance ? reportId : undefined, paginationParams)
    const { data: finance, isLoading: isFinanceLoading } =
        useReportFinance(shouldLoadFinance ? reportId : undefined, paginationParams)

    if (!config) {
        return null
    }
    const renderer = REPORT_MODULE_RENDERERS[routeKey]
    const navigationActiveView = routeKey === "ministry/attendance" && renderView === "cumulative"
        ? searchParams.get("service") === "homecell" ? "homecell" : "main-service"
        : usesWorkspaceDataToolbar && renderView === "cumulative"
            ? viewTabs.at(0)?.key ?? activeView
            : activeView
    const pageTitle =
        getReportSubmoduleTitle(section, module, navigationActiveView)
        ?? getReportSubmoduleTitle(section, module, activeView)
    const showReportNavigator =
        !REPORT_NAVIGATOR_HIDDEN_VIEWS.has(renderView)
        && !REPORT_NAVIGATOR_HIDDEN_ROUTES.has(routeKey)
    const waitForSelectedAttendanceReport = routeKey === "ministry/attendance"
        && renderView !== "cumulative"
        && Boolean(reportId)
        && reportSelection.isLoading
        && !reportSelection.selectedReport
    const isResolvingReport = reportSelection.isResolving
        || waitForSelectedAttendanceReport

    return (
        <View className="gap-0" >
            <ReportModuleHeader
                actions={pageContext === "workspace" && REPORT_BACKED_ROUTES.has(routeKey)
                    ? <ReportStatusPopover />
                    : undefined}
                config={config}
                showReportNavigator={showReportNavigator}
                title={pageTitle}
            />

            <ReportModuleTabs
                activeView={navigationActiveView}
                tabs={viewTabs} 
            />

            <View.Body className="gap-0">
                <ReportModuleDataTable>
                    {isResolvingReport ? (
                        <div className="space-y-3 py-4" aria-label="Loading report">
                            <Skeleton className="h-24 w-full rounded-lg" />
                            <Skeleton className="h-72 w-full rounded-lg" />
                        </div>
                    ) : renderer ? (
                        renderer({
                            attendance,
                            config,
                            finance,
                            isAttendanceLoading,
                            isFinanceLoading,
                            pagination,
                            pageContext,
                            reportId,
                            selectedReport: reportSelection.selectedReport,
                            submodule,
                            view: renderView,
                        })
                    ) : (
                        <ReportModulePlaceholder
                            title={config.title}
                            description={config.description}
                        />
                    )}
                </ReportModuleDataTable>
            </View.Body>
        </View>
    )
}
