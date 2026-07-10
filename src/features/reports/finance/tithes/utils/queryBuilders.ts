import { apiRoutes } from "@/config/urls"
import type { TitheStatusFilter } from "../types"

const TITHES_QUERY_PARAMS = [
    "year",
    "month",
    "period",
    "region_id",
    "zone_id",
    "zone",
    "country",
    "assembly_id",
    "assembly",
    "section",
    "module",
    "search",
    "ordering",
    "sort",
    "page",
    "page_size",
] as const

export function buildTithesActionQuery(searchParams: URLSearchParams, endpoint: string) {
    const url = new URL(endpoint)

    for (const key of TITHES_QUERY_PARAMS) {
        const value = searchParams.get(key)
        if (value) url.searchParams.set(key, value)
    }

    return url.toString()
}

export function buildReportTithesQuery(
    reportId: string,
    searchParams: URLSearchParams,
    status: TitheStatusFilter
) {
    const url = new URL(apiRoutes.reports.tithes.list(reportId))

    for (const key of TITHES_QUERY_PARAMS) {
        const value = searchParams.get(key)
        if (value) url.searchParams.set(key, value)
    }

    url.searchParams.set("status", status)

    return url.toString()
}
