import type { Tithe } from "@/dal/types"
import type { TableSchema } from "@/features/data-table/types/tableSchema.types"
import type {
    QuarterResponse,
    TithesKpis,
    TithesQuarterStatement,
} from "@/features/reports/statements/types/summary.types"

export type TitheStatusFilter = "active" | "voided" | "deleted"

export type TithesRouteView =
    | "records"
    | "cumulative"
    | "contributors"
    | "receipts"
    | "performance"
    | "audit-log"

export type TitheRecord = Tithe & {
    member_name?: string | null
    member_avatar?: string | null
    member_avatar_fallback?: string | null
    status?: string
    deleted_at?: string | null
    void_reason?: string
    voided_by?: string | number | null
    voided_at?: string | null
    deleted_by?: string | number | null
    delete_reason?: string
    recorded_by?: string | { full_name?: string; email?: string } | null
    receipt_number?: string
    delivery_status?: string
    generated_at?: string | null
    email_sent_at?: string | null
}

export type TitheListResponse =
    | TitheRecord[]
    | {
        count?: number
        results?: TitheRecord[]
        data?: TitheRecord[]
        config?: TableSchema
        table_schema?: TableSchema
        meta?: TithesMeta
    }

export type TithesMeta = {
    config?: TableSchema
    table_schema?: TableSchema
    tithes_auto_sum?: string | number
    [key: string]: unknown
}

export type TithesListResult = {
    rows: TitheRecord[]
    results: TitheRecord[]
    data: TitheRecord[]
    count: number
    config?: TableSchema
    table_schema?: TableSchema
    meta?: TithesMeta
}

export type AuditLogRecord = {
    id: number
    action: string
    description?: string | null
    model?: string
    object_id?: number
    user_name?: string
    user_email?: string
    timestamp: string
    old_data?: Record<string, unknown> | null
    new_data?: Record<string, unknown> | null
}

export type ContributorHistoryRecord = {
    id?: string | number
    month: string
    month_number: number
    amount: string | number
    payment_method: string | null
    recorded_by: string | null
    recorded_date: string | null
    receipt: string | null
}

export type ContributorRecord = {
    member_id: number | null
    contributor: string
    contributor_avatar?: string | null
    contributor_avatar_fallback?: string | null
    cumulative: string | number
    median: string | number
    interval: "Weekly" | "Monthly" | "Irregular" | null
    average_payment_date: string | null
    commitment: string | number | null
    status: string | null
    history: ContributorHistoryRecord[]
    this_month?: string | number
    year_to_date?: string | number
    first_contribution?: string | null
    last_contribution?: string | null
    average_contribution?: string | number
    receipt_preference?: string | null
}

export type ContributorMeta = {
    total_contributors?: number
    cumulative_tithes?: string | number
    average_contribution?: string | number
    new_contributors?: number
    config?: TableSchema
    table_schema?: TableSchema
    period?: {
        year: number
        month: number
    }
}

export type ContributorResponse =
    | ContributorRecord[]
    | {
        count?: number
        results?: ContributorRecord[]
        data?: ContributorRecord[]
        table_schema?: TableSchema
        meta?: ContributorMeta
    }

export type ContributorRowsResult = {
    rows: ContributorRecord[]
    results: ContributorRecord[]
    data: ContributorRecord[]
    count: number
    meta?: ContributorMeta
    config?: TableSchema
    table_schema?: TableSchema
}

export type PerformanceResponse = {
    target: string | number | null
    actual: string | number
    remaining?: string | number | null
    achievement?: string | number | null
    detail?: string
    period: {
        year: number
        month: number
    }
    data?: PerformanceRow
    results?: PerformanceRow[]
    table_schema?: TableSchema
    meta?: {
        config?: TableSchema
        table_schema?: TableSchema
        [key: string]: unknown
    }
}

export type PerformanceRow = {
    id: number
    target: string | number | null
    actual: string | number
    remaining?: string | number | null
    achievement?: string | number | null
    detail?: string
}

export type PerformanceResult = {
    response: PerformanceResponse
    rows: PerformanceRow[]
    config?: TableSchema
}

export type TithesAnalyticsResponse = QuarterResponse<TithesQuarterStatement, TithesKpis> & {
    table_schema?: TableSchema
    meta?: QuarterResponse<TithesQuarterStatement, TithesKpis>["meta"] & {
        config?: TableSchema
    }
}

export type CumulativeTableRow = {
    id: number
    label: string
    total: string | number
    previous_total?: string | number
    change?: string | number
    givers?: string | number
    median?: string | number
    highest_amount?: string | number
}
