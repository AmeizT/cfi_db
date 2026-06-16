import type { apiRoutes } from "@/config/urls"
import type { TableSchema } from "@/features/data-table/types/tableSchema.types"
import type * as React from "react"

export type DataTableResource = keyof typeof apiRoutes

export type DataTableStyles = {
    containerClass?: string
    rowClass?: string
    cellPadding?: string
    cellClass?: string
} | null

export type DataGridProps<T> = {
    data: T[]
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
    pinning?: boolean
    showToolbar?: boolean
    showColumnVisibility?: boolean
    showExport?: boolean
    showFilters?: boolean
    exportFilename?: string
    resource: DataTableResource
}

export type DataTableRowFlags = {
    is_section?: boolean
    is_total?: boolean
    is_deleted?: boolean
}
