import { TableColumn, TableFooter, TableVariant } from "./schema"

export type CashflowTableConfig = {
    intent: "finance"
    columns: TableColumn[]
    footer: TableFooter
    variant: TableVariant
}

export type CashflowType = "revenue" | "expense"
export type CashflowSubtype = "overhead" | "variable" | null

export type CashflowRow = {
  date: string | null
  description: string
  type: CashflowType
  subtype: CashflowSubtype
  amount: number
  balance: number
}

export type CashflowTotals = {
  revenue: number
  expenses: number
  balance: number
}

export type CashflowData = {
  rows: CashflowRow[]
  totals: CashflowTotals
}

export type CashflowResponse = {
    data: CashflowData
    config: CashflowTableConfig
}