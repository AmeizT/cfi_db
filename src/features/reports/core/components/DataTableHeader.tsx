"use client"

import type { Table as TanStackTable } from "@tanstack/react-table"
import type * as React from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { renderDataTableHead } from "@/components/ui/data-table"
import { TableHead, TableHeader as BaseTableHeader, TableRow } from "@/components/ui/table"
import { cn } from "@/lib/utils"
import { CHECKBOX_COLUMN_WIDTH, EXPAND_COLUMN_WIDTH } from "./DataTable.constants"
import type { DataTableStyles } from "./DataTable.types"

type DataTableHeaderProps<T extends { id: number }> = {
    table: TanStackTable<T>
    styles: DataTableStyles
    expandedRow?: (row: T) => React.ReactNode
    enablePinning: boolean
    showGridLabels: boolean
    allSelected: boolean
    someSelected: boolean
    showRowActions: boolean
    selectable: boolean
    pinUtilityColumns: boolean
    utilityPinnedOffset: number
    onToggleAllRows: () => void
}

export function DataTableHeader<T extends { id: number }>({
    table,
    styles,
    expandedRow,
    enablePinning,
    showGridLabels,
    allSelected,
    someSelected,
    showRowActions,
    selectable,
    pinUtilityColumns,
    utilityPinnedOffset,
    onToggleAllRows,
}: DataTableHeaderProps<T>) {
    "use no memo"

    const pinnedUtilityClass = pinUtilityColumns
        ? "sticky left-0 z-20 bg-background backdrop-blur-sm"
        : ""

    return (
        <BaseTableHeader className="sticky top-0 z-10 backdrop-blur-xs">
            {showGridLabels && (
                <TableRow>
                    {expandedRow && (
                        <TableHead
                            style={{
                                left: pinUtilityColumns ? 0 : undefined,
                                width: EXPAND_COLUMN_WIDTH,
                                minWidth: EXPAND_COLUMN_WIDTH,
                                maxWidth: EXPAND_COLUMN_WIDTH,
                            }}
                            className={cn(
                                "text-right border-b p-1",
                                styles?.cellPadding,
                                styles?.cellClass,
                                pinnedUtilityClass
                            )}
                        />
                    )}

                    {selectable && (
                        <TableHead
                            style={{
                                left: pinUtilityColumns && expandedRow ? EXPAND_COLUMN_WIDTH : 0,
                                width: CHECKBOX_COLUMN_WIDTH,
                                minWidth: CHECKBOX_COLUMN_WIDTH,
                                maxWidth: CHECKBOX_COLUMN_WIDTH,
                            }}
                            className={cn(
                                "text-right border-b p-1",
                                styles?.cellPadding,
                                styles?.cellClass,
                                pinnedUtilityClass
                            )}
                        >
                            <div className="w-full h-full flex justify-end items-end">
                                <div className="w-5 h-5 [clip-path:polygon(0_0,100%_0,0_100%)] rotate-180" />
                            </div>
                        </TableHead>
                    )}

                    {table.getVisibleLeafColumns().map((column, index) => (
                        <TableHead
                            key={column.id}
                            style={{ width: column.getSize() }}
                            className={`text-center text-xs border-b border-border-subtle ${styles?.cellPadding} ${styles?.cellClass}`}
                        >
                            {String.fromCharCode(65 + index)}
                        </TableHead>
                    ))}
                </TableRow>
            )}

            {table.getHeaderGroups().map((headerGroup) => (
                <TableRow className="group/resizer" key={headerGroup.id}>
                    {expandedRow && (
                        <TableHead
                            className={cn("border-b", pinnedUtilityClass)}
                            style={{
                                left: pinUtilityColumns ? 0 : undefined,
                                width: EXPAND_COLUMN_WIDTH,
                                minWidth: EXPAND_COLUMN_WIDTH,
                                maxWidth: EXPAND_COLUMN_WIDTH,
                            }}
                        />
                    )}

                    {selectable && (
                        <TableHead
                            className={cn(
                                "px-0 border-b text-xs text-center",
                                styles?.cellPadding,
                                styles?.cellClass,
                                pinnedUtilityClass
                            )}
                            style={{
                                left: pinUtilityColumns && expandedRow ? EXPAND_COLUMN_WIDTH : 0,
                                width: CHECKBOX_COLUMN_WIDTH,
                                minWidth: CHECKBOX_COLUMN_WIDTH,
                                maxWidth: CHECKBOX_COLUMN_WIDTH,
                            }}
                        >
                            <Checkbox
                                checked={allSelected}
                                indeterminate={!allSelected && someSelected}
                                onCheckedChange={onToggleAllRows}
                            />
                        </TableHead>
                    )}

                    {headerGroup.headers.map((header) =>
                        renderDataTableHead(header, enablePinning, utilityPinnedOffset)
                    )}

                    {showRowActions && (
                        <TableHead className="border-b" />
                    )}
                </TableRow>
            ))}
        </BaseTableHeader>
    )
}
