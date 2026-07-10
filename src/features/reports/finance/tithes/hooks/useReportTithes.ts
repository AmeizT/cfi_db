"use client"

import { useSearchParams } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import type { TitheListResponse, TitheStatusFilter, TithesListResult } from "../types"
import { normalizeListResponse } from "../utils/helpers"
import { buildReportTithesQuery } from "../utils/queryBuilders"

export function useReportTithes(
    reportId: string | null,
    status: TitheStatusFilter,
    enabled: boolean
) {
    const searchParams = useSearchParams()
    const searchKey = searchParams.toString()

    return useQuery<TithesListResult>({
        queryKey: ["report-tithes", reportId, status, searchKey],
        enabled: enabled && Boolean(reportId),
        queryFn: async () => {
            const params = new URLSearchParams(searchKey)
            const response = await fetch(
                buildReportTithesQuery(reportId as string, params, status),
                { credentials: "include" },
            )

            if (!response.ok) {
                throw new Error("Could not load tithe records.")
            }

            return normalizeListResponse(await response.json() as TitheListResponse)
        },
    })
}
