import type { ApiDetailRouteKey } from "@/config/urls"
import type { DataTableAction as BaseDataTableAction } from "@/components/ui/data-table/DataTableDropdownMenu"
import type { TableSchema } from "@/features/data-table/types/tableSchema.types"
import type { Table as TanStackTable } from "@tanstack/react-table"
import type * as React from "react"

export type DataTableResource = ApiDetailRouteKey
export type DataTableAction = BaseDataTableAction

export type DataTableStyles = {
    containerClass?: string
    rowClass?: string
    cellPadding?: string
    cellClass?: string
} | null

export type DataTableExportFormat = "csv" | "pdf"

export type DataTableExportMetadata = {
    title?: string
    region?: string
    zone?: string
    country?: string
    generatedBy?: string
    generatedAt?: Date
    filters?: Record<string, string>
    [key: string]: unknown
}

export type DataTableExportContext<T> = {
    table: TanStackTable<T>
    filename: string
    metadata: DataTableExportMetadata
}

export type DataTablePaginationProps = {
    totalRows?: number
    currentPage?: number
    pageSize?: number
    pageSizeOptions?: number[]
    onPageChange?: (page: number) => void
    onPageSizeChange?: (size: number) => void
}

export type DataTableOptions = {
    enablePinning?: boolean
    pagination?: boolean
    selectable?: boolean
}

export const DEFAULT_DATA_TABLE_OPTIONS: Required<DataTableOptions> = {
    enablePinning: false,
    pagination: true,
    selectable: false,
}

export type DataGridProps<T> = {
    data?: T[]
    rows?: T[]
    config?: TableSchema
    rowHeight?: number
    onCellEdit?: (rowIndex: number, columnId: keyof T, value: T[keyof T]) => void
    onDeleteRows?: (ids: string[] | number[]) => void
    footerData?: Record<string, number>
    onRowClick?: (row: T) => void
    isLoading?: boolean
    emptyState?: React.ReactNode
    loadingMode?: "skeleton" | "overlay"
    expandedRow?: (row: T) => React.ReactNode
    options?: DataTableOptions
    showToolbar?: boolean
    showColumnVisibility?: boolean
    showExport?: boolean
    showFilters?: boolean
    showRowActions?: boolean
    showDefaultRowActions?: boolean
    rowActions?: (row: T) => DataTableAction[]
    enableDelete?: boolean
    enableExport?: boolean
    exportFormat?: DataTableExportFormat
    exportMetadata?: DataTableExportMetadata
    onExport?: (context: DataTableExportContext<T>) => void | Promise<void>
    exportFilename?: string
    resource?: DataTableResource
} & DataTablePaginationProps

export type DataTableRowFlags = {
    is_section?: boolean
    is_total?: boolean
    is_deleted?: boolean
    tone?: "income" | "expense" | "neutral"
}
