import { DataTableVariant } from "./tableVariant.types"

export type ColumnFormatter =
    | "text"
    | "number"
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
    footer?: TableFooterConfig
    variant?: DataTableVariant
}

export type TableIntent =
    | "finance"
    | "attendance"
    | "minimal"

export type TableColumnConfig = {
    id: string
    label?: string
    formatter?: ColumnFormatter

    // behavior
    isFooterSum?: boolean

    // styling
    align?: "left" | "center" | "right"

    // 🔥 future-proof
    type?: "text" | "avatar" | "badge" | "currency" | "date"
    editable?: boolean
}

export type TableFooterConfig = {
    enabled: boolean
    sumFields?: string[]
}