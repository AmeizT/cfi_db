"use client"

import { usePathname, useSearchParams } from "next/navigation"
import View from "@/components/ui/view"
import { getPageTabs } from "@/layouts/navigation/config/get-page-tabs"
import { useAuditLogs } from "../hooks/use-audit-logs"
import { AuditLogPage } from "../components"

export function AuditLogsView() {
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const { data: auditLogs, isLoading } = useAuditLogs()

    return (
        <View className="gap-0">
            <View.Header 
                pathname={pathname}
                pagename="History" 
                tabs={getPageTabs("reports", { searchParams })}
            />
            <View.Body>
                <AuditLogPage
                    logs={auditLogs?.map((log) => ({ ...log, user_name: log.user_email })) ?? []}
                    isLoading={isLoading}
                />
            </View.Body>
        </View>
    )
}
