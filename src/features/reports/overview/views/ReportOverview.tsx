"use client"

import View from "@/components/ui/view"
import { usePathname, useSearchParams } from "next/navigation"
import { getPageTabs } from "@/layouts/navigation/config/get-page-tabs"
import { useReports } from "../../core/hooks/use-reports"
import { getCurrentYear } from "@/layouts/utils/get-current-year"
import { parseTab } from "@/utils/parse-tab"
import { DataTable } from "../../core/components/DataTable"
import { useDataTablePagination } from "../../core/components/hooks/useDataTablePagination"

export function ReportsOverview() {
    const currentYear = getCurrentYear()
    const searchParams = useSearchParams()
    const period = searchParams.get("period") ?? currentYear
    const { main, sub: year } = parseTab(period)
    const pathname = usePathname()
    const pagination = useDataTablePagination()
    const { data: reports, isLoading } = useReports({
        year,
        page: pagination.currentPage,
        pageSize: pagination.pageSize,
    })
    const rows = reports?.results ?? reports?.data ?? []
    const totalRows = reports?.count ?? rows.length
    const tableOptions = {
        selectable: true,
    }
    
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
                    data={rows}
                    config={reports?.table_schema}
                    options={tableOptions}
                    isLoading={isLoading}
                    loadingMode="overlay"
                    rowHeight={36}
                    totalRows={totalRows}
                    currentPage={pagination.currentPage}
                    pageSize={pagination.pageSize}
                    pageSizeOptions={pagination.pageSizeOptions}
                    onPageChange={pagination.onPageChange}
                    onPageSizeChange={pagination.onPageSizeChange}
                />
            </View.Body>
        </View>
    )
}
