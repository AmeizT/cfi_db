"use client"

import { useSearchParams } from "next/navigation"
import { useReports } from "../../core/hooks/use-reports"
import { getCurrentYear } from "@/layouts/utils/get-current-year"
import { parseTab } from "@/utils/parse-tab"
import { DataTable } from "../../core/components/DataTable"
import { useDataTablePagination } from "../../core/components/hooks/useDataTablePagination"

export function ReportsOverview() {
    const currentYear = getCurrentYear()
    const searchParams = useSearchParams()
    const period = searchParams.get("period") ?? currentYear
    const { sub: year } = parseTab(period)
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
    
    return (
        <div>
            <DataTable
                variant="advanced"
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
        </div>
    )
}
