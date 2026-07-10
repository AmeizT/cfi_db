"use client"

import * as React from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import type { ReadonlyURLSearchParams } from "next/navigation"
import { CalendarAnalysisIcon } from "@hugeicons/core-free-icons"
import View from "@/components/ui/view"
import { EmptyState } from "@/components/ui/empty-state"
import { Spinner } from "@/components/ui/spinner"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { DataTable } from "@/features/reports/core/components/DataTable"
import { RegionalCompliancePdfDialog } from "../components/RegionalCompliancePdfDialog"
import { RegionalMonthlyComplianceSheet } from "../components/RegionalMonthlyComplianceSheet"
import { useRegionalFilters } from "../hooks/use-regional-filters"
import { useRegionalModule } from "../hooks/use-regional-modules"
import type {
    RegionalAssemblyRow,
    RegionalModuleCountry,
    RegionalModuleKey,
    RegionalModuleResponse,
    RegionalModuleTab,
    RegionalModuleZone,
} from "../types/regional-modules"

type RegionalModulePageViewProps = {
    regionId: string
    module: RegionalModuleKey
}

const MODULE_LABELS: Record<RegionalModuleKey, string> = {
    finance: "Finance",
    compliance: "Compliance",
    risk: "Risk",
    growth: "Growth",
    ministry: "Ministry",
    leadership: "Leadership",
}

function flattenRows({
    data,
    selectedZone,
    selectedCountry,
}: {
    data: RegionalModuleResponse | undefined
    selectedZone: RegionalModuleZone | undefined
    selectedCountry: RegionalModuleCountry | undefined
}): RegionalAssemblyRow[] {
    const rows: RegionalAssemblyRow[] = []
    const zones = selectedZone ? [selectedZone] : data?.zones ?? []

    for (const zone of zones) {
        for (const country of zone.countries ?? []) {
            if (selectedCountry && country.name !== selectedCountry.name) {
                continue
            }

            for (const assembly of country.assemblies ?? []) {
                rows.push({
                    ...assembly,
                    zone: assembly.zone ?? zone.name,
                    country: assembly.country ?? country.name,
                    primary_currency: assembly.primary_currency ?? assembly.currency,
                    currency: country.currency ?? assembly.currency,
                })
            }
        }
    }

    return rows
}

function formatValue(value: unknown) {
    if (typeof value === "number") {
        return new Intl.NumberFormat().format(value)
    }

    return String(value ?? "0")
}

function validTab(value: string | null): value is RegionalModuleTab {
    return value === "reports" || value === "performance"
}

function parseYear(value: unknown) {
    const year = Number(value)

    return Number.isInteger(year) && year > 0 ? year : null
}

function getSelectedReportYear(
    searchParams: ReadonlyURLSearchParams,
    summary: Record<string, unknown> | undefined
) {
    const queryYear = parseYear(searchParams.get("year"))

    if (queryYear) {
        return queryYear
    }

    const period = searchParams.get("period")
    const periodYear = period?.startsWith("year:")
        ? parseYear(period.replace("year:", ""))
        : parseYear(period?.slice(0, 4))

    if (periodYear) {
        return periodYear
    }

    for (const key of ["year", "report_year", "selected_year"]) {
        const summaryYear = parseYear(summary?.[key])

        if (summaryYear) {
            return summaryYear
        }
    }

    return new Date().getFullYear()
}

function getRegionName(
    data: RegionalModuleResponse | undefined,
    regionId: string
) {
    const summaryRegionName = data?.summary?.region_name
    const responseRegion = (data as { region?: { name?: unknown } } | undefined)?.region

    if (typeof summaryRegionName === "string" && summaryRegionName) {
        return summaryRegionName
    }

    if (typeof responseRegion?.name === "string" && responseRegion.name) {
        return responseRegion.name
    }

    return `Region ${regionId}`
}

