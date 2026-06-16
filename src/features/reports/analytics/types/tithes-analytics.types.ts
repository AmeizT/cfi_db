export interface StatementMetrics {
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

export interface MonthlyStatement extends StatementMetrics {
    month: number
    label: string
}

export type AnalyticsKpis = StatementMetrics

export interface AnalyticsData {
    year: number
    statements: MonthlyStatement[]
}

export interface AnalyticsInsights {
    trend: "upward" | "downward" | "flat"
    best_month: MonthlyStatement
    worst_month: MonthlyStatement
    missing: number
}

export interface AnalyticsMeta {
    insights: AnalyticsInsights
    kpis: AnalyticsKpis
}

export interface TithesAnalyticsResponse {
    data: AnalyticsData
    meta: AnalyticsMeta
}