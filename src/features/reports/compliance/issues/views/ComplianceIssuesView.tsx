"use client"

import * as React from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { AlertCircle, CheckCircle2, Clock3, MapPinned } from "lucide-react"
import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/ui/empty-state"
import { KPI } from "@/components/ui/kpi"
import {
    NativeSelect,
    NativeSelectOption,
} from "@/components/ui/native-select"
import { Skeleton } from "@/components/ui/skeleton"
import { DataTable } from "@/features/reports/core/components/DataTable"
import { useDataTablePagination } from "@/features/reports/core/components/hooks/useDataTablePagination"
import type { TableSchema } from "@/features/data-table/types/tableSchema.types"
import { getCurrentYear } from "@/layouts/utils/get-current-year"
import { useUser } from "@/hooks/query/use-user"
import {
    ComplianceIssueTypeSchema,
    type ComplianceIssue,
    type ComplianceIssueType,
} from "../schemas/issues"
import { useComplianceIssues } from "../hooks/use-compliance-issues"
import { IssuesBarChart, type IssueChartDatum } from "../components/IssuesCharts"

const ALL_FILTER_VALUE = "all"
const RESOLVED_STATUS = "RESOLVED"
const QUEUED_STATUS = "PENDING"
const MAX_RANKED_ITEMS = 10

const issueTypeLabels: Record<ComplianceIssueType, string> = {
    no_data: "No data available",
    not_collected: "Statistics not collected",
    not_applicable: "Not applicable",
    technical_issue: "Technical issue",
    other: "Other",
}

const issueTableSchema: TableSchema = {
    intent: "compliance",
    columns: [
        { id: "assembly", label: "Assembly" },
        { id: "country", label: "Country" },
        { id: "section_label", label: "Section" },
        { id: "issue_type_label", label: "Issue Type" },
        { id: "description", label: "Reason" },
        { id: "raised_at", label: "Raised At" },
        { id: "action_label", label: "Issue Action" },
        { id: "resolved_label", label: "Resolved" },
    ],
    variant: {
        mode: "list",
        border: "y",
        theme: "neutral",
        interaction: {
            editable: false,
            selectable: false,
            density: "comfortable",
        },
    },
}

const tableOptions = {
    enablePinning: true,
}

type FilterOption = {
    value: string
    label: string
}

type ComplianceIssueTableRow = ComplianceIssue &
    Record<string, unknown> & {
        id: number
        assembly: string
        section_label: string
        issue_type_label: string
        description: string
        raised_at: string
        action_label: string
        resolved_label: string
    }

function formatLabel(value: string | null | undefined) {
    if (!value) return "Unspecified"

    return value
        .replace(/_/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase())
}

function formatDate(value: string | null | undefined, options: Intl.DateTimeFormatOptions) {
    if (!value) return "Not available"

    const date = new Date(value)

    if (Number.isNaN(date.getTime())) {
        return "Not available"
    }

    return new Intl.DateTimeFormat(undefined, options).format(date)
}

function parseIssueType(value: string | null): ComplianceIssueType | null {
    const parsed = ComplianceIssueTypeSchema.safeParse(value)
    return parsed.success ? parsed.data : null
}

function getUniqueOptions<T>(
    rows: T[],
    getValue: (row: T) => string | number | null | undefined,
    getLabel: (row: T) => string | null | undefined
): FilterOption[] {
    const options = new Map<string, string>()

    rows.forEach((row) => {
        const rawValue = getValue(row)
        const label = getLabel(row)

        if (rawValue === null || rawValue === undefined || !label) {
            return
        }

        options.set(String(rawValue), label)
    })

    return Array.from(options, ([value, label]) => ({ value, label }))
        .sort((a, b) => a.label.localeCompare(b.label))
}

function countBy(
    rows: ComplianceIssue[],
    getKey: (row: ComplianceIssue) => string
) {
    const counts = new Map<string, number>()

    rows.forEach((row) => {
        const key = getKey(row)
        counts.set(key, (counts.get(key) ?? 0) + 1)
    })

    return counts
}

function getTopCounts(
    rows: ComplianceIssue[],
    getKey: (row: ComplianceIssue) => string
): IssueChartDatum[] {
    return Array.from(countBy(rows, getKey), ([label, total]) => ({
        label,
        total,
    }))
        .sort((a, b) => b.total - a.total || a.label.localeCompare(b.label))
        .slice(0, MAX_RANKED_ITEMS)
}

