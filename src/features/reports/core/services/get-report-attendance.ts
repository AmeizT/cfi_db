"use server"

import { apiRoutes } from "@/config/urls"
import { AttendanceResponse } from "@/dal/types"
import { cookies } from "next/headers"

export async function getReportAttendance(reportId: string): Promise<AttendanceResponse> {
    const cookieStore = await cookies()

    try {
        const response = await fetch(`${apiRoutes.reports.detail(reportId)}attendance`, {
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