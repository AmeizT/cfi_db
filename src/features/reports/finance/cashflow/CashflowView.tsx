"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { HugeiconsIcon } from "@hugeicons/react"
import { DownloadCircle01Icon } from "@hugeicons/core-free-icons"
import { apiRoutes } from "@/config/urls"
import { DataTable } from "../../core/components/DataTable"

interface ViewProps {
    cashflow: CashflowResponse | undefined
    isLoading: boolean
}

export default function CashFlowView({ cashflow, isLoading }: ViewProps) {
    const handleCellEdit = (rowIndex: number, columnId: string, value: unknown) => {
        console.log("Edited cell:", { rowIndex, columnId, value })
    }

    return (
        <div className="flex-1 flex">
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
                    data={cashflow?.data?.rows?.map((row, index) => ({ ...row, id: index })) || []}
                    config={cashflow?.config as TableSchema}
                    rowHeight={36}
                    onCellEdit={handleCellEdit}
                    footerData={undefined}
                    isLoading={isLoading}
                    emptyState={
                        <EmptyState type={"reports"} />
                    }
                />
            </div>
        </div>
    )
}

import { Skeleton } from "@/components/ui/skeleton"
import { CashflowResponse } from "./types/cashflow"
import { TableSchema } from "@/features/data-table/types/tableSchema.types"
import { Empty } from "@/components/ui/empty"
import { EmptyState } from "@/components/ui/empty-state"

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
