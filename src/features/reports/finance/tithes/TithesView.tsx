"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { HugeiconsIcon } from "@hugeicons/react"
import { DownloadCircle01Icon } from "@hugeicons/core-free-icons"
import { apiRoutes } from "@/config/urls"
import { DataTable } from "../../core/components/DataTable"
import { Skeleton } from "@/components/ui/skeleton"
import type { DataTablePaginationProps } from "../../core/components/DataTable.types"
import type { TableSchema } from "@/features/data-table/types/tableSchema.types"
import type { TitheRecord, TithesMeta } from "./types"

type TithesViewData = {
    rows?: TitheRecord[]
    results?: TitheRecord[]
    data?: TitheRecord[]
    count?: number
    config?: TableSchema
    table_schema?: TableSchema
    meta?: TithesMeta
}

interface ViewProps {
    tithes: TithesViewData | undefined
    isLoading: boolean
    pagination?: DataTablePaginationProps
}

export default function TithesView({ tithes, isLoading, pagination }: ViewProps) {
    const rows = tithes?.rows ?? tithes?.data ?? []
    const config = tithes?.config ?? tithes?.meta?.config

    const tableOptions = {
        selectable: true,
    }

    return (
        <div className="flex-1 flex">
            {isLoading ? (
                <TableSkeleton />
            ) : (
                <div className="w-full h-full flex flex-col gap-4">
                    <div className="w-full hidden _flex justify-between items-center">
                        <div></div>
                        <div className="h-fit flex items-center gap-x-2">
                            <Button asChild variant="outline" className="h-fit">
                                <Link
                                    href={apiRoutes.downloadTemplate.attendance}
                                >
                                    <HugeiconsIcon icon={DownloadCircle01Icon} strokeWidth={2} className="size-4.5" />
                                    Download Template
                                </Link>
                            </Button>
                        </div>
                    </div>

                    <DataTable
                        data={rows as TitheRecord[]}
                        config={config}
                        options={tableOptions}
                        rowHeight={36}
                        footerData={undefined}
                        totalRows={tithes?.count ?? rows.length}
                        currentPage={pagination?.currentPage}
                        pageSize={pagination?.pageSize}
                        pageSizeOptions={pagination?.pageSizeOptions}
                        onPageChange={pagination?.onPageChange}
                        onPageSizeChange={pagination?.onPageSizeChange}
                        expandedRow={(row) => (
                            <p className="text-sm text-wrap text-gray-700">
                                {row.notes ? row.notes : "No additional notes for this record."}
                            </p>
                        )}
                    />
                </div>
            )}
        </div>
    )
}



type TableSkeletonProps = {
    rows?: number
    columns?: number
}

export function TableSkeleton({
    rows = 8,
    columns = 5,
}: TableSkeletonProps) {
    return (
        <div className="w-full space-y-3">
            {/* Header */}
            <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
                {Array.from({ length: columns }).map((_, i) => (
                    <Skeleton key={i} className="h-4 w-3/4" />
                ))}
            </div>

            {/* Rows */}
            <div className="space-y-2">
                {Array.from({ length: rows }).map((_, rowIndex) => (
                    <div
                        key={rowIndex}
                        className="grid gap-4 items-center"
                        style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
                    >
                        {Array.from({ length: columns }).map((_, colIndex) => (
                            <Skeleton
                                key={colIndex}
                                className="h-4 w-full"
                            />
                        ))}
                    </div>
                ))}
            </div>
        </div>
    )
}