export function RegionalModulePageView({ regionId, module }: RegionalModulePageViewProps) {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const tabParam = searchParams.get("tab")
    const activeTab: RegionalModuleTab = validTab(tabParam) ? tabParam : "reports"
    const query = useRegionalModule(regionId, module)
    const data = query.data
    const {
        zones,
        countries,
        selectedZone,
        selectedCountry,
        setZone,
        setCountry,
    } = useRegionalFilters(data)
    const rows = React.useMemo(
        () => flattenRows({ data, selectedZone, selectedCountry }),
        [data, selectedCountry, selectedZone]
    )
    const [selectedAssemblyId, setSelectedAssemblyId] = React.useState<number | null>(null)
    const selectedAssembly = React.useMemo(
        () => rows.find((row) => row.id === selectedAssemblyId) ?? null,
        [rows, selectedAssemblyId]
    )
    const countrySummaryEntries = React.useMemo(
        () => Object.entries(selectedCountry?.summary ?? {}).slice(0, 6),
        [selectedCountry]
    )
    const label = MODULE_LABELS[module]
    const exportMetadata = React.useMemo(
        () => ({
            title: `Regional ${label} Report`,
            region: `Region ${regionId}`,
            zone: selectedZone?.name,
            country: selectedCountry?.name,
        }),
        [label, regionId, selectedCountry?.name, selectedZone?.name]
    )
    const selectedYear = React.useMemo(
        () => getSelectedReportYear(searchParams, data?.summary),
        [data?.summary, searchParams]
    )
    const regionName = React.useMemo(
        () => getRegionName(data, regionId),
        [data, regionId]
    )
    const monthlyComplianceActions = React.useCallback(
        (row: RegionalAssemblyRow) => [
            {
                label: "View monthly compliance",
                icon: CalendarAnalysisIcon,
                variant: "default" as const,
                onClick: () => setSelectedAssemblyId(row.id),
            },
        ],
        []
    )
    const handleZoneChange = React.useCallback(
        (zoneId: string) => {
            setSelectedAssemblyId(null)
            setZone(zoneId)
        },
        [setZone]
    )
    const handleCountryChange = React.useCallback(
        (country: string) => {
            setSelectedAssemblyId(null)
            setCountry(country)
        },
        [setCountry]
    )

    React.useEffect(() => {
        if (tabParam || data) return

        const next = new URLSearchParams(searchParams.toString())
        next.set("tab", "reports")
        router.replace(`${pathname}?${next.toString()}`)
    }, [data, pathname, router, searchParams, tabParam])

    const tabItems = React.useMemo(() => {
        const reportsParams = new URLSearchParams(searchParams.toString())
        reportsParams.set("tab", "reports")

        const performanceParams = new URLSearchParams(searchParams.toString())
        performanceParams.set("tab", "performance")

        return [
            {
                key: "reports",
                label: "Reports",
                href: `${pathname}?${reportsParams.toString()}`,
            },
            {
                key: "performance",
                label: "Performance",
                href: `${pathname}?${performanceParams.toString()}`,
            },
        ]
    }, [pathname, searchParams])

    return (
        <View className="gap-0">
            <View.Header
                pagename={`Regional ${label}`}
                description={`${label} module data loaded from the dedicated regional endpoint.`}
                actions={
                    <div className="flex w-[min(760px,100vw-2rem)] flex-col gap-2 sm:flex-row sm:items-center">
                        <div className="grid flex-1 grid-cols-1 gap-2 sm:grid-cols-2">
                            <Select
                                value={selectedZone ? String(selectedZone.id) : "all"}
                                disabled={query.isLoading || zones.length === 0}
                                onValueChange={handleZoneChange}
                            >
                                <SelectTrigger size="sm" aria-label="Zone">
                                    <SelectValue placeholder="Zone" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All zones</SelectItem>
                                    {zones.map((zone) => (
                                        <SelectItem key={zone.id} value={String(zone.id)}>
                                            {zone.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Select
                                value={selectedCountry?.name ?? "all"}
                                disabled={query.isLoading || countries.length === 0}
                                onValueChange={handleCountryChange}
                            >
                                <SelectTrigger size="sm" aria-label="Country">
                                    <SelectValue placeholder="Country" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All countries</SelectItem>
                                    {countries.map((country) => (
                                        <SelectItem key={country.name} value={country.name}>
                                            {country.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {module === "compliance" ? (
                            <RegionalCompliancePdfDialog
                                regionId={regionId}
                                regionName={regionName}
                                selectedZone={selectedZone}
                                selectedCountryName={selectedCountry?.name}
                                assemblyCount={rows.length}
                                selectedYear={selectedYear}
                                disabled={query.isLoading || query.isError}
                            />
                        ) : null}
                    </div>
                }
            />

            <View.TabBar
                items={tabItems}
                activeKey={activeTab}
            />

            <View.Body className="gap-4 py-4">
                {activeTab === "performance" ? (
                    <div className="">
                        <EmptyState
                            type="analyticsChart"
                            variant="heading"
                            context={{ label: `${label.toLowerCase()} performance` }}
                        />
                        {/* <p className="mt-3 text-center text-sm text-muted-foreground">
                            Performance comparison will be added later.
                        </p> */}
                    </div>
                ) : query.isLoading ? (
                    <div className="flex min-h-64 items-center justify-center rounded-lg border bg-white">
                        <Spinner />
                    </div>
                ) : query.isError ? (
                    <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                        {query.error instanceof Error ? query.error.message : `Failed to load regional ${label.toLowerCase()}.`}
                    </div>
                ) : !data?.table_schema ? (
                    <div className="rounded-lg border bg-white p-8">
                        <EmptyState
                            type="reports"
                            context={{ label: `${label.toLowerCase()} table schema` }}
                        />
                    </div>
                ) : (
                    <>
                        {countrySummaryEntries.length ? (
                            <div className="grid overflow-hidden rounded-lg border bg-white sm:grid-cols-2 lg:grid-cols-3">
                                {countrySummaryEntries.map(([key, value]) => (
                                    <div
                                        key={key}
                                        className="min-h-18 border-b border-r px-4 py-3 last:border-r-0 lg:nth-[3n]:border-r-0"
                                    >
                                        <div className="text-xs font-medium capitalize text-muted-foreground">
                                            {key.replaceAll("_", " ")}
                                        </div>
                                        <div className="mt-1 text-xl font-semibold tabular-nums">
                                            {formatValue(value)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : null}

                        {!rows.length ? (
                            <div className="rounded-lg border bg-white p-8">
                                <EmptyState
                                    type="reports"
                                    context={{
                                        label: selectedCountry
                                            ? `${selectedCountry.name} ${label.toLowerCase()} rows`
                                            : `${label.toLowerCase()} rows`,
                                    }}
                                />
                            </div>
                        ) : (
                            <DataTable
                                data={rows}
                                config={data.table_schema}
                                isLoading={query.isLoading}
                                loadingMode="skeleton"
                                enableDelete={false}
                                enableExport={module !== "compliance"}
                                exportFormat="pdf"
                                exportMetadata={exportMetadata}
                                showRowActions={module === "compliance"}
                                showDefaultRowActions={false}
                                rowActions={module === "compliance" ? monthlyComplianceActions : undefined}
                                exportFilename={`regional-${module}`}
                                resource="reports"
                            />
                        )}
                    </>
                )}
            </View.Body>

            {module === "compliance" ? (
                <RegionalMonthlyComplianceSheet
                    assembly={selectedAssembly}
                    isLoading={query.isLoading}
                    open={Boolean(selectedAssembly)}
                    selectedYear={selectedYear}
                    onOpenChange={(open) => {
                        if (!open) {
                            setSelectedAssemblyId(null)
                        }
                    }}
                />
            ) : null}
        </View>
    )
}
