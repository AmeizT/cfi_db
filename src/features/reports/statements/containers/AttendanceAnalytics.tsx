"use client"

import { parseTab } from "@/utils/parse-tab"
import { useSearchParams } from "next/navigation"
import { useAttendanceAnalytics } from "../../core/hooks/use-analytics"
import { AnalyticsDashboard } from "../../analytics/components/AnalyticsDashboard"
import { useAttendanceConfig } from "../../analytics/config/attendance"
import { AttendanceStatement } from "../types/summary.types"

export type BaseStatement = {
    report_id?: string | number | null
    month: string
    label?: string | null
}

export type NormalizedStatement = {
    id: string
    report_id?: string
    month: string
    label?: string
}

export function normalizeStatement<T extends BaseStatement>(
    statements?: T[]
): NormalizedStatement[] {
    if (!statements) return []

    return statements.map((s) => ({
        id: String(s.report_id ?? s.month),
        report_id: String(s.report_id) != null ? String(s.report_id) : undefined,
        month: String(s.month),
        label: s.label?.slice(0, 3) ?? undefined,
    }))
}

const formatStatements = (statements?: AttendanceStatement[]) =>
    statements?.map((s) => ({
        ...s,
        id: String(s.report_id ?? s.month),
        report_id: s.report_id != null ? String(s.report_id) : undefined,
        month: s.month,
        label: s.label?.slice(0, 3),
    })) ?? []

export function AttendanceAnalytics() {
    const searchParams = useSearchParams()
    const currentYear = new Date().getFullYear().toString()
    const period = searchParams.get("period") ?? currentYear
    const { sub: year } = parseTab(period)
    const { data: attendanceAnalytics } = useAttendanceAnalytics(year ?? currentYear)
    const statements = formatStatements(attendanceAnalytics?.data?.statements)

    return (
        <AnalyticsDashboard 
            data={statements} 
            config={useAttendanceConfig()} 
            activeIndex={1}
        />
    )
}