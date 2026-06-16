import { CashflowRow } from "./cashflow"

export type ColumnMeta = {
    options?: string[]
}

export type TableColumn = {
    id: string
    label: string
    formatter?: "date" | "currency"
    editable?: boolean
    isFooterSum?: boolean
    cellClass?: string
    meta?: ColumnMeta
}

export type TableFooter = {
    enabled: boolean
    sumFields: string[]
}

export type TableVariant = {
    mode: "grid" | "list"
    border: "subtle" | "none" | "strong"
    theme: "neutral" | "light" | "dark"
    interaction: {
        editable: boolean
        selectable: boolean
        density: "compact" | "default" | "comfortable"
    }
}

export type TableColumnKey = keyof CashflowRow

export type TypedTableColumn = {
    id: TableColumnKey
    label: string
    formatter?: "date" | "currency"
    editable?: boolean
    isFooterSum?: boolean
    cellClass?: string
    meta?: ColumnMeta
}