function getMonthlyIssueData(rows: ComplianceIssue[]): IssueChartDatum[] {
    const monthly = new Map<string, IssueChartDatum & { sortKey: string }>()

    rows.forEach((row) => {
        const month = String(row.month).padStart(2, "0")
        const sortKey = `${row.year}-${month}`
        const label = formatDate(`${sortKey}-01`, {
            month: "short",
            year: "numeric",
        })
        const existing = monthly.get(sortKey)

        monthly.set(sortKey, {
            label,
            sortKey,
            total: (existing?.total ?? 0) + 1,
        })
    })

    return Array.from(monthly.values())
        .sort((a, b) => a.sortKey.localeCompare(b.sortKey))
        .map(({ label, total }) => ({ label, total }))
}

function mapTableRow(row: ComplianceIssue): ComplianceIssueTableRow {
    const issueTypeLabel = row.skip_reason
        ? issueTypeLabels[row.skip_reason]
        : row.reason_for_skipping ?? "Unspecified"

    return {
        ...row,
        id: row.section_id,
        assembly: row.assembly_name,
        section_label: formatLabel(row.section_skipped),
        issue_type_label: issueTypeLabel,
        description: row.skip_notes || row.reason_for_skipping || "No description supplied",
        raised_at: formatDate(row.skipped_at, {
            month: "short",
            day: "numeric",
            year: "numeric",
        }),
        action_label: formatLabel(row.follow_up_action),
        resolved_label: row.follow_up_status === RESOLVED_STATUS ? "Yes" : "No",
    }
}

function KpiCard({
    title,
    value,
    detail,
    isLoading,
    icon,
}: {
    title: string
    value: number | undefined
    detail: string
    isLoading: boolean
    icon: React.ReactNode
}) {
    return (
        <KPI className="rounded-lg bg-card">
            <KPI.Header>
                <KPI.Title className="text-sm text-muted-foreground">{title}</KPI.Title>
                <KPI.Icon>{icon}</KPI.Icon>
            </KPI.Header>
            <KPI.Content className="mt-3">
                {isLoading ? (
                    <Skeleton className="h-9 w-20" />
                ) : (
                    <KPI.Value className="text-3xl text-foreground">
                        {value === undefined ? "—" : value.toLocaleString()}
                    </KPI.Value>
                )}
            </KPI.Content>
            <KPI.Footer>{detail}</KPI.Footer>
        </KPI>
    )
}

function FilterControl({
    label,
    value,
    options,
    onChange,
}: {
    label: string
    value: string
    options: FilterOption[]
    onChange: (value: string) => void
}) {
    return (
        <label className="flex min-w-44 flex-col gap-1 text-sm">
            <span className="text-xs font-medium text-muted-foreground">{label}</span>
            <NativeSelect
                value={value}
                onChange={(event) => onChange(event.target.value)}
                className="w-full"
            >
                <NativeSelectOption value={ALL_FILTER_VALUE}>All</NativeSelectOption>
                {options.map((option) => (
                    <NativeSelectOption key={option.value} value={option.value}>
                        {option.label}
                    </NativeSelectOption>
                ))}
            </NativeSelect>
        </label>
    )
}

