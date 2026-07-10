"use server"

import { apiRoutes } from "@/config/urls"
import { AttendanceResponse } from "@/dal/types"
import { cookies } from "next/headers"

type PaginationParams = {
    page?: number
    pageSize?: number
}

function buildPaginationQuery(pagination?: PaginationParams) {
    const params = new URLSearchParams()

    if (pagination?.page) {
        params.set("page", String(pagination.page))
    }

    if (pagination?.pageSize) {
        params.set("page_size", String(pagination.pageSize))
    }

    const query = params.toString()
    return query ? `?${query}` : ""
}

export async function getReportAttendance(
    reportId: string,
    pagination?: PaginationParams
): Promise<AttendanceResponse> {
    const cookieStore = await cookies()
    const query = buildPaginationQuery(pagination)

    try {
        const response = await fetch(`${apiRoutes.reports.detail(reportId)}attendance/${query}`, {
            headers: {
                Cookie: cookieStore.toString(),
            },
            cache: "no-store",
        })
        if (!response.ok) {
            throw new Error("Failed to fetch attendance report. Please try again later.")
        }
        const attendance = await response.json()
        return attendance
    } catch (error) {
        throw error
    }
}
