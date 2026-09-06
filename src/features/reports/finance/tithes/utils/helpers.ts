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

type ListResponseObject<T, M> = {
    count?: number
    next?: string | null
    previous?: string | null
    results?: T[]
    data?: T[]
    config?: TableSchema
    table_schema?: TableSchema
    meta?: M
}

type NestedListResponse<T, M> = {
    data: ListResponseObject<T, M>
    count?: number
    next?: string | null
    previous?: string | null
    config?: TableSchema
    table_schema?: TableSchema
    meta?: M
}

type NormalizableListResponse<
    T,
    M extends { config?: TableSchema; table_schema?: TableSchema } = {
        config?: TableSchema
        table_schema?: TableSchema
    },
> = T[] | ListResponseObject<T, M> | NestedListResponse<T, M>

function isRecord(value: unknown): value is Record<string, unknown> {
    return Boolean(value) && typeof value === "object" && !Array.isArray(value)
}

/** Unwraps the single `data` object used by the supported API envelope. */
export function unwrapDataEnvelope(response: unknown): unknown {
    if (isRecord(response) && isRecord(response.data)) {
        return response.data
    }

    return response
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

    return "transactions"
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
            next: undefined,
            previous: undefined,
            config: undefined,
            table_schema: undefined,
            meta: undefined,
        }
    }

    const responseObject = response as ListResponseObject<T, M>
    const unwrapped = unwrapDataEnvelope(response)
    const payloadObject = isRecord(unwrapped)
        ? unwrapped as ListResponseObject<T, M>
        : responseObject
    const directData = payloadObject.data
    const rows = payloadObject?.results
        ?? (Array.isArray(directData) ? directData : [])
    const config = getResponseConfig(payloadObject) ?? getResponseConfig(responseObject)
    const meta = payloadObject.meta ?? responseObject.meta

    return {
        rows,
        results: rows,
        data: rows,
        count: payloadObject?.count ?? responseObject.count ?? rows.length,
        next: payloadObject.next ?? responseObject.next,
        previous: payloadObject.previous ?? responseObject.previous,
        config,
        table_schema: payloadObject?.table_schema ?? responseObject.table_schema ?? config,
        meta,
    }
}
