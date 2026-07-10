"use client"

import type { TableSchema } from "@/features/data-table/types/tableSchema.types"
import { DataTable } from "@/features/reports/core/components/DataTable"
import type { DataTablePaginationProps } from "@/features/reports/core/components/DataTable.types"
import type { TitheRecord } from "../types"
import { EmptyState } from "./EmptyState"

export function ReceiptsView({
    rows,
    isLoading,
    config,
    totalRows,
    pagination,
}: {
    rows: TitheRecord[]
    isLoading: boolean
    config?: TableSchema
    totalRows?: number
    pagination?: DataTablePaginationProps
}) {
    if (isLoading) {
        return <EmptyState>Loading tithe receipts...</EmptyState>
    }

    if (rows.length === 0) {
        return <EmptyState>No tithe receipts were found for this period.</EmptyState>
    }

    return (
        <DataTable
            data={rows}
            config={config}
            enableDelete={false}
            totalRows={totalRows ?? rows.length}
            currentPage={pagination?.currentPage}
            pageSize={pagination?.pageSize}
            pageSizeOptions={pagination?.pageSizeOptions}
            onPageChange={pagination?.onPageChange}
            onPageSizeChange={pagination?.onPageSizeChange}
            showDefaultRowActions={false}
            showFilters={false}
            showRowActions={false}
            showToolbar={false}
        />
    )
}
