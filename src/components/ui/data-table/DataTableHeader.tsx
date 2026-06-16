"use client"

import { Table } from "@tanstack/react-table"
import { TableRow, TableHead, TableHeader } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { renderDataTableHead } from "@/components/ui/data-table"
import { cn } from "@/lib/utils"
import { dataTableHeadRender } from "./DataTableHead";

const CHECKBOX_COLUMN_WIDTH = 32

type DataTableHeaderProps<T> = {
    table: Table<T>
    styles: { cellPadding?: string; cellClass?: string } | null
    expandedRow?: (row: T) => React.ReactNode
    children: React.ReactNode
}

export function DataTableHeader<T>({ children, table, styles, expandedRow }: DataTableHeaderProps<T>) {
    return (
        <TableHeader className="sticky top-0 z-10 backdrop-blur-xs">
            {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                    {expandedRow && <TableHead className="w-8" />}

                    <TableHead
                        className={cn(
                            "px-0 border-y text-xs text-center",
                            styles?.cellPadding,
                            styles?.cellClass,
                        )}
                        style={{
                            width: CHECKBOX_COLUMN_WIDTH,
                            minWidth: CHECKBOX_COLUMN_WIDTH,
                            maxWidth: CHECKBOX_COLUMN_WIDTH,
                        }}
                    >
                        <Checkbox />
                    </TableHead>

                    {children}
                </TableRow>
            ))}
        </TableHeader>
    )
}