"use client"

import { usePathname, useSearchParams } from "next/navigation"
import View from "@/components/ui/view"
import { getReportsActivityTabs } from "../config/activity.tabs"

export function ReportActivityNavigation() {
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const tabs = getReportsActivityTabs(searchParams)
    const activeKey = tabs.find((tab) => new URL(tab.href, "http://localhost").pathname === pathname)?.key

    return <View.TabBar items={tabs} activeKey={activeKey} />
}
