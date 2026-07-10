"use client"

import React from "react"
import {
    kpiMetrics,
    assemblies,
    deadlines,
    activityFeed,
    fieldBreakdown,
    trendData,
    heatmapAssemblies,
} from "../components/compliance-data"
import { KpiBar } from "../components/KpiBar"
import { FieldBreakdownChart, TrendChart } from "../components/Charts"
import { AssemblyLeaderboard } from "../components/AssemblyLeaderboard"
import { ComplianceTable } from "../components/ComplianceTable"
import { HeatmapRow, SubmissionHeatmap } from "../components/SubmissionHeatmap"
import { DeadlinesPanel } from "../components/DeadlinesPanel"
import { ReminderForm } from "../components/ReminderForm"
import { ActivityFeed } from "../components/ActivityFeed"
import { Church } from "@/dal/types"

export function RegionComplianceView() {
    const [selected, setSelected] = React.useState<Church | null>(null)

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
                    <div>
                        <h1 className="text-xl font-medium text-gray-900">Compliance dashboard</h1>
                        <p className="text-sm text-gray-400 mt-1">All assemblies · April 2026</p>
                    </div>
                    <div className="flex gap-2">
                        <button className="text-sm px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-white transition-colors">
                            Export report
                        </button>
                        <button className="text-sm px-4 py-2 rounded-lg bg-theme-600 text-theme-foreground hover:bg-theme-700 transition-colors font-medium">
                            Send reminders
                        </button>
                    </div>
                </div>

                {/* KPI bar */}
                <p className="text-[11px] font-medium text-gray-400 uppercase tracking-widest mb-3">Overview</p>
                <KpiBar metrics={kpiMetrics} />

                {/* Charts row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
                    <TrendChart data={trendData} />
                    <FieldBreakdownChart fields={fieldBreakdown} />
                </div>

                {/* <AssemblyLeaderboard
                    assemblies={assemblies}
                    onSelect={(a) => setSelected(selected?.id === a.id ? null : a)}
                /> */}

                {/* Assembly drilldown — shown when an assembly is selected */}
                {selected && (
                    <div className="mb-6">
                        <div className="flex items-center justify-between mb-3">
                            <p className="text-[11px] font-medium text-gray-400 uppercase tracking-widest">Assembly detail</p>
                            <button
                                onClick={() => setSelected(null)}
                                className="text-xs text-gray-400 hover:text-gray-600"
                            >
                                ✕ Close
                            </button>
                        </div>
                        <ComplianceTable assembly={selected} />
                    </div>
                )}

                <SubmissionHeatmap rows={heatmapAssemblies as unknown as HeatmapRow[]} />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
                    <DeadlinesPanel deadlines={deadlines} />
                    <ReminderForm assemblies={assemblies} />
                </div>

                {/* <ActivityFeed items={activityFeed} /> */}
            </div>
        </div>
    )
}
