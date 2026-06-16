"use client"

import * as React from "react"
import type { Row } from "@tanstack/react-table"
import type { Virtualizer } from "@tanstack/react-virtual"
import { ChevronDownIcon, ChevronUpIcon, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { DataTableDropdownMenu } from "@/components/ui/data-table/DataTableDropdownMenu"
import { Skeleton } from "@/components/ui/skeleton"
import { TableBody as BaseTableBody, TableCell, TableRow } from "@/components/ui/table"
import { cn } from "@/lib/utils"
import { CHECKBOX_COLUMN_WIDTH, SKELETON_ROW_COUNT } from "./DataTable.constants"
import { DataTableCell } from "./DataTableCell"
import type {
    DataTableResource,
    DataTableRowFlags,
    DataTableStyles,
} from "./DataTable.types"

type DataTableBodyProps<T extends { id: number }> = {
    rows: Row<T>[]
    rowVirtualizer: Virtualizer<HTMLDivElement, Element>
    visibleColumnCount: number
    styles: DataTableStyles
    isEditable: boolean
    isLoading: boolean
    loadingMode: "skeleton" | "overlay"
    hoveredRowId: number | null
    selectedRows: Set<number>
    expandedRow?: (row: T) => React.ReactNode
    resource: DataTableResource
    onHoverRow: (id: number) => void
    onClearHoveredRow: () => void
    onToggleRow: (id: number) => void
}

export function DataTableBody<T extends { id: number }>({
    rows,
    rowVirtualizer,
    visibleColumnCount,
    styles,
    isEditable,
    isLoading,
    loadingMode,
    hoveredRowId,
    selectedRows,
    expandedRow,
    resource,
    onHoverRow,
    onClearHoveredRow,
    onToggleRow,
}: DataTableBodyProps<T>) {
    "use no memo"

    return (
        <BaseTableBody
            style={{
                height: `${rowVirtualizer.getTotalSize()}px`,
                position: "relative",
            }}
            className="transition-opacity duration-200"
        >
            {isLoading && loadingMode === "skeleton" && (
                Array.from({ length: SKELETON_ROW_COUNT }).map((_, index) => (
                    <TableRow key={`skeleton-${index}`}>
                        <TableCell colSpan={visibleColumnCount + 1}>
                            <Skeleton className="h-8 w-full rounded bg-surface-muted animate-pulse" />
                        </TableCell>
                    </TableRow>
                ))
            )}

            {!isLoading && rowVirtualizer.getVirtualItems().map((virtualRow) => {
                const row = rows[virtualRow.index]
                if (!row) return null

                const flags = row.original as T & DataTableRowFlags
                const isSection = !!flags.is_section
                const isTotal = !!flags.is_total
                const isExpanded = row.getIsExpanded()
                const isDeleted = !!flags.is_deleted

                return (
                    <React.Fragment key={row.id}>
                        <TableRow
                            className={cn(
                                styles?.rowClass,
                                isSection && "font-bold",
                                isTotal && "font-bold",
                                isDeleted && "bg-gray-100 text-primary line-through opacity-60 pointer-events-none cursor-not-allowed"
                            )}
                            onMouseEnter={() => onHoverRow(row.original.id)}
                            onMouseLeave={onClearHoveredRow}
                        >
                            {expandedRow && (
                                <TableCell>
                                    {!isSection && (
                                        <div className="w-full flex justify-center">
                                            <Button
                                                aria-expanded={isExpanded}
                                                aria-label={isExpanded ? "Collapse row" : "Expand row"}
                                                className="px-0 size-7 rounded-full shadow-none text-muted hover:bg-gray-100 [&_svg:not([class*='size-'])]:size-4"
                                                onClick={row.getToggleExpandedHandler()}
                                                size="icon"
                                                variant="ghost"
                                            >
                                                {isExpanded
                                                    ? <ChevronUpIcon className="opacity-60" aria-hidden="true" />
                                                    : <ChevronDownIcon className="opacity-60" aria-hidden="true" />
                                                }
                                            </Button>
                                        </div>
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
                                    <span onClick={(event) => { event.stopPropagation(); onToggleRow(row.original.id) }}>
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

                            {row.getVisibleCells().map((cell) => (
                                <DataTableCell
                                    key={cell.id}
                                    cell={cell}
                                    row={row}
                                    styles={styles}
                                    isEditable={isEditable}
                                    resource={resource}
                                />
                            ))}

                            <TableCell>
                                <DataTableDropdownMenu
                                    rowId={String(row.original.id)}
                                    resource={resource}
                                />
                            </TableCell>
                        </TableRow>

                        {expandedRow && isExpanded && (
                            <TableRow className="align-top border-b border-gray-200">
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
            })}
        </BaseTableBody>
    )
}
