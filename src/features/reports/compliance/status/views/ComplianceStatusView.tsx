"use client"

import { usePathname } from "next/navigation"
import View from "@/components/ui/view"
import { useUser } from "@/hooks/query/use-user"
import AssemblyComplianceView from "../../assembly/views/AssemblyComplianceView"
import { RegionComplianceView } from "../../region/views/RegionComplianceView"
import { getReportTabs } from "@/layouts/navigation/pages/reports.tabs";

export function ComplianceStatusView() {
    const pathname = usePathname()
    const { data: user } = useUser()
    const isStaff = user?.is_db_staff
    const reportTabs = getReportTabs()

    return (
        <View className="gap-0">
            <View.Header
                pathname={pathname}
                pagename="Compliance"
                tabs={reportTabs}
            />
            <View.Body>
                {isStaff ? (
                    <RegionComplianceView />
                ) : (
                    <AssemblyComplianceView />
                )}
            </View.Body>
        </View>
    )
}
