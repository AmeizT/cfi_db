"use client"

import * as React from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import View from "@/components/ui/view"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { EmptyState } from "@/components/ui/empty-state"
import { DataTable } from "@/features/reports/core/components/DataTable"
import { getCurrentYear } from "@/layouts/utils/get-current-year"
import { cn } from "@/lib/utils"
import { useRegionalDashboard } from "../hooks/use-regional-dashboard"
import type {
    RegionalDashboardCountry,
    RegionalDashboardRow,
    RegionalDashboardTab,
} from "../types/regional-dashboard"

const TABS: Array<{ key: RegionalDashboardTab; label: string }> = [
    { key: "finance", label: "Finance" },
    { key: "growth", label: "Growth" },
    { key: "ministry", label: "Ministry" },
    { key: "leadership", label: "Leadership" },
    { key: "compliance", label: "Compliance" },
    { key: "risk", label: "Risk" },
]

type RegionalDashboardViewProps = {
    regionId: string
}

function isRegionalTab(value: string | null): value is RegionalDashboardTab {
    return TABS.some((tab) => tab.key === value)
}

function formatNumber(value: number | undefined) {
    return new Intl.NumberFormat().format(value ?? 0)
}

function buildRows(
    country: RegionalDashboardCountry | undefined,
    zoneName: string,
    tab: RegionalDashboardTab
): RegionalDashboardRow[] {
    if (!country) return []

    return country.assemblies.map((assembly) => {
        const base = {
            id: assembly.id,
            zone: zoneName,
            country: country.name,
            assembly: assembly.name,
            reports: assembly.reports,
        }

        if (tab === "risk") {
            return {
                ...base,
                score: assembly.risk.score,
                level: assembly.risk.level,
            }
        }

        if (tab === "compliance") {
            return {
                ...base,
                total_sections: assembly.compliance.total_sections,
                submitted: assembly.compliance.submitted,
                skipped: assembly.compliance.skipped,
                pending: assembly.compliance.pending,
                progress: assembly.compliance.progress / 100,
                coverage: assembly.compliance.coverage / 100,
                status: assembly.compliance.status,
            }
        }

        if (tab === "growth") {
            return {
                ...base,
                total_members: assembly.metrics.growth.total_members ?? 0,
                new_members: assembly.metrics.growth.new_members ?? 0,
                growth_rate: (assembly.metrics.growth.growth_rate ?? 0) / 100,
                status: assembly.metrics.growth.status,
            }
        }

        if (tab === "ministry") {
            return {
                ...base,
                outreaches: assembly.metrics.ministry.outreaches ?? 0,
                actual_outreaches: assembly.metrics.ministry.actual_outreaches ?? 0,
                homecells_planted: assembly.metrics.ministry.homecells_planted ?? 0,
                homecell_attendance: assembly.metrics.ministry.homecell_attendance ?? 0,
                status: assembly.metrics.ministry.status,
            }
        }

        if (tab === "leadership") {
            return {
                ...base,
                leaders_count: assembly.metrics.leadership.leaders_count ?? 0,
                meetings_conducted: assembly.metrics.leadership.meetings_conducted ?? 0,
                assets_valuation: assembly.metrics.leadership.assets_valuation ?? 0,
            }
        }

        return {
            ...base,
            ...assembly.metrics.finance,
        }
    })
}

