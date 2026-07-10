"use client"

import React from "react"
import { Row, flexRender } from "@tanstack/react-table"
import { TableRow, TableCell } from "@/components/ui/table"
import { EditableCell } from "@/components/ui/editable-cell"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { ChevronDownIcon, ChevronUpIcon, Info } from "lucide-react"
import { getPinningStyles } from "@/components/ui/data-table/styles/pinning"
import { cn } from "@/lib/utils"

const CHECKBOX_COLUMN_WIDTH = 32

type DataTableRowProps<T extends { id: string | number }> = {
    row: Row<T>
    styles: { rowClass?: string; cellPadding?: string; cellClass?: string } | null
    isEditable: boolean
    hoveredRowId: string | number | null
    selectedRows: Set<string | number>
    expandedRow?: (row: T) => React.ReactNode
    onHoverEnter: (id: string | number) => void
    onHoverLeave: () => void
    onToggleRow: (id: string | number) => void
}

export function DataTableRow<T extends { id: string | number }>({
    row,
    styles,
    isEditable,
    hoveredRowId,
    selectedRows,
    expandedRow,
    onHoverEnter,
    onHoverLeave,
    onToggleRow,
}: DataTableRowProps<T>) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const flags = row.original as any
    const isSection = !!flags.is_section
    const isTotal = !!flags.is_total
    const isExpanded = row.getIsExpanded()

    return (
        <React.Fragment>
            <TableRow
                className={cn(
                    styles?.rowClass,
                    isSection && "font-bold",
                    isTotal && "font-bold",
                )}
                onMouseEnter={() => onHoverEnter(row.original.id)}
                onMouseLeave={onHoverLeave}
            >
                {expandedRow && (
                    <TableCell className="w-8 py-0 pr-0">
                        {!isSection && (
                            <Button
                                aria-expanded={isExpanded}
                                aria-label={isExpanded ? "Collapse row" : "Expand row"}
                                className="size-7 rounded-md shadow-none text-muted-foreground hover:bg-accent hover:text-foreground [&_svg:not([class*='size-'])]:size-4"
                                onClick={row.getToggleExpandedHandler()}
                                size="icon"
                                variant="ghost"
                            >
                                {isExpanded
                                    ? <ChevronUpIcon className="opacity-60" aria-hidden="true" />
                                    : <ChevronDownIcon className="opacity-60" aria-hidden="true" />
                                }
                            </Button>
                        )}
                    </TableCell>
                )}

                <TableCell
                    style={{
                        width: CHECKBOX_COLUMN_WIDTH,
                        minWidth: CHECKBOX_COLUMN_WIDTH,
                        maxWidth: CHECKBOX_COLUMN_WIDTH,
                    }}
                    className={cn(
                        "px-0 text-xs text-center",
                        styles?.cellPadding,
                        styles?.cellClass,
                    )}
                >
                    {(hoveredRowId === row.original.id || selectedRows.size > 0) && !isSection ? (
                        <span onClick={(e) => { e.stopPropagation(); onToggleRow(row.original.id) }}>
                            <Checkbox
                                checked={selectedRows.has(row.original.id)}
                                onCheckedChange={() => onToggleRow(row.original.id)}
                            />
                        </span>
                    ) : (
                        !isSection && (
                            <span className="block text-center">{row.index + 1}</span>
                        )
                    )}
                </TableCell>

                {row.getVisibleCells().map((cell) => {
                    const columnMeta = cell.column.columnDef.meta as {
                        editable?: boolean
                        isNumeric?: boolean
                        disableEditForRow?: (row: T) => boolean
                    }
                    
                    const isRowDisabled = columnMeta?.disableEditForRow?.(row.original) ?? false
                    const isCellEditable = isEditable && columnMeta?.editable && !isRowDisabled
                    const isNumericColumn = Boolean(columnMeta?.isNumeric)
                    const isPinned = cell.column.getIsPinned()

                    return (
                        <TableCell
                            data-pinned={isPinned || undefined}
                            key={cell.id}
                            className={cn(
                                styles?.cellPadding,
                                styles?.cellClass,
                                "data-pinned:bg-background data-pinned:backdrop-blur-sm",
                                isCellEditable ? "px-0.5" : "px-2.5",
                            )}
                            style={{
                                width: cell.column.getSize(),
                                minWidth: cell.column.getSize(),
                                maxWidth: cell.column.getSize(),
                                flexShrink: 0,
                                ...getPinningStyles(cell.column),
                            }}
                        >
                            {isCellEditable ? (
                                <EditableCell
                                    value={cell.getValue() as undefined}
                                    displayValue={flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    rowIndex={row.index}
                                    columnId={cell.column.id as keyof T as never}
                                    onSave={() => console.log("editing")}
                                    className={cn("w-full", isNumericColumn && "text-right tabular-nums")}
                                />
                            ) : (
                                <span className={cn("w-full", isNumericColumn && "text-right tabular-nums")}>
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </span>
                            )}
                        </TableCell>
                    )
                })}
            </TableRow>

            {expandedRow && isExpanded && (
                <TableRow className="align-top border-b">
                    <TableCell>
                        <div className="w-full h-full flex justify-center items-start pt-4.5">
                            <Info className="opacity-60" size={16} />
                        </div>
                    </TableCell>
                    <TableCell
                        colSpan={row.getVisibleCells().length + 2}
                        className="p-4"
                    >
                        <div className="w-full flex flex-wrap overflow-hidden">
                            {expandedRow(row.original)}
                        </div>
                    </TableCell>
                </TableRow>
            )}
        </React.Fragment>
    )
}
