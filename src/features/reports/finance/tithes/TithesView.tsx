"use client"

import React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { HugeiconsIcon } from "@hugeicons/react"
import { DownloadCircle01Icon } from "@hugeicons/core-free-icons"
import { Tithe, TitheConfig } from "@/dal/types"
import { apiRoutes } from "@/config/urls"
import { DataTable } from "../../core/components/DataTable"
import { RecordDrawer } from "../../core/components/RecordDrawer"
import { Skeleton } from "@/components/ui/skeleton"
import { Widget } from "@/components/ui/widget";

interface ViewProps {
    tithes: TitheConfig | undefined
    isLoading: boolean
}

export default function TithesView({ tithes, isLoading }: ViewProps) {
    const [sheetOpen, setSheetOpen] = React.useState(false)
    const [selectedRow, setSelectedRow] = React.useState<Tithe | null>(null)

    function handleRowClick(row: Tithe) {
        setSelectedRow(row)
        setSheetOpen(true)
    }

    const handleCellEdit = (rowIndex: number, columnId: string, value: unknown) => {
        console.log("Edited cell:", { rowIndex, columnId, value })
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
                        data={tithes?.data || []}
                        config={tithes?.config}
                        rowHeight={36}
                        onCellEdit={handleCellEdit}
                        footerData={undefined}
                        expandedRow={(row) => (
                            <p className="text-sm text-wrap text-gray-700">
                                {row.notes ? row.notes : "No additional notes for this record."}
                            </p>
                        )}
                    />

                    

                    {/* {selectedRow && (
                        <RecordDrawer
                            rowData={selectedRow}
                            open={sheetOpen}
                            onClose={() => setSheetOpen(false)}
                            onUpdateRow={(row) => console.log(row)}
                            displayKeys={[
                                'timestamp',
                                'amount',
                                'payment_method',
                                'reference_code',
                                'notes'
                            ]}
                        />
                    )} */}
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
