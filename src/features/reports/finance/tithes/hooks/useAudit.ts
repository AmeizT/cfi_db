"use client"

import { useSearchParams } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { apiRoutes } from "@/config/urls"
import type { TableSchema } from "@/features/data-table/types/tableSchema.types"
import type { AuditLogRecord } from "../types"
import { normalizeListResponse } from "../utils/helpers"
import { buildTithesActionQuery } from "../utils/queryBuilders"

type AuditResponse =
    | AuditLogRecord[]
    | {
        count?: number
        results?: AuditLogRecord[]
        data?: AuditLogRecord[]
        table_schema?: TableSchema
        meta?: {
            config?: TableSchema
        }
    }

export function useAudit(reportId: string | null, enabled: boolean) {
    const searchParams = useSearchParams()
    const searchKey = searchParams.toString()

    return useQuery({
        queryKey: ["report-tithe-audit-log", reportId, searchKey],
        enabled: enabled && Boolean(reportId),
        queryFn: async () => {
            const params = new URLSearchParams(searchKey)
            const response = await fetch(
                buildTithesActionQuery(params, apiRoutes.reports.tithes.auditLog(reportId as string)),
                { credentials: "include" },
            )

            if (!response.ok) {
                throw new Error("Could not load tithe audit activity.")
            }

            return normalizeListResponse(await response.json() as AuditResponse)
        },
    })
}
