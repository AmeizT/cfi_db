"use client"

import type { Table } from "@tanstack/react-table"
import { DataTableToolbar as BaseDataTableToolbar } from "@/components/ui/data-table/DataTableToolbar"

type DataTableToolbarProps<T> = {
    table: Table<T>
    showColumnVisibility?: boolean
    showExport?: boolean
    showFilters?: boolean
    exportFilename?: string
}

export function DataTableToolbar<T>({
    table,
    showColumnVisibility,
    showExport,
    showFilters,
    exportFilename,
}: DataTableToolbarProps<T>) {
    return (
        <BaseDataTableToolbar
            table={table}
            showColumnVisibility={showColumnVisibility}
            showExport={showExport}
            showFilters={showFilters}
            exportFilename={exportFilename}
        />
    )
}
