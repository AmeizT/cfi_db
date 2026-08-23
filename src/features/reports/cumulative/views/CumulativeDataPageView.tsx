"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select"
import { EmptyState } from "@/components/ui/empty-state"
import { parseTab } from "@/utils/parse-tab"
import { createQueryString } from "@/features/reports/core/lib/create-query-string"
import {
    useAttendanceAnalytics,
    useCashflowAnalytics,
    useTithesAnalytics,
} from "@/features/reports/core/hooks/use-analytics"
import type { AnalyticsScopeFilters } from "@/features/reports/core/services/get-ytd-report"
import { AnalyticsDashboard } from "@/features/reports/analytics/components/AnalyticsDashboard"
import { useAttendanceConfig } from "@/features/reports/analytics/config/attendance"
import { useCashflowConfig } from "@/features/reports/analytics/config/cashflow"
import type { ModulePageContext } from "@/features/reports/modules/types/report-modules"
import { useTithesConfig } from "@/features/reports/analytics/config/tithes"
import { unwrapDataEnvelope } from "@/features/reports/finance/tithes/utils/helpers"

export type CumulativeModule = "attendance" | "tithes" | "income-expenditure"

type Dataset = {
    label: string
    value: string
    filters: AnalyticsScopeFilters
}

export type CumulativePageConfig = {
    module: CumulativeModule
    title: string
    pathname: string
    datasets?: readonly Dataset[]
    defaultDataset?: string
    datasetParam?: string
    datasetLabel?: string
    emptyMessage: string
    permission?: string
    exportEnabled?: boolean
}

const ATTENDANCE_DATASETS = [
    { label: "Main Service", value: "main-service", filters: { service_type: "Sunday", is_special_event: "false" } },
    { label: "Sunday School", value: "sunday-school", filters: { service_type: "Sunday School" } },
    { label: "Homecell", value: "homecell", filters: { service_type: "Homecell" } },
    { label: "Midweek", value: "midweek", filters: { service_type: "Midweek" } },
    { label: "Special Services", value: "special-services", filters: { is_special_event: "true" } },
] as const satisfies readonly Dataset[]

export const CUMULATIVE_PAGE_CONFIGS: Record<CumulativeModule, CumulativePageConfig> = {
    attendance: {
        module: "attendance",
        title: "Attendance Cumulative",
        pathname: "/reports/ministry/attendance/cumulative",
        datasets: ATTENDANCE_DATASETS,
        defaultDataset: "main-service",
        datasetParam: "service",
        datasetLabel: "Attendance dataset",
        emptyMessage: "No cumulative attendance data is available for this period.",
        permission: "reports.view_attendance",
        exportEnabled: true,
    },
    tithes: {
        module: "tithes",
        title: "Tithes Cumulative",
        pathname: "/reports/finance/tithes/cumulative",
        emptyMessage: "No cumulative tithe data is available for this period.",
        permission: "reports.view_tithes",
        exportEnabled: true,
    },
    "income-expenditure": {
        module: "income-expenditure",
        title: "Financial Activity Cumulative",
        pathname: "/reports/financial-activity/cumulative",
        emptyMessage: "No cumulative financial activity is available for this period.",
        permission: "reports.view_finance",
        exportEnabled: true,
    },
}

function getYear(period: string | null) {
    const currentYear = String(new Date().getFullYear())
    const { sub } = parseTab(period ?? currentYear)
    return sub ?? currentYear
}

function normalizeStatements(statements: unknown) {
    if (!Array.isArray(statements)) return []

    return statements.map((statement, index) => {
        const row = statement as Record<string, unknown>
        const month = String(row.month ?? index + 1)
        return {
            ...row,
            id: String(row.report_id ?? month),
            label: typeof row.label === "string" ? row.label.slice(0, 3) : month,
        }
    })
}

function getResponseStatements(response: unknown) {
    const payload = unwrapDataEnvelope(response)

    if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
        return []
    }

    return normalizeStatements((payload as Record<string, unknown>).statements)
}

function CumulativeState({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-72 items-center justify-center rounded-lg border border-dashed border-border bg-muted/20 p-8 text-center text-sm text-muted-foreground">
            {children}
        </div>
    )
}

