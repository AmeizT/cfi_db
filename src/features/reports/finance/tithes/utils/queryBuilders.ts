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

const RELATIVE_URL_BASE = "http://tithes-relative.invalid"

function createEndpointUrl(endpoint: string) {
    const isAbsolute = /^https?:\/\//i.test(endpoint)
    const isRootRelative = endpoint.startsWith("/")

    if (!isAbsolute && !isRootRelative) {
        throw new TypeError(
            `Tithes API endpoint must be an absolute HTTP(S) URL or a root-relative path: ${endpoint || "<empty>"}`
        )
    }

    return {
        isAbsolute,
        url: new URL(endpoint, RELATIVE_URL_BASE),
    }
}

function serializeEndpointUrl(url: URL, isAbsolute: boolean) {
    return isAbsolute
        ? url.toString()
        : `${url.pathname}${url.search}${url.hash}`
}

export function buildTithesActionQuery(searchParams: URLSearchParams, endpoint: string) {
    const { isAbsolute, url } = createEndpointUrl(endpoint)

    for (const key of TITHES_QUERY_PARAMS) {
        const value = searchParams.get(key)
        if (value) url.searchParams.set(key, value)
    }

    return serializeEndpointUrl(url, isAbsolute)
}

export function buildReportTithesQuery(
    reportId: string,
    searchParams: URLSearchParams,
    status: TitheStatusFilter
) {
    const { isAbsolute, url } = createEndpointUrl(
        apiRoutes.reports.tithes.list(reportId)
    )

    for (const key of TITHES_QUERY_PARAMS) {
        const value = searchParams.get(key)
        if (value) url.searchParams.set(key, value)
    }

    url.searchParams.set("status", status)

    return serializeEndpointUrl(url, isAbsolute)
}
