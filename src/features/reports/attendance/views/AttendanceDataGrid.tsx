"use client"

import React from "react"
import { Attendance, AttendanceResponse } from "@/dal/types"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { DataTable } from "../../core/components/DataTable"
import { Flex } from "@/components/ui/box"
import { ViewIcon } from "@hugeicons/core-free-icons"
import type { DataTablePaginationProps } from "../../core/components/DataTable.types"
import { attendanceRecordPath } from "@/config/app-routes"
import { ReportDataToolbarControls, ReportSummarizeAction } from "../../core/components/ReportDataToolbar"
import type { ModulePageContext } from "../../modules/types/report-modules"
import { reportAttendanceQueryKey } from "../../core/hooks/use-attendance"
import { useActiveAssemblyId } from "@/hooks/query/use-user"
import { EmptyState } from "@/components/ui/empty-state"
import { attendanceReportingWeek } from "../utils/reporting-week"

interface ViewProps {
    attendance: (AttendanceResponse & {
        count?: number
        results?: Attendance[]
    }) | undefined
    isLoading: boolean
    pagination?: DataTablePaginationProps
    service?: "main-service" | "homecell" | "midweek" | "special-services"
    reportId?: string
    pageContext?: ModulePageContext
    readOnly?: boolean
    reportingPeriod?: { start: string; end: string }
}

const slugify = (value: string) =>
    value.toLowerCase().trim().replace(/\s+/g, "-")

export default function AttendanceView({
    attendance,
    isLoading,
    pagination,
    service = "main-service",
    reportId,
    pageContext = "reports",
    readOnly = false,
    reportingPeriod,
}: ViewProps) {
    const assemblyId = useActiveAssemblyId()
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

    const tableOptions = {
        selectable: true,
    }
    const search = searchParams.get("search") ?? undefined
    const mutationQueryKey = reportAttendanceQueryKey(assemblyId, reportId ?? "", {
        page: pagination?.currentPage,
        pageSize: pagination?.pageSize,
        search,
    })
    const showWorkspaceToolbar = pageContext === "workspace"
    const getWeekGroup = React.useCallback((row: Attendance) =>
        attendanceReportingWeek(row.timestamp, reportingPeriod?.start, reportingPeriod?.end),
    [reportingPeriod?.start, reportingPeriod?.end])

    return (
        <Flex className="w-full" direction="column" gap={4}>
            <DataTable
                variant="advanced"
                data={filteredAttendance}
                getRowGroup={service === "homecell" ? getWeekGroup : undefined}
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
                mutationQueryKey={mutationQueryKey}
                editingDisabled={readOnly}
                enableDelete={!readOnly}
                totalRows={attendance?.count ?? filteredAttendance.length}
                currentPage={pagination?.currentPage}
                pageSize={pagination?.pageSize}
                pageSizeOptions={pagination?.pageSizeOptions}
                onPageChange={pagination?.onPageChange}
                onPageSizeChange={pagination?.onPageSizeChange}
                emptyState={
                    <EmptyState
                        type="reports"
                        title={service === "homecell" ? "No Homecell attendance yet" : "No attendance yet"}
                        description={service === "homecell"
                            ? "No Homecell attendance is available in the current report results."
                            : "Attendance recorded for this service will appear here."}
                    />
                }
                toolbarLeading={showWorkspaceToolbar ? (
                    <ReportDataToolbarControls
                        section="ministry"
                        module="attendance"
                        pageContext={pageContext}
                        monthlySubmodule={service === "main-service" ? null : service}
                        cumulativeUpdates={{ service }}
                        label="Attendance"
                    />
                ) : undefined}
                toolbarSupplementalActions={showWorkspaceToolbar
                    ? <ReportSummarizeAction label="Attendance" />
                    : undefined}
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