export function ComplianceIssuesView() {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const pagination = useDataTablePagination()
    const { data: user, isLoading: isUserLoading } = useUser()
    const activeRegion =
        user?.active_region ?? user?.assigned_regions?.[0] ?? null
    const regionId = activeRegion?.id ? String(activeRegion.id) : ""
    const year = searchParams.get("year") ?? getCurrentYear()
    const zoneId = searchParams.get("zone")
    const country = searchParams.get("country")
    const assemblyId = searchParams.get("assembly_id")
    const section = searchParams.get("section")
    const issueType = parseIssueType(searchParams.get("issue_type"))

    const query = useComplianceIssues({
        regionId,
        year,
        zoneId,
        country,
        assemblyId,
        issueType,
    })

    const serverRows = React.useMemo(
        () => query.data?.data.results ?? [],
        [query.data?.data.results]
    )

    const filteredRows = React.useMemo(() => {
        if (!section) return serverRows
        return serverRows.filter((row) => row.section_skipped === section)
    }, [section, serverRows])

    const tableRows = React.useMemo(
        () => filteredRows.map(mapTableRow),
        [filteredRows]
    )

    const totalPages = Math.max(1, Math.ceil(tableRows.length / pagination.pageSize))
    const safePage = Math.min(pagination.currentPage, totalPages)
    const pagedRows = React.useMemo(() => {
        const start = (safePage - 1) * pagination.pageSize
        return tableRows.slice(start, start + pagination.pageSize)
    }, [pagination.pageSize, safePage, tableRows])

    const countryOptions = React.useMemo(
        () => getUniqueOptions(serverRows, (row) => row.country, (row) => row.country),
        [serverRows]
    )
    const assemblyOptions = React.useMemo(
        () => getUniqueOptions(
            serverRows,
            (row) => row.assembly_id,
            (row) => row.assembly_name
        ),
        [serverRows]
    )
    const sectionOptions = React.useMemo(
        () => getUniqueOptions(
            serverRows,
            (row) => row.section_skipped,
            (row) => formatLabel(row.section_skipped)
        ),
        [serverRows]
    )
    const issueTypeOptions = React.useMemo<FilterOption[]>(
        () => ComplianceIssueTypeSchema.options.map((value) => ({
            value,
            label: issueTypeLabels[value],
        })),
        []
    )

    const distinctAssemblies = React.useMemo(
        () => new Set(filteredRows.map((row) => row.assembly_id)).size,
        [filteredRows]
    )
    const queuedIssues = React.useMemo(
        () => filteredRows.filter((row) => row.follow_up_status === QUEUED_STATUS).length,
        [filteredRows]
    )
    const resolvedIssues = React.useMemo(
        () => filteredRows.filter((row) => row.follow_up_status === RESOLVED_STATUS).length,
        [filteredRows]
    )
    const monthlyData = React.useMemo(
        () => getMonthlyIssueData(filteredRows),
        [filteredRows]
    )
    const assemblyData = React.useMemo(
        () => getTopCounts(filteredRows, (row) => row.assembly_name),
        [filteredRows]
    )
    const sectionData = React.useMemo(
        () => getTopCounts(filteredRows, (row) => formatLabel(row.section_skipped)),
        [filteredRows]
    )

    const updateFilter = React.useCallback(
        (key: string, value: string) => {
            const params = new URLSearchParams(searchParams.toString())

            if (value === ALL_FILTER_VALUE) {
                params.delete(key)
            } else {
                params.set(key, value)
            }

            params.delete("page")

            const queryString = params.toString()
            router.replace(queryString ? `${pathname}?${queryString}` : pathname, {
                scroll: false,
            })
        },
        [pathname, router, searchParams]
    )

    const clearFilters = React.useCallback(() => {
        const params = new URLSearchParams(searchParams.toString())
        params.delete("country")
        params.delete("assembly_id")
        params.delete("section")
        params.delete("issue_type")
        params.delete("page")

        const queryString = params.toString()
        router.replace(queryString ? `${pathname}?${queryString}` : pathname, {
            scroll: false,
        })
    }, [pathname, router, searchParams])

    const hasRegionScope = Boolean(regionId)
    const isLoading = isUserLoading || query.isLoading
    const hasData = Boolean(query.data)
    const hasActiveFilters = Boolean(country || assemblyId || section || issueType)

    if (!isUserLoading && !hasRegionScope) {
        return (
            <div className="rounded-lg border border-border bg-card px-6 py-12">
                <EmptyState
                    type="exceptions"
                    variant="both"
                    context={{ label: "regional issues" }}
                />
            </div>
        )
    }

    if (query.isError) {
        return (
            <div className="rounded-lg border border-border bg-card px-6 py-12">
                <div className="mx-auto max-w-lg text-center">
                    <h2 className="text-lg font-semibold text-foreground">
                        Issues could not be loaded
                    </h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                        {query.error instanceof Error
                            ? query.error.message
                            : "Failed to fetch compliance issues."}
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                <KpiCard
                    title="Assemblies"
                    value={hasData ? distinctAssemblies : undefined}
                    detail="Distinct affected assemblies"
                    isLoading={isLoading}
                    icon={<MapPinned className="size-4" />}
                />
                <KpiCard
                    title="Issues Raised"
                    value={hasData ? filteredRows.length : undefined}
                    detail="Skipped-section issues"
                    isLoading={isLoading}
                    icon={<AlertCircle className="size-4" />}
                />
                <KpiCard
                    title="Issues Queued"
                    value={hasData ? queuedIssues : undefined}
                    detail="Mapped to PENDING follow-up status"
                    isLoading={isLoading}
                    icon={<Clock3 className="size-4" />}
                />
                <KpiCard
                    title="Issues Resolved"
                    value={hasData ? resolvedIssues : undefined}
                    detail="Mapped to RESOLVED follow-up status"
                    isLoading={isLoading}
                    icon={<CheckCircle2 className="size-4" />}
                />
            </div>

            <div className="rounded-lg border border-border bg-card p-4">
                <div className="mb-4 flex flex-col gap-1">
                    <h2 className="text-base font-semibold text-foreground">Issue Filters</h2>
                    <p className="text-sm text-muted-foreground">
                        {activeRegion?.name ?? "Regional"} · {year}
                    </p>
                </div>

                <div className="flex flex-wrap items-end gap-3">
                    <FilterControl
                        label="Country"
                        value={country ?? ALL_FILTER_VALUE}
                        options={countryOptions}
                        onChange={(value) => updateFilter("country", value)}
                    />
                    <FilterControl
                        label="Assembly"
                        value={assemblyId ?? ALL_FILTER_VALUE}
                        options={assemblyOptions}
                        onChange={(value) => updateFilter("assembly_id", value)}
                    />
                    <FilterControl
                        label="Section"
                        value={section ?? ALL_FILTER_VALUE}
                        options={sectionOptions}
                        onChange={(value) => updateFilter("section", value)}
                    />
                    <FilterControl
                        label="Issue Type"
                        value={issueType ?? ALL_FILTER_VALUE}
                        options={issueTypeOptions}
                        onChange={(value) => updateFilter("issue_type", value)}
                    />
                    {hasActiveFilters ? (
                        <Button
                            type="button"
                            variant="outline"
                            onClick={clearFilters}
                        >
                            Clear
                        </Button>
                    ) : null}
                </div>
            </div>

            <div className="grid gap-4 xl:grid-cols-3">
                <IssuesBarChart
                    title="Issues Raised Per Month"
                    description="Skipped-section issue volume by report month."
                    data={monthlyData}
                />
                <IssuesBarChart
                    title="Assemblies By Issues Raised"
                    description="Top affected assemblies in the active scope."
                    data={assemblyData}
                />
                <IssuesBarChart
                    title="Sections By Issues Raised"
                    description="Skipped sections ranked by issue volume."
                    data={sectionData}
                />
            </div>

            {!isLoading && tableRows.length === 0 ? (
                <div className="rounded-lg border border-border bg-card px-6 py-12">
                    <EmptyState
                        type="exceptions"
                        variant="both"
                        context={{ label: "issues" }}
                    />
                </div>
            ) : (
                <DataTable<ComplianceIssueTableRow>
                    data={pagedRows}
                    config={issueTableSchema}
                    options={tableOptions}
                    isLoading={isLoading}
                    loadingMode="skeleton"
                    showToolbar={false}
                    showRowActions={false}
                    enableDelete={false}
                    totalRows={tableRows.length}
                    currentPage={safePage}
                    pageSize={pagination.pageSize}
                    pageSizeOptions={pagination.pageSizeOptions}
                    onPageChange={pagination.onPageChange}
                    onPageSizeChange={pagination.onPageSizeChange}
                    expandedRow={(row) => (
                        <div className="grid w-full gap-4 text-sm text-foreground md:grid-cols-2">
                            <div>
                                <p className="font-medium">Description</p>
                                <p className="mt-1 text-muted-foreground">
                                    {row.skip_notes || row.reason_for_skipping || "Not available"}
                                </p>
                            </div>
                            <div>
                                <p className="font-medium">Follow-up</p>
                                <p className="mt-1 text-muted-foreground">
                                    {row.follow_up_notes || row.follow_up_status}
                                </p>
                            </div>
                            <div>
                                <p className="font-medium">Assigned To</p>
                                <p className="mt-1 text-muted-foreground">
                                    {row.follow_up_assigned_to ?? "Not assigned"}
                                </p>
                            </div>
                            <div>
                                <p className="font-medium">Report</p>
                                <p className="mt-1 text-muted-foreground">
                                    {formatDate(row.period, {
                                        month: "long",
                                        year: "numeric",
                                    })} · {row.workflow_status}
                                </p>
                            </div>
                        </div>
                    )}
                />
            )}
        </div>
    )
}

