"use client"

import View from "@/components/ui/view"
import { usePathname, useSearchParams } from "next/navigation"
import { getPageTabs } from "@/layouts/navigation/config/get-page-tabs"
import { useReports } from "../../core/hooks/use-reports"
import { getCurrentYear } from "@/layouts/utils/get-current-year"
import { parseTab } from "@/utils/parse-tab"
import { DataTable } from "../../core/components/DataTable"

export function ReportsOverview() {
    const currentYear = getCurrentYear()
    const searchParams = useSearchParams()
    const period = searchParams.get("period") ?? currentYear
    const { main, sub: year } = parseTab(period)
    const pathname = usePathname()
    const { data: reports, isLoading } = useReports({ year: year })
    
    console.log("Reports", reports, year)


    return (
        <View className="gap-0">
            <View.Header 
                pagename="Review Queue" 
                tabs={getPageTabs("reports", {searchParams})}
                pathname={pathname}
            />

            <View.Body>
                <DataTable
                    data={reports?.data}
                    config={reports?.table_schema}
                    isLoading={isLoading}
                    loadingMode="overlay"
                    rowHeight={36}
                />
            </View.Body>
        </View>
    )
}