export function RegionalDashboardView({ regionId }: RegionalDashboardViewProps) {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const year = searchParams.get("year") ?? getCurrentYear()
    const tabParam = searchParams.get("tab")
    const activeTab: RegionalDashboardTab = isRegionalTab(tabParam)
        ? tabParam
        : "finance"

    const { data: dashboard, isLoading } = useRegionalDashboard({
        regionId,
        year,
    })

    const zones = dashboard?.data.zones ?? []
    const selectedZoneId = searchParams.get("zone")
    const selectedZone = zones.find((zone) => String(zone.id) === selectedZoneId) ?? zones[0]
    const countries = selectedZone?.countries ?? []
    const selectedCountryName = searchParams.get("country")
    const selectedCountry =
        countries.find((country) => country.name === selectedCountryName) ??
        countries[0]

    const rows = React.useMemo(
        () => buildRows(selectedCountry, selectedZone?.name ?? "", activeTab),
        [activeTab, selectedCountry, selectedZone?.name]
    )

    const schema = dashboard?.table_schema?.[activeTab]
    const summary = dashboard?.data.summary

    function updateParams(updates: Record<string, string | null>) {
        const params = new URLSearchParams(searchParams.toString())

        for (const [key, value] of Object.entries(updates)) {
            if (value === null) {
                params.delete(key)
            } else {
                params.set(key, value)
            }
        }

        router.replace(`${pathname}?${params.toString()}`)
    }

    const tabItems = TABS.map((tab) => {
        const params = new URLSearchParams(searchParams.toString())
        params.set("tab", tab.key)

        return {
            key: tab.key,
            label: tab.label,
            href: `${pathname}?${params.toString()}`,
        }
    })

    return (
        <View className="gap-0">
            <View.Header
                pagename={dashboard?.data.region.name ?? "Regional Dashboard"}
                actions={
                    <div className="grid w-[min(760px,100vw-2rem)] grid-cols-1 gap-2 sm:grid-cols-3">
                        <Select
                            value={selectedZone ? String(selectedZone.id) : undefined}
                            disabled={!zones.length}
                            onValueChange={(value) => {
                                const nextZone = zones.find((zone) => String(zone.id) === value)
                                updateParams({
                                    zone: value,
                                    country: nextZone?.countries[0]?.name ?? null,
                                })
                            }}
                        >
                            <SelectTrigger size="sm" aria-label="Zone">
                                <SelectValue placeholder="Zone" />
                            </SelectTrigger>
                            <SelectContent>
                                {zones.map((zone) => (
                                    <SelectItem key={zone.id} value={String(zone.id)}>
                                        {zone.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select
                            value={selectedCountry?.name}
                            disabled={!countries.length}
                            onValueChange={(value) => updateParams({ country: value })}
                        >
                            <SelectTrigger size="sm" aria-label="Country">
                                <SelectValue placeholder="Country" />
                            </SelectTrigger>
                            <SelectContent>
                                {countries.map((country) => (
                                    <SelectItem key={country.name} value={country.name}>
                                        {country.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <input
                            aria-label="Year"
                            className="h-8 rounded-[10px] border border-input bg-background px-3 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                            inputMode="numeric"
                            min={2000}
                            max={2100}
                            type="number"
                            value={year}
                            onChange={(event) => updateParams({ year: event.target.value })}
                        />
                    </div>
                }
            />

            <View.Body className="gap-4 py-4">
                <div className="grid grid-cols-2 overflow-hidden rounded-lg border bg-card md:grid-cols-4 xl:grid-cols-6">
                    {[
                        { label: "Zones", value: summary?.zones },
                        { label: "Countries", value: summary?.countries },
                        { label: "Assemblies", value: summary?.assemblies },
                        { label: "Reports", value: summary?.reports_submitted },
                        { label: "Members", value: summary?.total_members },
                        { label: "Outreaches", value: summary?.total_actual_outreaches },
                    ].map(({ label, value }, index) => (
                        <div
                            key={label}
                            className={cn(
                                "min-h-20 border-b border-r px-4 py-3 last:border-r-0 md:[&:nth-child(4n)]:border-r-0 xl:border-b-0 xl:[&:nth-child(4n)]:border-r xl:[&:nth-child(6n)]:border-r-0",
                                index >= 4 && "md:border-b-0"
                            )}
                        >
                            <div className="text-xs font-medium text-muted-foreground">{label}</div>
                            <div className="mt-2 text-2xl font-semibold tabular-nums">
                                {formatNumber(Number(value ?? 0))}
                            </div>
                        </div>
                    ))}
                </div>

                <View.TabBar
                    items={tabItems}
                    activeKey={activeTab}
                    className="rounded-lg border bg-card py-2"
                />

                {rows.length || isLoading ? (
                    <DataTable
                        data={rows}
                        config={schema}
                        isLoading={isLoading}
                        loadingMode="skeleton"
                        enableDelete={false}
                        enableExport
                        exportFormat="pdf"
                        exportMetadata={{
                            title: `Regional ${activeTab} Report`,
                            region: dashboard?.data.region.name,
                            zone: selectedZone?.name,
                            country: selectedCountry?.name,
                        }}
                        showRowActions={false}
                        exportFilename={`regional-${activeTab}-${year}`}
                        resource="reports"
                    />
                ) : (
                    <div className="rounded-lg border bg-card p-8">
                        <EmptyState
                            type="reports"
                            context={{ label: `${activeTab} rows` }}
                        />
                    </div>
                )}
            </View.Body>
        </View>
    )
}
