"use client"

import type { TableSchema } from "@/features/data-table/types/tableSchema.types"
import { DataTable } from "@/features/reports/core/components/DataTable"
import type { DataTablePaginationProps } from "@/features/reports/core/components/DataTable.types"
import type { AuditLogRecord } from "../types"
import { EmptyState } from "./EmptyState"

export function AuditView({
    rows,
    isLoading,
    config,
    totalRows,
    pagination,
}: {
    rows: AuditLogRecord[]
    isLoading: boolean
    config?: TableSchema
    totalRows?: number
    pagination?: DataTablePaginationProps
}) {
    if (isLoading) {
        return <EmptyState>Loading tithe audit activity...</EmptyState>
    }

    if (rows.length === 0) {
        return <EmptyState>No audit activity was found for the selected filters.</EmptyState>
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
