"use client"

import type { ReactNode } from "react"
import {
    usePathname,
    useSearchParams,
    type ReadonlyURLSearchParams,
} from "next/navigation"
import { EmptyState } from "@/components/ui/empty-state"
import View from "@/components/ui/view"
import type { AttendanceResponse } from "@/dal/types"
import AttendanceView from "@/features/reports/attendance/views/AttendanceDataGrid"
import { ComplianceStatusView } from "@/features/reports/compliance/status/views/ComplianceStatusView"
import { useDataTablePagination } from "@/features/reports/core/components/hooks/useDataTablePagination"
import { useReportAttendance } from "@/features/reports/core/hooks/use-attendance"
import { useReportFinance } from "@/features/reports/core/hooks/use-report-finance"
import type { FinanceResponse } from "@/features/reports/core/services/get-report-finance"
import { ExceptionView } from "@/features/reports/exceptions/views/ExceptionView"
import { CumulativeDataPageView } from "@/features/reports/cumulative/views/CumulativeDataPageView"
import CashFlowView from "@/features/reports/finance/cashflow/CashflowView"
import { WeeklyFinancialActivityView } from "@/features/reports/finance/financial-activity/WeeklyFinancialActivityView"
import {
    TithesRouteContent,
    type TithesRouteView,
} from "@/features/reports/finance/tithes/workspace/TithesWorkspace"
import { ReportsOverview as ReportsQueueView } from "@/features/reports/activity/views/ReportOverview"
import { SundaySchoolAttendanceView } from "@/features/people/sunday-school/views/SundaySchoolAttendanceView"
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
    ReportRouteKey,
    ReportSection,
} from "../types/report-modules"
import { ReportPerformancePageView } from "./ReportPerformancePageView"

type RendererContext = {
    attendance: AttendanceResponse | undefined
    config: ReportModuleConfig
    finance: FinanceResponse | undefined
    isAttendanceLoading: boolean
    isFinanceLoading: boolean
    pagination: ReturnType<typeof useDataTablePagination>
    reportId: string | undefined
    submodule: string | undefined
    view: string
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
        reportId,
        view,
    }) => {
        if (view === "cumulative") {
            return <CumulativeDataPageView module="tithes" />
        }

        if (!reportId) {
            return <MissingReportState label={config.title} />
        }

        if (isTithesRouteView(view)) {
            return <TithesRouteContent view={view} />
        }

        if (view === "more") {
            return <TithesRouteContent view="audit-log" />
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
    }) => {
        if (view === "cumulative") {
            return <CumulativeDataPageView module="income-expenditure" />
        }

        if (!reportId) {
            return <MissingReportState label={config.title} />
        }

        return (
            <CashFlowView
                cashflow={finance?.cashflow}
                isLoading={isFinanceLoading}
                pagination={pagination}
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
    }) => {
        if (view === "cumulative") {
            return <CumulativeDataPageView module="income-expenditure" />
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
            />
        )
    },
    "ministry/attendance": ({
        attendance,
        config,
        isAttendanceLoading,
        pagination,
        reportId,
        view,
    }) => {
        if (view === "cumulative") {
            return <CumulativeDataPageView module="attendance" />
        }

        if (view === "sunday-school") {
            return <SundaySchoolAttendanceView embedded />
        }

        if (!reportId) {
            return <MissingReportState label={config.title} />
        }

        return (
            <AttendanceView
                attendance={attendance}
                isLoading={isAttendanceLoading}
                pagination={pagination}
                service={view === "homecell" || view === "midweek" || view === "special-services" ? view : "main-service"}
            />
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

function isTithesRouteView(view: string): view is TithesRouteView {
    return TITHE_ROUTE_VIEWS.has(view)
}

export function ReportModulePageView({
    section,
    module,
    submodule,
}: {
    section: ReportSection
    module: ReportModuleKey
    submodule?: string
}) {
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const pagination = useDataTablePagination()
    const reportId = getReportId(searchParams)
    const routeKey = `${section}/${module}` as ReportRouteKey
    const shouldLoadAttendance = routeKey === "ministry/attendance"
    const shouldLoadFinance = routeKey === "finance/income-expenditure" || routeKey === "finance/financial-activity"
    const paginationParams = {
        page: pagination.currentPage,
        pageSize: pagination.pageSize,
    }
    const { data: attendance, isLoading: isAttendanceLoading } =
        useReportAttendance(shouldLoadAttendance ? reportId : undefined, paginationParams)
    const { data: finance, isLoading: isFinanceLoading } =
        useReportFinance(shouldLoadFinance ? reportId : undefined, paginationParams)

    const config = getReportModuleConfig(section, module)

    if (!config) {
        return null
    }

    const submoduleTabs = getReportSubmoduleTabs(section, module, searchParams)
    const moduleTabs = getReportModuleTabs(section, searchParams)
    const viewTabs = submoduleTabs.length
        ? submoduleTabs
        : section === "activity" || section === "performance"
            ? moduleTabs
            : getReportModuleViewTabs(section, module, searchParams)
    const activeSubmodule = getActiveReportSubmodule(section, module, submodule)
    const activeView =
        activeSubmodule ??
        searchParams.get("tab") ??
        (section === "activity" || section === "performance" ? module : undefined) ??
        config.defaultView ??
        viewTabs.at(0)?.key ??
        "data"
    const renderView = submoduleTabs.length
        ? submodule ?? activeView
        : activeView
    const renderer = REPORT_MODULE_RENDERERS[routeKey]
    const pageTitle =
        getReportSubmoduleTitle(section, module, renderView)
        ?? getReportSubmoduleTitle(section, module, activeView)
    const showReportNavigator =
        !REPORT_NAVIGATOR_HIDDEN_VIEWS.has(renderView)
        && !REPORT_NAVIGATOR_HIDDEN_ROUTES.has(routeKey)

    return (
        <View className="gap-0" >
            <ReportModuleHeader
                activeModule={module}
                config={config}
                pathname={pathname}
                title={pageTitle}
                tabs={moduleTabs}
            />

            <ReportModuleTabs
                activeView={activeView}
                showReportNavigator={showReportNavigator}
                tabs={viewTabs} 
            />

            <View.Body className="gap-0">
                <ReportModuleDataTable>
                    {renderer ? (
                        renderer({
                            attendance,
                            config,
                            finance,
                            isAttendanceLoading,
                            isFinanceLoading,
                            pagination,
                            reportId,
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
