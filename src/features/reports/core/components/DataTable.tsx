"use client"

import * as React from "react"
import { Table } from "@/components/ui/table"
import { DataTableBulkActionToolbar } from "@/components/ui/data-table/DataTableActionToolbar"
import { Flex } from "@/components/ui/box"
import { Spinner } from "@/components/ui/spinner"
import { useTableVirtualization } from "@/features/data-table/hooks/use-table-virtualization"
import { useTableEngine } from "@/features/data-table/hooks/use-table-engine"
import { useUser } from "@/hooks/query/use-user"
import { DataTableBody } from "./DataTableBody"
import { DataTableHeader } from "./DataTableHeader"
import { DataTableToolbar } from "./DataTableToolbar"
import type { DataGridProps, DataTableRowFlags } from "./DataTable.types"

export function DataTable<T extends { id: number }>({
    data,
    config,
    isLoading = false,
    loadingMode = "skeleton",
    expandedRow,
    pinning,
    showToolbar = true,
    showColumnVisibility = true,
    showExport = true,
    showFilters = true,
    exportFilename = "export",
    resource,
}: DataGridProps<T>) {
    "use no memo"

    const { data: user } = useUser()

    const engine = useTableEngine<T>({
        data,
        config: config as never,
        user: user ?? undefined,
        expandable: !!expandedRow,
    })

    const { table, styles, ui, interaction } = engine
    const isEditable = interaction.isEditable

    const [selectedRows, setSelectedRows] = React.useState<Set<number>>(new Set())
    const [hoveredRowId, setHoveredRowId] = React.useState<number | null>(null)

    const [canScrollLeft, setCanScrollLeft] = React.useState(false)
    const [canScrollRight, setCanScrollRight] = React.useState(false)

    const selectedIds = React.useMemo(
        () => Array.from(selectedRows),
        [selectedRows]
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

    const isGrid = ui.mode === "grid"
    const rows = table.getRowModel().rows
    const { parentRef, rowVirtualizer } = useTableVirtualization({ rows })
    const hideRow = true

    const rowIds = React.useMemo(() => {
        return rows
            .filter((row) => {
                const flags = row.original as T & DataTableRowFlags
                return !flags.is_section
            })
            .map((row) => row.original.id)
    }, [rows])

    const allSelected =
        rowIds.length > 0 &&
        rowIds.every((id) => selectedRows.has(id))

    const someSelected =
        rowIds.some((id) => selectedRows.has(id))

    function toggleAllRows() {
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

    return (
        <Flex direction="column" gap={4} className="w-full h-fit">
            {showToolbar && (
                <DataTableToolbar
                    table={table}
                    showColumnVisibility={showColumnVisibility}
                    showExport={showExport}
                    showFilters={showFilters}
                    exportFilename={exportFilename}
                />
            )}

            <div className="w-full relative rounded-xl bg-white/80 backdrop-blur-md overflow-hidden border border-white/50">
                {canScrollLeft && (
                    <div className="pointer-events-none absolute left-0 top-0 h-full w-10 bg-linear-to-r from-gray-100 to-transparent z-10" />
                )}

                {canScrollRight && (
                    <div className="pointer-events-none absolute right-0 top-0 h-full w-10 bg-linear-to-l from-gray-100 to-transparent z-10" />
                )}

                <div ref={parentRef} onScroll={handleScroll} className={`${ui.border} overflow-x-auto scrollbar-hidden`}>
                    <Table className={`w-full text-sm ${styles?.containerClass}`}>
                        <DataTableHeader
                            table={table}
                            styles={styles}
                            expandedRow={expandedRow}
                            pinning={pinning}
                            showGridLabels={isGrid && !hideRow}
                            allSelected={allSelected}
                            someSelected={someSelected}
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
                            onHoverRow={setHoveredRowId}
                            onClearHoveredRow={() => setHoveredRowId(null)}
                            onToggleRow={toggleRow}
                        />
                    </Table>

                    <DataTableBulkActionToolbar
                        selectedCount={selectionCount}
                        selectedIds={selectedIds}
                        onClear={() => setSelectedRows(new Set())}
                        resource={resource}
                    />

                    {isLoading && loadingMode === "overlay" && (
                        <div className="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-sm">
                            <Spinner />
                        </div>
                    )}
                </div>
            </div>
        </Flex>
    )
}
