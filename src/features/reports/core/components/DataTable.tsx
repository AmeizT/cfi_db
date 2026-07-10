"use client"

import * as React from "react"
import { Table } from "@/components/ui/table"
import { DataTableBulkActionToolbar } from "@/components/ui/data-table/DataTableActionToolbar"
import { Spinner } from "@/components/ui/spinner"
import { useTableVirtualization } from "@/features/data-table/hooks/use-table-virtualization"
import { useTableEngine } from "@/features/data-table/hooks/use-table-engine"
import { useUser } from "@/hooks/query/use-user"
import { apiRoutes, type ApiBulkDeleteRouteKey } from "@/config/urls"
import { cn } from "@/lib/utils"
import { DataTableBody } from "./DataTableBody"
import { CHECKBOX_COLUMN_WIDTH, EXPAND_COLUMN_WIDTH } from "./DataTable.constants"
import { DataTableHeader } from "./DataTableHeader"
import { DataTableToolbar } from "./DataTableToolbar"
import { DataTablePagination } from "./DataTablePagination"
import { useSmartPagination } from "./hooks/useSmartPagination"
import {
    DEFAULT_DATA_TABLE_OPTIONS,
    type DataGridProps,
    type DataTableOptions,
    type DataTableResource,
    type DataTableRowFlags,
} from "./DataTable.types"

function hasBulkDeleteRoute(resource: DataTableResource): resource is ApiBulkDeleteRouteKey {
    return "bulkDelete" in apiRoutes[resource]
}

