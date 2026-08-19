"use client"

import View from "@/components/ui/view"

type ReportModuleTabsProps = {
    activeView: string
    tabs: {
        label: string
        key: string
        href: string
    }[]
}

export function ReportModuleTabs({
    activeView,
    tabs,
}: ReportModuleTabsProps) {
    if (!tabs.length) {
        return null
    }

    return (
        <View.Tabs
            items={tabs}
            activeKey={activeView}
        />
    )
}
