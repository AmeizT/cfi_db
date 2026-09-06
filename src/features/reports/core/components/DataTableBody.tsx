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
    rowVirtualizer?: Virtualizer<HTMLDivElement, Element>
    visibleColumnCount: number
    styles: DataTableStyles
    isEditable: boolean
    isLoading: boolean
    loadingMode: "skeleton" | "overlay"
    hoveredRowId: number | null
    selectedRows: Set<number>
    expandedRow?: (row: T) => React.ReactNode
    onRowClick?: (row: T) => void
    resource: DataTableResource
    mutationQueryKey?: readonly unknown[]
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
    onRowClick,
    resource,
    mutationQueryKey,
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
                height: rowVirtualizer ? `${rowVirtualizer.getTotalSize()}px` : undefined,
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

            {!isLoading && (rowVirtualizer?.getVirtualItems() ?? rows.map((_, index) => ({ index }))).map((virtualRow) => {
                const row = rows[virtualRow.index]
                if (!row) return null

                const flags = row.original as T & DataTableRowFlags
                const isSection = !!flags.is_section
                const isTotal = !!flags.is_total
                const isExpanded = row.getIsExpanded()
                const isDeleted = !!flags.is_deleted
                const isClickable = Boolean(
                    onRowClick && !isSection && !isTotal && !isDeleted
                )
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
                                "group/row",
                                styles?.rowClass,
                                isSection && "font-bold bg-muted/20",
                                isTotal && "font-bold bg-muted/10",
                                (isSection || isTotal) && "text-sm",
                                (isSection || isTotal) && toneClass,
                                isDeleted && "bg-muted text-primary line-through opacity-60 pointer-events-none cursor-not-allowed",
                                isClickable && "cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
                            )}
                            tabIndex={isClickable ? 0 : undefined}
                            onClick={(event) => {
                                if (!isClickable) return
                                const target = event.target as HTMLElement
                                if (
                                    target.closest(
                                        "a, button, input, select, textarea, [role=checkbox], [contenteditable=true], [data-row-click-ignore]"
                                    )
                                ) {
                                    return
                                }
                                onRowClick?.(row.original)
                            }}
                            onKeyDown={(event) => {
                                if (!isClickable || event.target !== event.currentTarget) return
                                if (event.key !== "Enter" && event.key !== " ") return
                                event.preventDefault()
                                onRowClick?.(row.original)
                            }}
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
                                    {!isSection ? (
                                        <span className="relative inline-flex size-5 items-center justify-center">
                                            <span
                                                aria-hidden="true"
                                                className={cn(
                                                    "absolute transition-opacity group-hover/row:opacity-0 group-focus-within/row:opacity-0 [@media(pointer:coarse)]:opacity-0",
                                                    selectedRows.has(row.original.id) && "opacity-0",
                                                )}
                                            >
                                                {row.index + 1}
                                            </span>
                                            <Checkbox
                                                checked={selectedRows.has(row.original.id)}
                                                onCheckedChange={() => onToggleRow(row.original.id)}
                                                aria-label={`Select row ${row.index + 1}`}
                                                className={cn(
                                                    "absolute opacity-0 transition-opacity group-hover/row:opacity-100 group-focus-within/row:opacity-100 [@media(pointer:coarse)]:opacity-100",
                                                    selectedRows.has(row.original.id) && "opacity-100",
                                                    hoveredRowId === row.original.id && "opacity-100",
                                                )}
                                            />
                                        </span>
                                    ) : null}
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
                                    mutationQueryKey={mutationQueryKey}
                                    utilityPinnedOffset={utilityPinnedOffset}
                                />
                            ))}

                            {showRowActions && (
                                <TableCell className="sticky right-0 z-20 w-12 min-w-12 bg-background/95 px-2 backdrop-blur-sm before:pointer-events-none before:absolute before:inset-y-0 before:-left-8 before:w-8 before:bg-linear-to-r before:from-transparent before:to-background/95">
                                    <DataTableDropdownMenu
                                        actions={rowActions?.(row.original)}
                                        rowId={String(row.original.id)}
                                        resource={resource}
                                        enableDelete={enableDelete}
                                        showDefaultActions={showDefaultRowActions}
                                        triggerClassName="opacity-100 transition-opacity sm:opacity-0 sm:group-hover/row:opacity-100 sm:group-focus-within/row:opacity-100 [@media(pointer:coarse)]:opacity-100"
                                        mutationQueryKey={mutationQueryKey}
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
