"use client"

import View from "@/components/ui/view"
import { EmptyState } from "@/components/ui/empty-state"
import { Spinner } from "@/components/ui/spinner"
import { useRegionalOverview } from "../hooks/use-regional-modules"
import { KPI } from "@/components/ui/kpi"

type RegionalOverviewViewProps = {
    regionId: string
}

function formatValue(value: unknown) {
    if (typeof value === "number") {
        return new Intl.NumberFormat().format(value)
    }

    return String(value ?? "0")
}

export function RegionalOverviewView({ regionId }: RegionalOverviewViewProps) {
    const { data, isLoading, isError, error } = useRegionalOverview(regionId)
    const summaryEntries = Object.entries(data?.summary ?? {}).slice(0, 8)
    const zoneKpis = data?.zone_kpis ?? []
    const alerts = data?.alerts ?? []

    return (
        <View className="gap-0">
            <View.Header
                pagename={data?.region?.name ?? "Regional Overview"}
                description="Regional summary, performance indicators and high-level alerts."
            />

            <View.Body className="gap-4 py-4">
                {isLoading ? (
                    <div className="flex min-h-64 items-center justify-center rounded-lg border bg-card">
                        <Spinner />
                    </div>
                ) : isError ? (
                    <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                        {error instanceof Error ? error.message : "Failed to load regional overview."}
                    </div>
                ) : summaryEntries.length ? (
                    <>
                        <div className="
                            flex w-full gap-2 overflow-x-auto
                            scroll-smooth
                            snap-x snap-mandatory
                            scrollbar-hidden
                            pr-8
                            border-0 bg-background
                        ">
                            {/* {summaryEntries.map(([key, value]) => (
                                <div key={key} className="min-h-20 border-b border-r px-4 py-3 last:border-r-0 md:nth-[4n]:border-r-0">
                                    <div className="text-xs font-medium capitalize text-muted-foreground">
                                        {key.replaceAll("_", " ")}
                                    </div>
                                    <div className="mt-2 text-2xl font-semibold tabular-nums">
                                        {formatValue(value)}
                                    </div>
                                </div>
                            ))} */}

                            {summaryEntries.map(([key, value]) => (
                                <KPI key={key} className="min-w-70 flex flex-col gap-3 shrink-0 snap-start">
                                    <KPI.Title className="capitalize font-medium text-sm text-muted-foreground">
                                        {key.replaceAll("_", " ")}
                                    </KPI.Title>
                                    <KPI.Value>
                                        {formatValue(value)}
                                    </KPI.Value>
                                </KPI>
                            ))}
                        </div>

                        {alerts.length ? (
                            <div className="border-0 grid grid-cols-1 lg:grid-cols-3 gap-2">
                                {alerts.map((alert, index) => (
                                    <div key={`${alert.type}-${index}`} className="w-full px-4 py-3 rounded-xl bg-muted">
                                        <div className="text-xl font-bold capitalize tracking-tight">
                                            {alert.type ?? "Alert"}
                                        </div>
                                        <div className="mt-1 text-sm text-muted-foreground">
                                            {alert.message}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : null}

                        <div className="rounded-none border-0 bg-card">
                            {zoneKpis.map((zone) => (
                                <div key={zone.id} className="border-b px-4 py-3 first:border-t last:border-b-0">
                                    <div className="font-semibold">{zone.name}</div>
                                    <div className="mt-2 grid grid-cols-2 gap-2 text-sm md:grid-cols-4">
                                        {Object.entries(zone.summary ?? {}).slice(0, 4).map(([key, value]) => (
                                            <div key={key}>
                                                <div className="text-xs capitalize text-muted-foreground">
                                                    {key.replaceAll("_", " ")}
                                                </div>
                                                <div className="font-medium">{formatValue(value)}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="rounded-lg border bg-card p-8">
                        <EmptyState type="reports" context={{ label: "regional overview" }} />
                    </div>
                )}
            </View.Body>
        </View>
    )
}
