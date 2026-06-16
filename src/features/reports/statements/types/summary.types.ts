import { TableSchema } from "@/features/data-table/types/tableSchema.types";

export type ViewType = "quarter"

export type TrendType = "stable" | "increase" | "decrease"

export type MonthNumber =
    | 1 | 2 | 3 | 4 | 5 | 6
    | 7 | 8 | 9 | 10 | 11 | 12

export interface BaseStatement {
    month: MonthNumber
    label: string
    report_id: number | null
    is_missing: boolean
}

export interface AttendanceStatement extends BaseStatement {
    adults: number
    children: number
    guests: number
    total: number
}

export interface TithesQuarterStatement extends 
    BaseStatement, 
    TitheStatement {
        total: number
        givers: number
        average: number
    }

interface TitheStatement {
    average: number
    change: number
    givers: number
    givers_fluctuation: number
    highest_amount: number
    lapsed_givers: number
    median: number
    new_givers: number
    previous_total: number
    repeat_givers: number
    total: number
}

export interface TithesAnalyticsStatement extends TitheStatement {
    label: string
    month: number
}

export interface PreviousQuarter {
    year: number
    quarter: number
    total: number | null
}

export interface HeatmapItem {
    month: MonthNumber
    intensity: number
}

export interface BaseMeta<T extends BaseStatement, K> {
    quarter_change: number | null
    trend: TrendType
    previous_quarter: PreviousQuarter
    forecast: number | null
    target: number | null
    heatmap: HeatmapItem[]
    kpis: K | null
    insights: {
        best_month: T | null
        worst_month: T | null
    }
    table_schema: TableSchema
}

export interface AttendanceKpis {
    total_adults: number
    total_children: number
    total_guests: number
    total_online_viewers: number
    total_attendance: number
    average_attendance: number
    median_attendance: number
}

export interface TithesKpis {
    total: number
    givers: number
    average: number
    median: number

    previous_total: number
    change: number

    givers_fluctuation: number
    highest_amount: number

    new_givers: number
    repeat_givers: number
    lapsed_givers: number
}

export interface CashflowKpis {
      total_revenue: number
      total_expense: number
      net_cashflow: number
      months_with_data: number
      missing_months: number
}

export interface FinanceSummary extends BaseStatement {
  revenue_total: number;
  expense_total: number;
  balance: number;
  previous_balance: number;
  change: number;
}

export type AttendanceMeta = BaseMeta<AttendanceStatement, AttendanceKpis>
export type TithesMeta = BaseMeta<TithesQuarterStatement, TithesKpis>

export interface QuarterData<T extends BaseStatement> {
    view: ViewType
    year: number
    quarter: number
    start: string
    end: string
    statements: T[]
}

export interface QuarterResponse<T extends BaseStatement, K> {
    data: QuarterData<T>
    meta: BaseMeta<T, K>
}

