"use client"

import View from "@/components/ui/view"

type ReportModuleTabsProps = {
    activeView: string
    tabs: {
        label: string
        key: string
        href: string
    }[]
    showReportNavigator?: boolean
}

export function ReportModuleTabs({
    activeView,
    showReportNavigator,
    tabs,
}: ReportModuleTabsProps) {
    if (!tabs.length) {
        return null
    }

    return (
        <View.TabBar
            variant="report"
            items={tabs}
            activeKey={activeView}
            showReportNavigator={showReportNavigator}
            className=""
        />
    )
}
