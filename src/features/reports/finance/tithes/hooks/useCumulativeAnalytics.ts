"use client"

import { useQuery } from "@tanstack/react-query"
import { apiRoutes } from "@/config/urls"
import type { TithesAnalyticsResponse } from "../types"
import { useActiveAssemblyId } from "@/hooks/query/use-user"
import { assemblyQueryKeys } from "@/lib/query-keys"

export function useCumulativeAnalytics({
    reportId,
    period,
    scopeFilters,
}: {
    reportId: string | null
    period: string
    scopeFilters: Record<string, string | null>
}) {
    const assemblyId = useActiveAssemblyId()
    return useQuery<TithesAnalyticsResponse>({
        queryKey: assemblyQueryKeys.key(assemblyId, "report-cumulative-tithes-analytics", reportId, period, scopeFilters),
        enabled: Boolean(assemblyId && reportId),
        queryFn: async () => {
            const params = new URLSearchParams({ period })

            for (const [key, value] of Object.entries(scopeFilters)) {
                if (value) params.set(key, value)
            }

            const response = await fetch(
                `${apiRoutes.reports.tithes.analytics(reportId as string)}?${params.toString()}`,
                { credentials: "include" },
            )

            if (!response.ok) {
                throw new Error("Could not load cumulative tithe analytics.")
            }

            return await response.json() as TithesAnalyticsResponse
        },
    })
}
