"use client"

import { flexRender, type Cell, type Row } from "@tanstack/react-table"
import { EditableCell } from "@/components/ui/editable-cell"
import { TableCell as BaseTableCell } from "@/components/ui/table"
import { getPinningStyles } from "@/components/ui/data-table/styles/pinning"
import { cn } from "@/lib/utils"
import type { DataTableResource, DataTableStyles } from "./DataTable.types"
import type { ColumnFormatter, TableColumnConfig } from "@/features/data-table/types/tableSchema.types"
import React from "react";

type ColumnMeta<T> = {
    editable?: boolean
    isNumeric?: boolean
    disableEditForRow?: (row: T) => boolean
    formatter?: ColumnFormatter
    editor?: TableColumnConfig["editor"]
}

type DataTableCellProps<T extends { id: number }> = {
    cell: Cell<T, unknown>
    row: Row<T>
    styles: DataTableStyles
    isEditable: boolean
    resource: DataTableResource
    mutationQueryKey?: readonly unknown[]
    trailingContent?: React.ReactNode
    utilityPinnedOffset?: number
}

export function DataTableCell<T extends { id: number }>({
    cell,
    row,
    styles,
    isEditable,
    resource,
    mutationQueryKey,
    utilityPinnedOffset = 0,
    trailingContent,
}: DataTableCellProps<T>) {
    "use no memo"

    const columnMeta = cell.column.columnDef.meta as ColumnMeta<T> | undefined
    const isRowDisabled = columnMeta?.disableEditForRow?.(row.original) ?? false
    const isCellEditable = isEditable && columnMeta?.editable && !isRowDisabled
    const isNumericColumn = Boolean(columnMeta?.isNumeric)
    const isPinned = cell.column.getIsPinned()

    return (
        <BaseTableCell
            data-pinned={isPinned || undefined}
            data-row-click-ignore={isCellEditable || undefined}
            className={cn(
                styles?.cellPadding,
                styles?.cellClass,
                "data-pinned:bg-background data-pinned:backdrop-blur-sm",
                isCellEditable ? "px-0.5 py-0.5" : "",
            )}
            style={{
                width: cell.column.getSize(),
                minWidth: cell.column.getSize(),
                maxWidth: cell.column.getSize(),
                flexShrink: 0,
                ...getPinningStyles(cell.column, false, utilityPinnedOffset),
            }}
        >
            {isCellEditable ? (
                <EditableCell
                    value={cell.getValue() as undefined}
                    displayValue={flexRender(cell.column.columnDef.cell, cell.getContext())}
                    
                    columnId={cell.column.id as keyof T as never}
                    className={cn("w-full", isNumericColumn && "text-right tabular-nums")}
                    resource={resource}
                    recordId={Number(row.original.id)}
                    queryKey={mutationQueryKey}
                    editor={columnMeta?.editor ?? (
                        columnMeta?.formatter === "date"
                            ? { type: "date" }
                            : isNumericColumn
                                ? { type: "number" }
                                : { type: "text" }
                    )}
                />
            ) : (
                trailingContent ? <div className="flex items-center gap-2">
                    <div className="min-w-0 flex-1">{flexRender(cell.column.columnDef.cell, cell.getContext())}</div>
                    {trailingContent}
                </div> : flexRender(cell.column.columnDef.cell, cell.getContext())
            )}
        </BaseTableCell>
    )
}
