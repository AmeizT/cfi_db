"use client"

import { usePathname } from "next/navigation"
import View from "@/components/ui/view"
import { PeriodSelector } from "@/features/reports/statements/components/PeriodSelector"
import { EmptyState } from "@/components/ui/empty-state"
import { useUser } from "@/hooks/query/use-user"
import { getModulePageConfig } from "../config/module-registry"
import type { ModuleRoute } from "../types"

export function ModulePageView(route: ModuleRoute) {
    const pathname = usePathname()
    const userQuery = useUser()
    const config = getModulePageConfig(route)

    if (!config) return null

    if (config.permissions?.length && userQuery.isLoading) {
        return config.loadingState ?? <div className="p-6 text-sm text-muted-foreground">Loading page…</div>
    }

    if (config.permissions?.length && userQuery.isError) {
        return config.errorState ?? <div className="p-6 text-sm text-destructive">Unable to verify page access.</div>
    }

    const userPermissions = userQuery.data as unknown as Record<string, unknown> | undefined
    const hasPermission = !config.permissions?.length || config.permissions.some(
        (permission) => Boolean(userPermissions?.[permission]),
    )

    if (!hasPermission) {
        return config.emptyState ?? <EmptyState type="reports" variant="both" context={{ label: "this page" }} />
    }

    const Content = config.content
    const activeTab = config.tabs?.find((tab) => {
        const tabPath = new URL(tab.href, "http://localhost").pathname
        return tabPath === pathname
    })?.key

    return (
        <View className="gap-0">
            <View.Header
                pagename={config.title}
                actions={config.showPeriodSelector ? <PeriodSelector /> : config.actions}
                showReportNavigator={config.showReportNavigator}
            />

            {config.tabs?.length ? (
                <View.TabBar items={[...config.tabs]} activeKey={activeTab} />
            ) : null}

            <View.Body className="gap-4 py-4">
                <Content />
            </View.Body>
        </View>
    )
}