export function DataTable<T extends { id: number }>({
    data,
    rows: controlledRows,
    config,
    isLoading = false,
    loadingMode = "skeleton",
    expandedRow,
    options,
    showToolbar = true,
    showColumnVisibility = true,
    showFilters = true,
    showRowActions = true,
    showDefaultRowActions = true,
    rowActions,
    enableDelete = true,
    enableExport,
    showExport = true,
    exportFormat,
    exportMetadata,
    onExport,
    exportFilename = "export",
    resource = "reports",
    totalRows,
    currentPage = 1,
    pageSize = 10,
    pageSizeOptions,
    onPageChange,
    onPageSizeChange,
}: DataGridProps<T>) {
    "use no memo"

    const { data: user } = useUser()
    const tableRootRef = React.useRef<HTMLDivElement | null>(null)
    const paginationRef = React.useRef<HTMLDivElement | null>(null)
    const [localPage, setLocalPage] = React.useState(1)
    const [localPageSize, setLocalPageSize] = React.useState(pageSize)
    const tableOptions = React.useMemo<Required<DataTableOptions>>(
        () => ({
            enablePinning:
                options?.enablePinning ?? DEFAULT_DATA_TABLE_OPTIONS.enablePinning,
            pagination:
                options?.pagination ?? DEFAULT_DATA_TABLE_OPTIONS.pagination,
            selectable:
                options?.selectable ?? DEFAULT_DATA_TABLE_OPTIONS.selectable,
        }),
        [options]
    )
    const isSelectable = tableOptions.selectable
    const isPinningEnabled = tableOptions.enablePinning
    const isPaginationEnabled = tableOptions.pagination
    const rowsData = React.useMemo(
        () => controlledRows ?? data ?? [],
        [controlledRows, data]
    )

    const engine = useTableEngine<T>({
        data: rowsData,
        config: config as never,
        user: user ?? undefined,
        expandable: !!expandedRow,
        enablePinning: isPinningEnabled,
    })

    const { table, styles, ui, interaction } = engine
    const isEditable = interaction.isEditable
    const allRows = table.getRowModel().rows
    const hasExternalPagination =
        typeof totalRows === "number" &&
        typeof onPageChange === "function" &&
        typeof onPageSizeChange === "function"
    const paginationTotalRows = hasExternalPagination
        ? totalRows
        : allRows.length
    const paginationCurrentPage = hasExternalPagination
        ? currentPage
        : localPage
    const paginationPageSize = hasExternalPagination
        ? pageSize
        : localPageSize
    const paginationPageSizeOptions = pageSizeOptions ?? [10, 25, 50, 100]
    const shouldRenderPagination =
        isPaginationEnabled &&
        paginationTotalRows > paginationPageSize
    const totalPaginationPages = Math.max(
        1,
        Math.ceil(paginationTotalRows / paginationPageSize)
    )
    const safePaginationPage = Math.min(
        Math.max(paginationCurrentPage, 1),
        totalPaginationPages
    )
    const rows = React.useMemo(() => {
        if (hasExternalPagination || !shouldRenderPagination) {
            return allRows
        }

        const startIndex = (safePaginationPage - 1) * paginationPageSize
        return allRows.slice(startIndex, startIndex + paginationPageSize)
    }, [
        allRows,
        hasExternalPagination,
        paginationPageSize,
        safePaginationPage,
        shouldRenderPagination,
    ])
    const smartPagination = useSmartPagination({
        tableRef: tableRootRef,
        paginationRef,
        enabled: shouldRenderPagination,
    })

    const [selectedRows, setSelectedRows] = React.useState<Set<number>>(new Set())
    const [hoveredRowId, setHoveredRowId] = React.useState<number | null>(null)

    const [canScrollLeft, setCanScrollLeft] = React.useState(false)
    const [canScrollRight, setCanScrollRight] = React.useState(false)

    const selectedIds = React.useMemo(
        () => isSelectable ? Array.from(selectedRows) : [],
        [isSelectable, selectedRows]
    )

    const selectionCount = selectedIds.length

    function toggleRow(id: number) {
        setSelectedRows((prev) => {
            const next = new Set(prev)

            if (next.has(id)) {
                next.delete(id)
            } else {
                next.add(id)
            }

            return next
        })
    }

    function handleScroll(event: React.UIEvent<HTMLDivElement>) {
        const el = event.currentTarget

        setCanScrollLeft(el.scrollLeft > 0)
        setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1)
    }

    const { parentRef, rowVirtualizer } = useTableVirtualization({ rows })
    const isGrid = ui.mode === "grid"
    const hideRow = true
    const columnPinning = table.getState().columnPinning
    const hasPinnedDataColumns = Boolean(
        columnPinning.left?.length || columnPinning.right?.length
    )
    const utilityPinnedOffset =
        hasPinnedDataColumns
            ? (expandedRow ? EXPAND_COLUMN_WIDTH : 0) +
                (isSelectable ? CHECKBOX_COLUMN_WIDTH : 0)
            : 0
    const pinUtilityColumns = hasPinnedDataColumns && utilityPinnedOffset > 0
    const resolvedShowExport = enableExport ?? showExport
    const resolvedExportFormat =
        exportFormat ?? (enableExport === undefined ? "csv" : "pdf")
    const resolvedExportMetadata = React.useMemo(
        () => ({
            ...exportMetadata,
            generatedBy: exportMetadata?.generatedBy ?? user?.full_name,
        }),
        [exportMetadata, user?.full_name]
    )
    const rowIds = React.useMemo(() => {
        if (!isSelectable) return []

        return rows
            .filter((row) => {
                const flags = row.original as T & DataTableRowFlags
                return !flags.is_section
            })
            .map((row) => row.original.id)
    }, [isSelectable, rows])

    const allSelected =
        isSelectable &&
        rowIds.length > 0 &&
        rowIds.every((id) => selectedRows.has(id))

    const someSelected =
        isSelectable &&
        rowIds.some((id) => selectedRows.has(id))

    function toggleAllRows() {
        if (!isSelectable) return

        setSelectedRows((prev) => {
            const next = new Set(prev)
            const shouldSelectAll = !allSelected

            rowIds.forEach((id) => {
                if (shouldSelectAll) {
                    next.add(id)
                } else {
                    next.delete(id)
                }
            })

            return next
        })
    }

    function handleToggleRow(id: number) {
        if (!isSelectable) return
        toggleRow(id)
    }

    function handlePageChange(page: number) {
        if (hasExternalPagination) {
            onPageChange?.(page)
            return
        }

        setLocalPage(page)
    }

    function handlePageSizeChange(size: number) {
        if (hasExternalPagination) {
            onPageSizeChange?.(size)
            return
        }

        setLocalPageSize(size)
        setLocalPage(1)
    }

    return (
        <div ref={tableRootRef} className="flex w-full h-fit flex-col items-center justify-center gap-4">
            {showToolbar && (
                <DataTableToolbar
                    table={table}
                    showColumnVisibility={showColumnVisibility}
                    showExport={resolvedShowExport}
                    showFilters={showFilters}
                    enableDelete={enableDelete}
                    exportFormat={resolvedExportFormat}
                    exportMetadata={resolvedExportMetadata}
                    onExport={onExport}
                    exportFilename={exportFilename}
                />
            )}

            <div className="w-full relative bg-card/80 backdrop-blur-md overflow-hidden border-y-2 border-border-subtle">
                {canScrollLeft && (
                    <div className="pointer-events-none absolute left-0 top-0 h-full w-10 bg-linear-to-r from-background to-transparent z-10" />
                )}

                {canScrollRight && (
                    <div className="pointer-events-none absolute right-0 top-0 h-full w-10 bg-linear-to-l from-background to-transparent z-10" />
                )}

                <div ref={parentRef} onScroll={handleScroll} className={`${ui.border} overflow-x-auto scrollbar-hidden`}>
                    <Table className={`w-full text-sm ${styles?.containerClass}`}>
                        <DataTableHeader
                            table={table}
                            styles={styles}
                            expandedRow={expandedRow}
                            enablePinning={isPinningEnabled}
                            showGridLabels={isGrid && !hideRow}
                            allSelected={allSelected}
                            someSelected={someSelected}
                            showRowActions={showRowActions}
                            selectable={isSelectable}
                            pinUtilityColumns={pinUtilityColumns}
                            utilityPinnedOffset={utilityPinnedOffset}
                            onToggleAllRows={toggleAllRows}
                        />

                        <DataTableBody
                            rows={rows}
                            rowVirtualizer={rowVirtualizer}
                            visibleColumnCount={table.getVisibleLeafColumns().length}
                            styles={styles}
                            isEditable={isEditable}
                            isLoading={isLoading}
                            loadingMode={loadingMode}
                            hoveredRowId={hoveredRowId}
                            selectedRows={selectedRows}
                            expandedRow={expandedRow}
                            resource={resource}
                            showRowActions={showRowActions}
                            showDefaultRowActions={showDefaultRowActions}
                            rowActions={rowActions}
                            selectable={isSelectable}
                            enableDelete={enableDelete}
                            pinUtilityColumns={pinUtilityColumns}
                            utilityPinnedOffset={utilityPinnedOffset}
                            onHoverRow={setHoveredRowId}
                            onClearHoveredRow={() => setHoveredRowId(null)}
                            onToggleRow={handleToggleRow}
                        />
                    </Table>

                    {isSelectable && enableDelete && hasBulkDeleteRoute(resource) ? (
                        <DataTableBulkActionToolbar
                            selectedCount={selectionCount}
                            selectedIds={selectedIds}
                            onClear={() => setSelectedRows(new Set())}
                            resource={resource}
                        />
                    ) : null}

                    {isLoading && loadingMode === "overlay" && (
                        <div className="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-sm">
                            <Spinner />
                        </div>
                    )}
                </div>
            </div>

            {shouldRenderPagination ? (
                <DataTablePagination
                    ref={paginationRef}
                    totalRows={paginationTotalRows}
                    currentPage={safePaginationPage}
                    pageSize={paginationPageSize}
                    pageSizeOptions={paginationPageSizeOptions}
                    onPageChange={handlePageChange}
                    onPageSizeChange={handlePageSizeChange}
                    className={cn(
                        "w-full transition-all duration-200 ease-out",
                        smartPagination.isSticky
                            ? "fixed bottom-0 z-30 border-t border-border bg-background/95 px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] shadow-sm backdrop-blur supports-[backdrop-filter]:bg-background/80"
                            : "relative rounded-lg border bg-card px-3 py-3",
                        !smartPagination.isVisible && "translate-y-full opacity-0 pointer-events-none"
                    )}
                    style={
                        smartPagination.isSticky
                            ? {
                                left: smartPagination.bounds.left,
                                width: smartPagination.bounds.width,
                            }
                            : undefined
                    }
                />
            ) : null}
        </div>
    )
}
