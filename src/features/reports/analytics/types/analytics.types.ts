import { TableSchema } from "@/features/data-table/types/tableSchema.types";

export type KPIItem = {
    label: string
    value: string | number
    trend?: number
    pathname?: string
}

type Heading = {
    title: string
    description: string
}

export type ChartSeries = {
    key: string
    label: string
    color: string
}

export type TableColumn<T = unknown> = {
    key: keyof T | string
    label: string
    render?: (row: T) => React.ReactNode
    className?: string
}

interface PerformanceInsightData {
    month: string
    value: string
    change: number
    advice: string
}

export type KPIWithChart = {
    key: string
    label: string
    value: string | number
    pathname: string
    chart: {
        xKey: string
        series: ChartSeries[]
    }
}

export type AnalyticsConfig = {
    title: string
    kpis: KPIItem[]
    sections?: {
        headings: {
            chart: Heading
            table: Heading
        }
    }

    chart: {
        xKey: string
        series: ChartSeries[]
    }

    kpisWithChart?: KPIWithChart[]

    table?: TableSchema

    insight?: {
        title: string
        value: string
        meta?: string
    }

    performance?: {
        best: PerformanceInsightData
        worst: PerformanceInsightData
    }
}

