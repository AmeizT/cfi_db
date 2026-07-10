"use client"

import { flexRender, type Cell, type Row } from "@tanstack/react-table"
import { EditableCell } from "@/components/ui/editable-cell"
import { TableCell as BaseTableCell } from "@/components/ui/table"
import { getPinningStyles } from "@/components/ui/data-table/styles/pinning"
import { cn } from "@/lib/utils"
import type { DataTableResource, DataTableStyles } from "./DataTable.types"
import React from "react";

type ColumnMeta<T> = {
    editable?: boolean
    isNumeric?: boolean
    disableEditForRow?: (row: T) => boolean
}

type DataTableCellProps<T extends { id: number }> = {
    cell: Cell<T, unknown>
    row: Row<T>
    styles: DataTableStyles
    isEditable: boolean
    resource: DataTableResource
    utilityPinnedOffset?: number
}

export function DataTableCell<T extends { id: number }>({
    cell,
    row,
    styles,
    isEditable,
    resource,
    utilityPinnedOffset = 0,
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
                    rowIndex={row.index}
                    columnId={cell.column.id as keyof T as never}
                    className={cn("w-full", isNumericColumn && "text-right tabular-nums")}
                    resource={resource}
                    recordId={Number(row.original.id)}
                />
            ) : (
                <React.Fragment>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </React.Fragment>
            )}
        </BaseTableCell>
    )
}
