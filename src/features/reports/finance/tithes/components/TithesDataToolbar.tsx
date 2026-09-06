"use client"

import {
    ReportCumulativeToolbar,
    ReportDataToolbarControls,
    ReportSummarizeAction,
} from "@/features/reports/core/components/ReportDataToolbar"

const tithesScope = {
    section: "finance",
    module: "tithes",
    pageContext: "workspace",
    monthlySubmodule: null,
    label: "Tithes",
} as const

export function TithesToolbarControls({
    activeView = "monthly",
    showSearch = true,
}: {
    activeView?: "monthly" | "cumulative"
    showSearch?: boolean
}) {
    return (
        <ReportDataToolbarControls
            {...tithesScope}
            activeView={activeView}
            showSearch={showSearch}
        />
    )
}

export function TithesSummarizeAction() {
    return <ReportSummarizeAction label="Tithes" />
}

export function TithesCumulativeToolbar() {
    return <ReportCumulativeToolbar {...tithesScope} />
}
