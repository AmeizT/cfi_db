"use client"

import { useSearchParams } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { apiRoutes } from "@/config/urls"
import type { ContributorResponse, ContributorRowsResult } from "../types"
import { normalizeListResponse } from "../utils/helpers"
import { buildTithesActionQuery } from "../utils/queryBuilders"

export function useContributors(reportId: string | null, enabled: boolean) {
    const searchParams = useSearchParams()
    const searchKey = searchParams.toString()

    return useQuery<ContributorRowsResult>({
        queryKey: ["report-tithe-contributors", reportId, searchKey],
        enabled: enabled && Boolean(reportId),
        queryFn: async () => {
            const params = new URLSearchParams(searchKey)
            const response = await fetch(
                buildTithesActionQuery(params, apiRoutes.reports.tithes.contributors(reportId as string)),
                { credentials: "include" },
            )

            if (!response.ok) {
                throw new Error("Could not load tithe contributors.")
            }

            return normalizeListResponse(await response.json() as ContributorResponse)
        },
    })
}
