"use client"

import { usePathname, useSearchParams } from "next/navigation"
import View from "@/components/ui/view"
import { useUser } from "@/hooks/query/use-user"
import AssemblyComplianceView from "../../assembly/views/AssemblyComplianceView"
import { RegionComplianceView } from "../../region/views/RegionComplianceView"
import { getReportTabs } from "@/layouts/navigation/pages/reports.tabs";
import { getPageTabs } from "@/layouts/navigation/config/get-page-tabs"
import { ComplianceIssuesView } from "../../issues/views/ComplianceIssuesView"
import { EmptyState } from "@/components/ui/empty-state"

export function ComplianceStatusView() {
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const { data: user } = useUser()
    const isStaff = user?.is_db_staff || user?.is_region_staff
    const activeTab = searchParams.get("tab") ?? "status"
    const reportTabs = getReportTabs(searchParams)
    const complianceTabs = getPageTabs("compliance", { searchParams })

    return (
        <View className="gap-0">
            <View.Header
                pathname={pathname}
                pagename="Compliance"
                tabs={reportTabs}
            />
            <View.Body>
                <View.TabBar
                    items={complianceTabs}
                    activeKey={activeTab}
                    className="mb-6"
                />

                {activeTab === "issues" ? (
                    <ComplianceIssuesView />
                ) : activeTab === "audit-logs" ? (
                    <div className="rounded-lg border border-border bg-card px-6 py-12">
                        <EmptyState
                            type="exceptions"
                            variant="both"
                            context={{ label: "audit logs" }}
                        />
                    </div>
                ) : isStaff ? (
                    <RegionComplianceView />
                ) : (
                    <AssemblyComplianceView />
                )}
            </View.Body>
        </View>
    )
}
