"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Attendance, AttendanceResponse } from "@/dal/types"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { DataTable } from "../../core/components/DataTable"
import { Flex } from "@/components/ui/box"
import { ViewIcon } from "@hugeicons/core-free-icons"
import type { DataTablePaginationProps } from "../../core/components/DataTable.types"
import { attendanceRecordPath } from "@/config/app-routes"

interface ViewProps {
    attendance: (AttendanceResponse & {
        count?: number
        results?: Attendance[]
    }) | undefined
    isLoading: boolean
    pagination?: DataTablePaginationProps
    service?: "main-service" | "homecell" | "midweek" | "special-services"
}

const slugify = (value: string) =>
    value.toLowerCase().trim().replace(/\s+/g, "-")

export default function AttendanceView({ attendance, isLoading, pagination, service = "main-service" }: ViewProps) {
    const pathname = usePathname()
    const router = useRouter()
    const searchParams = useSearchParams()
    const attendanceRows = React.useMemo(() => {
        const rows = attendance?.results ?? attendance?.data ?? []

        if (service === "special-services") {
            return rows.filter((row) => row.is_special_event)
        }

        const aliases = {
            "main-service": ["sunday", "main-service", "main-service/sunday"],
            homecell: ["homecell", "home-cell"],
            midweek: ["midweek", "mid-week"],
        }[service]

        return rows.filter((row) => {
            if (row.is_special_event) return false
            return aliases.includes(slugify(row.service_type?.trim() || ""))
        })
    }, [attendance, service])

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
    const activeSheet = searchParams.get("sheet") || firstKey || "sunday"
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

    const openRecordDetails = React.useCallback((row: Attendance) => {
        const query = searchParams.toString()
        const returnTo = `${pathname}${query ? `?${query}` : ""}`
        const detailBase = pathname.startsWith("/engagement/")
            ? attendanceRecordPath(row.id)
            : `/reports/ministry/attendance/records/${row.id}`
        const detailParams = new URLSearchParams({ return_to: returnTo })

        router.push(`${detailBase}?${detailParams.toString()}`)
    }, [pathname, router, searchParams])

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

    const tableOptions = {
        selectable: true,
    }

    return (
        <Flex className="w-full" direction="column" gap={4}>
            <DataTable
                variant="advanced"
                data={filteredAttendance}
                config={attendance?.config}
                options={tableOptions}
                isLoading={isLoading}
                loadingMode="overlay"
                rowHeight={36}
                onRowClick={openRecordDetails}
                rowActions={(row) => [
                    {
                        label: "Open details",
                        icon: ViewIcon,
                        variant: "default",
                        onClick: () => openRecordDetails(row),
                    },
                ]}
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