function CumulativeEmptyState({ description }: { description: string }) {
    return (
        <EmptyState
            type="reports"
            title="No cumulative data"
            description={description}
            size="full"
            className="min-h-72"
        />
    )
}

function AttendanceCumulative({ config }: { config: CumulativePageConfig }) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const datasets = config.datasets ?? []
    const parameter = config.datasetParam ?? "dataset"
    const requestedDataset = searchParams.get(parameter) ?? config.defaultDataset
    const selectedDataset = datasets.find((item) => item.value === requestedDataset) ?? datasets[0]
    const year = getYear(searchParams.get("period"))
    const query = useAttendanceAnalytics(year, selectedDataset?.filters)
    const dashboardConfig = useAttendanceConfig(selectedDataset?.filters, config.pathname)
    const rows = getResponseStatements(query.data)

    function changeDataset(value: string) {
        const queryString = createQueryString(searchParams, { [parameter]: value })
        router.push(queryString ? `${config.pathname}?${queryString}` : config.pathname)
    }

    return (
        <div className="grid gap-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm text-muted-foreground">
                    Summaries, charts, and monthly totals for the selected attendance dataset.
                </p>
                <label className="flex items-center gap-2 text-sm font-medium">
                    <span>{config.datasetLabel}</span>
                    <NativeSelect
                        aria-label={config.datasetLabel}
                        value={selectedDataset?.value}
                        onChange={(event) => changeDataset(event.target.value)}
                    >
                        {datasets.map((dataset) => (
                            <NativeSelectOption key={dataset.value} value={dataset.value}>
                                {dataset.label}
                            </NativeSelectOption>
                        ))}
                    </NativeSelect>
                </label>
            </div>
            {query.isLoading ? <CumulativeState>Loading cumulative attendance…</CumulativeState> : null}
            {query.isError ? <CumulativeState>{query.error.message}</CumulativeState> : null}
            {!query.isLoading && !query.isError && rows.length === 0 ? <CumulativeEmptyState description={config.emptyMessage} /> : null}
            {!query.isLoading && !query.isError && rows.length > 0 ? (
                <AnalyticsDashboard data={rows} config={dashboardConfig} />
            ) : null}
        </div>
    )
}

function TithesCumulative({ config }: { config: CumulativePageConfig }) {
    const searchParams = useSearchParams()
    const year = getYear(searchParams.get("period"))
    const query = useTithesAnalytics(year)
    const rows = getResponseStatements(query.data)
    const dashboardConfig = useTithesConfig(config.pathname)

    if (query.isLoading) return <CumulativeState>Loading cumulative tithes…</CumulativeState>
    if (query.isError) return <CumulativeState>{query.error.message}</CumulativeState>
    if (!rows.length) return <CumulativeEmptyState description={config.emptyMessage} />
    return <AnalyticsDashboard data={rows} config={dashboardConfig} />
}

function CashflowCumulative({ config }: { config: CumulativePageConfig }) {
    const searchParams = useSearchParams()
    const year = getYear(searchParams.get("period"))
    const query = useCashflowAnalytics(year)
    const rows = getResponseStatements(query.data)
    const dashboardConfig = useCashflowConfig(config.pathname)

    if (query.isLoading) return <CumulativeState>Loading cumulative financial activity…</CumulativeState>
    if (query.isError) return <CumulativeState>{query.error.message}</CumulativeState>
    if (!rows.length) return <CumulativeEmptyState description={config.emptyMessage} />
    return <AnalyticsDashboard data={rows} config={dashboardConfig} />
}

function contextualPathname(module: CumulativeModule, pageContext: ModulePageContext) {
    if (pageContext === "reports") return CUMULATIVE_PAGE_CONFIGS[module].pathname
    if (module === "attendance") return "/engagement/attendance/cumulative"
    if (module === "tithes") return "/finance/tithes/cumulative"
    return "/finance/financial-activity/cumulative"
}

export function CumulativeDataPageView({
    module,
    pageContext = "reports",
}: {
    module: CumulativeModule
    pageContext?: ModulePageContext
}) {
    const config = {
        ...CUMULATIVE_PAGE_CONFIGS[module],
        pathname: contextualPathname(module, pageContext),
    }

    if (module === "attendance") return <AttendanceCumulative config={config} />
    if (module === "tithes") return <TithesCumulative config={config} />
    return <CashflowCumulative config={config} />
}
