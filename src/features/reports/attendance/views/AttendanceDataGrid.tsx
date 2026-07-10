"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { HugeiconsIcon } from "@hugeicons/react"
import { Attendance, AttendanceResponse } from "@/dal/types"
import { IconSunHighFilled } from "@tabler/icons-react"
import { usePathname, useSearchParams } from "next/navigation"
import { createQueryString } from "../../core/lib/create-query-string"
import { DataTable } from "../../core/components/DataTable"
import { TableTab } from "../../core/types/tabletabs.type"
import { Flex } from "@/components/ui/box"
import { SunCloud02Icon } from "@hugeicons/core-free-icons";
import type { DataTablePaginationProps } from "../../core/components/DataTable.types"

const columnTypes = {
    currency: (value: number) => `P ${value.toLocaleString()}`,

    weather: (value: string) => {
        const map: Record<string, React.ReactNode> = {
            sunny: <IconSunHighFilled strokeWidth={1.75} className="size-5 text-mist-400" />,
            cloudy: <HugeiconsIcon icon={SunCloud02Icon} size={20} />,
        }

        return (
            <span className="flex items-center gap-1">
                {map[value]}
                <span className="capitalize">{value}</span>
            </span>
        )
    },
}

interface ViewProps {
    attendance: (AttendanceResponse & {
        count?: number
        results?: Attendance[]
    }) | undefined
    isLoading: boolean
    pagination?: DataTablePaginationProps
}

export default function AttendanceView({ attendance, isLoading, pagination }: ViewProps) {
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const activeSheet = searchParams.get("sheet") || "sunday"
    const queryParams = Object.fromEntries(searchParams.entries())
    const attendanceRows = React.useMemo(
        () => attendance?.results ?? attendance?.data ?? [],
        [attendance]
    )

    const slugify = (value: string) =>
      value.toLowerCase().trim().replace(/\s+/g, "-")

    const groupedAttendance = React.useMemo(() => {
      if (!attendanceRows.length) return {}

      return attendanceRows.reduce<Record<string, Attendance[]>>((acc, item) => {
        const rawKey = item.service_type?.trim() || "Other"
        const key = slugify(rawKey)

        if (!acc[key]) acc[key] = []
        acc[key].push(item)

        return acc
      }, {})
    }, [attendanceRows])

    const firstKey = Object.keys(groupedAttendance)[0]
    const currentData = React.useMemo(
        () => groupedAttendance[activeSheet] ?? groupedAttendance[firstKey] ?? [],
        [activeSheet, firstKey, groupedAttendance]
    )

    const status = (searchParams.get("status") ?? "active") as
        | "active"
        | "deleted"

    const filteredAttendance = React.useMemo(() => {
        if (!currentData) return []
        switch (status) {
            case "deleted":
                return currentData.filter((i) => i.is_deleted)
            default:
                return currentData.filter((i) => !i.is_deleted)
        }
    }, [currentData, status])

    const monthlySummary = attendanceRows[0]?.monthly_summary

    const handleCellEdit = (rowIndex: number, columnId: string, value: unknown) => {
        console.log("Edited cell:", { rowIndex, columnId, value })
    }

    const footerDataRecord = monthlySummary ? Object.fromEntries(
        Object.entries(monthlySummary).map(([key, value]) => [key, typeof value === 'number' ? value : 0])
    ) : undefined


    // const COLUMNS: ColumnDef<Attendance>[] = [
    //     {
    //         accessorKey: "timestamp",
    //         header: "Date",
    //         size: 220,
    //         minSize: 220,
    //         maxSize: 300,
    //         cell: ({ row, getValue }) => {
    //             const value = getValue<string>()
    //             const formmattedDate = new Date(value).toLocaleDateString(undefined, {
    //                 month: "long",
    //                 day: "numeric",
    //                 year: "numeric",
    //             })

    //             return (
    //                 <div className="w-full h-full flex gap-2 justify-between items-center">
    //                     <EditableCell<Attendance, "timestamp">
    //                         value={formmattedDate}
    //                         rowIndex={row.index}
    //                         columnId="timestamp"
    //                         onSave={updateRow}
    //                     />

    //                     <div className="w-fit">
    //                         <button
    //                             className="w-5 h-5 flex justify-center items-center gap-1 border border-mist-400/60 bg-white rounded-md opacity-0 group-hover:opacity-100 hover:bg-mist-200 shadow-[0_1px_3px_rgba(22,27,29,0.08),0_1px_2px_rgba(22,27,29,0.05)] cursor-pointer"
    //                             onClick={(e) => {
    //                                 e.stopPropagation()
    //                                 handleRowClick(row.original)
    //                             }}
    //                         >
    //                             <IconArrowsDiagonal strokeWidth={2.75} className="size-3 text-mist-400 group-hover:text-mist-500" />
    //                         </button>
    //                     </div>
    //                 </div>
    //             )
    //         },
    //     },
    //     
    //     {
    //         accessorKey: "weather",
    //         header: "Weather",
    //         cell: ({ row, getValue }) => {
    //             const value = getValue<
    //                 | "sunny"
    //                 | "partly_cloudy"
    //                 | "cloudy"
    //                 | "windy"
    //                 | "light_rain"
    //                 | "heavy_rain"
    //                 | "storm"
    //                 | "very_hot"
    //                 | "cold"
    //                 | "extreme"
    //                 | null
    //                 | undefined
    //             >()

    //             return (
    //                 <EditableCell<Attendance, "weather">
    //                     value={(value ?? "") as "sunny" | "partly_cloudy" | "cloudy" | "windy" | "light_rain" | "heavy_rain" | "storm" | "very_hot" | "cold" | "extreme" | ""}
    //                     rowIndex={row.index}
    //                     columnId="weather"
    //                     onSave={updateRow}
    //                     formatter={(val: string | null | undefined) => {
    //                         return columnTypes.weather(val ?? "")
    //                     }}
    //                 />
    //             )
    //         },
    //     },
    // ]

    const tableTabs = (grouped: Record<string, unknown>): TableTab[] => {
        return Object.keys(grouped).map((slug) => ({
            id: slug,
            label: slug.replace(/-/g, " "),
            pathname: `${pathname}?${createQueryString(searchParams, { sheet: slug })}`,
        }))
    }
    
    const tableOptions = {
        selectable: true,
    }

    return (
        <Flex className="w-full" direction="column" gap={4}>
            <DataTable
                data={filteredAttendance}
                config={attendance?.config}
                options={tableOptions}
                isLoading={isLoading}
                loadingMode="overlay"
                rowHeight={36}
                onCellEdit={handleCellEdit}
                footerData={undefined}
                resource="attendance"
                totalRows={attendance?.count ?? filteredAttendance.length}
                currentPage={pagination?.currentPage}
                pageSize={pagination?.pageSize}
                pageSizeOptions={pagination?.pageSizeOptions}
                onPageChange={pagination?.onPageChange}
                onPageSizeChange={pagination?.onPageSizeChange}
                emptyState={
                    <div className="text-center">
                        <p>No attendance yet</p>
                        <Button>Add first record</Button>
                    </div>
                }
                expandedRow={(row) => (
                    <div className="flex flex-col">
                        <p className="text-sm text-wrap text-gray-700">
                            {row.scriptures ? row.scriptures : "No additional notes for this record."}
                        </p>

                        <p className="text-sm text-wrap text-gray-700">
                            {row.sermon ? row.sermon : "No additional notes for this record."}
                        </p>
                    </div>
                )}
            />
        </Flex>
    )
}
