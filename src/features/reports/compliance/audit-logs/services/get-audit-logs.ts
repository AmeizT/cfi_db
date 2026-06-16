"use server"

import { cookies } from "next/headers"
import { apiRoutes } from "@/config/urls"
import { AuditLogsResponse } from "../../../core/schemas/audit/auditLog.types"

export async function getAuditLogs(): Promise<AuditLogsResponse> {
    const cookieStore = await cookies()
    
    const response = await fetch(apiRoutes.reports.auditLogs.list(), {
        method: "GET",
        headers: {
            Cookie: cookieStore.toString(),
        },
        cache: "no-store",
    })

    if (!response.ok) {
        throw new Error(await response.text())
    }

    return response.json()
}