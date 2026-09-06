"use client"

import type { Table } from "@tanstack/react-table"
import { DataTableToolbar as BaseDataTableToolbar } from "@/components/ui/data-table/DataTableToolbar"
import type { DataTableDensity } from "@/components/ui/data-table/DataTableToolbar"
import type { ReactNode } from "react"
import type {
    DataTableExportContext,
    DataTableExportFormat,
    DataTableExportMetadata,
} from "./DataTable.types"

type DataTableToolbarProps<T> = {
    table: Table<T>
    showColumnVisibility?: boolean
    showExport?: boolean
    showFilters?: boolean
    enableDelete?: boolean
    exportFormat?: DataTableExportFormat
    exportMetadata?: DataTableExportMetadata
    onExport?: (context: DataTableExportContext<T>) => void | Promise<void>
    exportFilename?: string
    leading?: ReactNode
    supplementalActions?: ReactNode
    density?: DataTableDensity
    onDensityChange?: (density: DataTableDensity) => void
    onResetView?: () => void
    onDeleteAll?: () => void | Promise<void>
}

export function DataTableToolbar<T>({
    table,
    showColumnVisibility,
    showExport,
    showFilters,
    enableDelete,
    exportFormat,
    exportMetadata,
    onExport,
    exportFilename,
    leading,
    supplementalActions,
    density,
    onDensityChange,
    onResetView,
    onDeleteAll,
}: DataTableToolbarProps<T>) {
    return (
        <BaseDataTableToolbar
            table={table}
            showColumnVisibility={showColumnVisibility}
            showExport={showExport}
            showFilters={showFilters}
            enableDelete={enableDelete}
            exportFormat={exportFormat}
            exportMetadata={exportMetadata}
            onExport={onExport}
            exportFilename={exportFilename}
            leading={leading}
            supplementalActions={supplementalActions}
            density={density}
            onDensityChange={onDensityChange}
            onResetView={onResetView}
            onDeleteAll={onDeleteAll}
        />
    )
}
