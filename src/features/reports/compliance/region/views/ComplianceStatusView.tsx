"use client"

import { usePathname } from "next/navigation"
import View from "@/components/ui/view"
import { getPageTabs } from "@/layouts/navigation/config/get-page-tabs"

import { useState } from "react";
import {
    kpiMetrics,
    assemblies,
    deadlines,
    activityFeed,
    fieldBreakdown,
    trendData,
    heatmapAssemblies,
} from "../components/compliance-data"
import { Assembly } from "@/dal/types/index.schemas"
import { KpiBar } from "../components/KpiBar"
import { FieldBreakdownChart, TrendChart } from "../components/Charts"
import { AssemblyLeaderboard } from "../components/AssemblyLeaderboard"
import { ComplianceTable } from "../components/ComplianceTable"
import { HeatmapRow, SubmissionHeatmap } from "../components/SubmissionHeatmap"
import { DeadlinesPanel } from "../components/DeadlinesPanel"
import { ReminderForm } from "../components/ReminderForm"
import { ActivityFeed } from "../components/ActivityFeed"
import { useUser } from "@/hooks/query/use-user";
import React from "react";
import AssemblyComplianceView from "../../assembly/views/AssemblyComplianceView";

export function ComplianceStatusView() {
    const pathname = usePathname()
    const [selected, setSelected] = useState<Assembly | null>(null)
    const { data: user } = useUser()
    const isStaff = user?.is_db_staff

    return (
        <React.Fragment>
            {isStaff ? (
                <View className="gap-0">
                    <View.Header
                        pathname={pathname}
                        pagename="Compliance Status"
                        tabs={getPageTabs("compliance")}
                    />
                    <View.Body>
                        
                    </View.Body>
                </View>
            ) : (
                <AssemblyComplianceView />
            )}
        </React.Fragment>

        
    )
}
