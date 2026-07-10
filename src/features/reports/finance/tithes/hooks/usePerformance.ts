"use client"

import { useSearchParams } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { apiRoutes } from "@/config/urls"
import type { PerformanceResponse, PerformanceResult, PerformanceRow } from "../types"
import { getResponseConfig } from "../utils/helpers"
import { buildTithesActionQuery } from "../utils/queryBuilders"

function normalizePerformanceResponse(response: PerformanceResponse): PerformanceResult {
    const row = response.data ?? {
        id: 1,
        target: response.target,
        actual: response.actual,
        remaining: response.remaining,
        achievement: response.achievement,
        detail: response.detail,
    }
    const rows = (response.results ?? [row]).map((item, index): PerformanceRow => ({
        id: item.id ?? index + 1,
        target: item.target,
        actual: item.actual,
        remaining: item.remaining,
        achievement: item.achievement,
        detail: item.detail,
    }))

    return {
        response,
        rows,
        config: getResponseConfig(response),
    }
}

export function usePerformance(reportId: string | null, enabled: boolean) {
    const searchParams = useSearchParams()
    const searchKey = searchParams.toString()

    return useQuery<PerformanceResult>({
        queryKey: ["report-tithe-performance", reportId, searchKey],
        enabled: enabled && Boolean(reportId),
        queryFn: async () => {
            const params = new URLSearchParams(searchKey)
            const response = await fetch(
                buildTithesActionQuery(params, apiRoutes.reports.tithes.performance(reportId as string)),
                { credentials: "include" },
            )

            if (!response.ok) {
                throw new Error("Could not load tithe performance.")
            }

            return normalizePerformanceResponse(await response.json() as PerformanceResponse)
        },
    })
}
