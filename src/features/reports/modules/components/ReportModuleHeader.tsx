"use client"

import type { ReactNode } from "react"
import View from "@/components/ui/view"
import { PeriodSelector } from "@/features/reports/statements/components/PeriodSelector"
import type { ReportModuleConfig } from "../types/report-modules"

type ReportModuleHeaderProps = {
    activeModule: string
    config: ReportModuleConfig
    title?: ReactNode
    pathname: string
    tabs: {
        label: string
        key: string
        href: string
    }[]
}

export function ReportModuleHeader({
    activeModule,
    config,
    title,
    pathname,
}: ReportModuleHeaderProps) {
    return (
        <View.Header
            pagename={title ?? config.title}
            actions={<PeriodSelector />}
            pathname={pathname}
            activeTab={activeModule}
        />
    )
}
