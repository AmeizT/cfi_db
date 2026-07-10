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
import { CHECKBOX_COLUMN_WIDTH, EXPAND_COLUMN_WIDTH, SKELETON_ROW_COUNT } from "./DataTable.constants"
import { DataTableCell } from "./DataTableCell"
import type {
    DataTableAction,
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
    showRowActions: boolean
    showDefaultRowActions: boolean
    rowActions?: (row: T) => DataTableAction[]
    selectable: boolean
    enableDelete: boolean
    pinUtilityColumns: boolean
    utilityPinnedOffset: number
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
    showRowActions,
    showDefaultRowActions,
    rowActions,
    selectable,
    enableDelete,
    pinUtilityColumns,
    utilityPinnedOffset,
    onHoverRow,
    onClearHoveredRow,
    onToggleRow,
}: DataTableBodyProps<T>) {
    "use no memo"
    const pinnedUtilityClass = pinUtilityColumns
        ? "sticky z-10 bg-background backdrop-blur-sm"
        : ""
    const skeletonColSpan =
        visibleColumnCount +
        (expandedRow ? 1 : 0) +
        (selectable ? 1 : 0) +
        (showRowActions ? 1 : 0)

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
                        <TableCell colSpan={skeletonColSpan}>
                            <Skeleton className="h-8 w-full rounded bg-muted animate-pulse" />
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
                const toneClass =
                    flags.tone === "income"
                        ? "text-emerald-700 dark:text-emerald-400"
                        : flags.tone === "expense"
                        ? "text-red-700 dark:text-red-400"
                        : ""

                return (
                    <React.Fragment key={row.id}>
                        <TableRow
                            className={cn(
                                styles?.rowClass,
                                isSection && "font-bold bg-muted/20",
                                isTotal && "font-bold bg-muted/10",
                                (isSection || isTotal) && "text-sm",
                                (isSection || isTotal) && toneClass,
                                isDeleted && "bg-muted text-primary line-through opacity-60 pointer-events-none cursor-not-allowed"
                            )}
                            onMouseEnter={() => onHoverRow(row.original.id)}
                            onMouseLeave={onClearHoveredRow}
                        >
                            {expandedRow && (
                                <TableCell
                                    className={pinnedUtilityClass}
                                    style={{
                                        left: pinUtilityColumns ? 0 : undefined,
                                        width: EXPAND_COLUMN_WIDTH,
                                        minWidth: EXPAND_COLUMN_WIDTH,
                                        maxWidth: EXPAND_COLUMN_WIDTH,
                                    }}
                                >
                                    {!isSection && (
                                        <div className="w-full flex justify-center">
                                            <Button
                                                aria-expanded={isExpanded}
                                                aria-label={isExpanded ? "Collapse row" : "Expand row"}
                                                className="px-0 size-7 rounded-full shadow-none text-muted-foreground hover:bg-accent hover:text-foreground [&_svg:not([class*='size-'])]:size-4"
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

                            {selectable && (
                                <TableCell
                                    style={{
                                        left: pinUtilityColumns && expandedRow ? EXPAND_COLUMN_WIDTH : 0,
                                        width: CHECKBOX_COLUMN_WIDTH,
                                        minWidth: CHECKBOX_COLUMN_WIDTH,
                                        maxWidth: CHECKBOX_COLUMN_WIDTH,
                                    }}
                                    className={cn(
                                        "px-0 text-xs text-center",
                                        styles?.cellPadding,
                                        styles?.cellClass,
                                        pinnedUtilityClass,
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
                            )}

                            {row.getVisibleCells().map((cell) => (
                                <DataTableCell
                                    key={cell.id}
                                    cell={cell}
                                    row={row}
                                    styles={styles}
                                    isEditable={isEditable}
                                    resource={resource}
                                    utilityPinnedOffset={utilityPinnedOffset}
                                />
                            ))}

                            {showRowActions && (
                                <TableCell>
                                    <DataTableDropdownMenu
                                        actions={rowActions?.(row.original)}
                                        rowId={String(row.original.id)}
                                        resource={resource}
                                        enableDelete={enableDelete}
                                        showDefaultActions={showDefaultRowActions}
                                    />
                                </TableCell>
                            )}
                        </TableRow>

                        {expandedRow && isExpanded && (
                            <TableRow className="align-top border-b border-border-subtle">
                                <TableCell
                                    className={pinnedUtilityClass}
                                    style={{
                                        left: pinUtilityColumns ? 0 : undefined,
                                        width: EXPAND_COLUMN_WIDTH,
                                        minWidth: EXPAND_COLUMN_WIDTH,
                                        maxWidth: EXPAND_COLUMN_WIDTH,
                                    }}
                                >
                                    <div className="w-full h-full flex justify-center items-start pt-4.5">
                                        <Info className="opacity-60" size={16} />
                                    </div>
                                </TableCell>
                                <TableCell
                                    colSpan={
                                        row.getVisibleCells().length +
                                        (selectable ? 1 : 0) +
                                        (showRowActions ? 1 : 0)
                                    }
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
