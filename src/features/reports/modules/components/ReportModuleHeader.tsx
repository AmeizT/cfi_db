"use client"

import type { ReactNode } from "react"
import View from "@/components/ui/view"
import { PeriodSelector } from "@/features/reports/statements/components/PeriodSelector"
import type { ReportModuleConfig } from "../types/report-modules"

type ReportModuleHeaderProps = {
    config: ReportModuleConfig
    showReportNavigator?: boolean
    title?: ReactNode
}

export function ReportModuleHeader({
    config,
    showReportNavigator,
    title,
}: ReportModuleHeaderProps) {
    return (
        <View.Header
            pagename={title ?? config.title}
            // actions={config.showPeriodSelector === false ? undefined : <PeriodSelector />}
            showReportNavigator={showReportNavigator}
        />
    )
}
