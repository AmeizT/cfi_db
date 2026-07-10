import type { ReadonlyURLSearchParams } from "next/navigation"
import type { TableSchema } from "@/features/data-table/types/tableSchema.types"
import type { TitheStatusFilter, TithesRouteView } from "../types"

export const BASE_PATH = "/reports/finance/tithes"
const LEGACY_BASE_PATH = "/reports/finance/tithers"

export const MONTHS = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
]

const VALID_STATUS = new Set<TitheStatusFilter>(["active", "voided", "deleted"])

type NormalizableListResponse<T, M extends { config?: TableSchema; table_schema?: TableSchema } = { config?: TableSchema; table_schema?: TableSchema }> =
    | T[]
    | {
        count?: number
        results?: T[]
        data?: T[]
        config?: TableSchema
        table_schema?: TableSchema
        meta?: M
    }

export function getStatus(searchParams: URLSearchParams | ReadonlyURLSearchParams): TitheStatusFilter {
    const status = searchParams.get("status")
    return VALID_STATUS.has(status as TitheStatusFilter)
        ? status as TitheStatusFilter
        : "active"
}

export function getReportId(searchParams: URLSearchParams | ReadonlyURLSearchParams) {
    return (
        searchParams.get("reportid") ??
        searchParams.get("reportId") ??
        searchParams.get("report_id") ??
        searchParams.get("id")
    )
}

export function getSelectedYear(searchParams: URLSearchParams | ReadonlyURLSearchParams) {
    const year = Number(searchParams.get("year"))
    if (Number.isInteger(year)) return year

    const period = searchParams.get("period")
    const periodYear = period?.match(/\d{4}/)?.[0]

    return periodYear ? Number(periodYear) : new Date().getFullYear()
}

export function getVisibleMonthCount(year: number) {
    const now = new Date()
    if (year > now.getFullYear()) return 0
    if (year < now.getFullYear()) return 12
    return now.getMonth() + 1
}

export function getViewFromPathname(pathname: string): TithesRouteView {
    const segment = [BASE_PATH, LEGACY_BASE_PATH]
        .map((basePath) => pathname.split(`${basePath}/`)[1]?.split("/")[0])
        .find(Boolean)

    if (
        segment === "contributors"
        || segment === "cumulative"
        || segment === "performance"
        || segment === "receipts"
        || segment === "audit-log"
    ) {
        return segment
    }

    return "records"
}

export function getResponseConfig(
    response: {
        config?: TableSchema
        table_schema?: TableSchema
        meta?: { config?: TableSchema; table_schema?: TableSchema }
    }
) {
    return response.meta?.config ?? response.meta?.table_schema ?? response.table_schema ?? response.config
}

export function normalizeListResponse<T, M extends { config?: TableSchema; table_schema?: TableSchema } = { config?: TableSchema; table_schema?: TableSchema }>(
    response: NormalizableListResponse<T, M>
) {
    if (Array.isArray(response)) {
        return {
            rows: response,
            results: response,
            data: response,
            count: response.length,
            config: undefined,
            table_schema: undefined,
            meta: undefined,
        }
    }

    const rows = response.results ?? response.data ?? []
    const config = getResponseConfig(response)

    return {
        rows,
        results: rows,
        data: rows,
        count: response.count ?? rows.length,
        config,
        table_schema: response.table_schema ?? config,
        meta: response.meta,
    }
}
