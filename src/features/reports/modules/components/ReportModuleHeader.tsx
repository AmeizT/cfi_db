"use client"

import type { ReactNode } from "react"
import View from "@/components/ui/view"
import type { ReportModuleConfig } from "../types/report-modules"

type ReportModuleHeaderProps = {
    config: ReportModuleConfig
    actions?: ReactNode
    showReportNavigator?: boolean
    title?: ReactNode
}

export function ReportModuleHeader({
    actions,
    config,
    showReportNavigator,
    title,
}: ReportModuleHeaderProps) {
    return (
        <View.Header
            pagename={title ?? config.title}
            actions={actions}
            showReportNavigator={showReportNavigator}
        />
    )
}
