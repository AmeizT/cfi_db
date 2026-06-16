"use client"

import type { Table as TanStackTable } from "@tanstack/react-table"
import type * as React from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { renderDataTableHead } from "@/components/ui/data-table"
import { TableHead, TableHeader as BaseTableHeader, TableRow } from "@/components/ui/table"
import { cn } from "@/lib/utils"
import { CHECKBOX_COLUMN_WIDTH } from "./DataTable.constants"
import type { DataTableStyles } from "./DataTable.types"

type DataTableHeaderProps<T extends { id: number }> = {
    table: TanStackTable<T>
    styles: DataTableStyles
    expandedRow?: (row: T) => React.ReactNode
    pinning?: boolean
    showGridLabels: boolean
    allSelected: boolean
    someSelected: boolean
    onToggleAllRows: () => void
}

export function DataTableHeader<T extends { id: number }>({
    table,
    styles,
    expandedRow,
    pinning,
    showGridLabels,
    allSelected,
    someSelected,
    onToggleAllRows,
}: DataTableHeaderProps<T>) {
    "use no memo"

    return (
        <BaseTableHeader className="sticky top-0 z-10 backdrop-blur-xs">
            {showGridLabels && (
                <TableRow>
                    <TableHead
                        style={{
                            width: CHECKBOX_COLUMN_WIDTH,
                            minWidth: CHECKBOX_COLUMN_WIDTH,
                            maxWidth: CHECKBOX_COLUMN_WIDTH,
                        }}
                        className={`text-right border-b ${styles?.cellPadding} ${styles?.cellClass} p-1`}
                    >
                        <div className="w-full h-full flex justify-end items-end">
                            <div className="w-5 h-5 [clip-path:polygon(0_0,100%_0,0_100%)] rotate-180" />
                        </div>
                    </TableHead>

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
                        <TableHead className="border-b" />
                    )}

                    <TableHead
                        className={cn(
                            "px-0 border-b text-xs text-center",
                            styles?.cellPadding,
                            styles?.cellClass
                        )}
                        style={{
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

                    {headerGroup.headers.map((header) => renderDataTableHead(header, pinning))}

                    <TableHead className="border-b" />
                </TableRow>
            ))}
        </BaseTableHeader>
    )
}
