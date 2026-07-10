import { DataTableVariant } from "./tableVariant.types"

export type ColumnFormatter =
    | "text"
    | "avatar"
    | "number"
    | "numeric"
    | "currency"
    | "date"
    | "percentage"

export type TableColumnSchema = {
    id: string
    label?: string
    formatter?: ColumnFormatter
    align?: "left" | "right" | "center"
    isFooterSum?: boolean
}

export type TableSchema = {
    intent?: TableIntent
    columns: TableColumnConfig[]
    children?: {
        rowKey: string
        columns: TableColumnConfig[]
    }
    footer?: TableFooterConfig
    variant?: DataTableVariant
}

export type TableIntent =
    | "finance"
    | "attendance"
    | "growth"
    | "ministry"
    | "leadership"
    | "compliance"
    | "risk"
    | "minimal"

export type TableColumnConfig = {
    id: string
    label?: string
    formatter?: ColumnFormatter

    // behavior
    isFooterSum?: boolean
    isNumeric?: boolean

    // styling
    align?: "left" | "center" | "right"
    meta?: {
        align?: "left" | "center" | "right"
        [key: string]: unknown
    }

    // 🔥 future-proof
    type?: "text" | "avatar" | "badge" | "currency" | "date"
    editable?: boolean
}

export type TableFooterConfig = {
    enabled: boolean
    sumFields?: string[]
}
