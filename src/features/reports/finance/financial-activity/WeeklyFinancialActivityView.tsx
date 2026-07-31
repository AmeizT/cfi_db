"use client"

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { EmptyState } from "@/components/ui/empty-state"
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select"
import { useUser } from "@/hooks/query/use-user"
import { formatCurrency } from "@/utils"
import { createQueryString } from "@/features/reports/core/lib/create-query-string"
import type { FinanceResponse } from "@/features/reports/core/services/get-report-finance"

type ActivityKind = "revenue" | "expenses"
type GroupBy = "week" | "month" | "category"

type FinancialTransaction = {
    id: string
    date: string
    category: string
    description: string
    amount: number
}

function toNumber(value: unknown) {
    const parsed = Number(value ?? 0)
    return Number.isFinite(parsed) ? parsed : 0
}

function asRecord(value: unknown): Record<string, unknown> {
    return value && typeof value === "object" ? value as Record<string, unknown> : {}
}

function mondayFor(value: string | Date) {
    const date = typeof value === "string" ? new Date(`${value.slice(0, 10)}T12:00:00`) : new Date(value)
    const day = date.getDay()
    date.setDate(date.getDate() - (day === 0 ? 6 : day - 1))
    return date.toISOString().slice(0, 10)
}

function addDays(value: string, days: number) {
    const date = new Date(`${value}T12:00:00`)
    date.setDate(date.getDate() + days)
    return date.toISOString().slice(0, 10)
}

function formatRange(start: string) {
    const formatter = new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric" })
    return `${formatter.format(new Date(`${start}T12:00:00`))} – ${formatter.format(new Date(`${addDays(start, 6)}T12:00:00`))}`
}

function revenueTransactions(finance: FinanceResponse): FinancialTransaction[] {
    const revenue = (finance.revenue ?? []).map((item, index) => ({
        id: `revenue-${item.id ?? index}`,
        date: item.timestamp,
        category: item.category_name || String(item.category || "Other revenue"),
        description: item.notes || item.category_name || String(item.category || "Revenue"),
        amount: toNumber(item.amount),
    }))

    const tithes = (finance.tithes?.results ?? finance.tithes?.data ?? []).map((item, index) => ({
        id: `tithe-${item.id ?? index}`,
        date: item.timestamp,
        category: "Tithes",
        description: item.notes || item.reference_code || "Tithe",
        amount: toNumber(item.amount),
    }))

    return [...revenue, ...tithes]
}

function expenseTransactions(finance: FinanceResponse): FinancialTransaction[] {
    const overheads = (finance.expenses?.overheads ?? []).map((item, index) => ({
        id: `overhead-${item.id ?? index}`,
        date: item.timestamp,
        category: item.overhead_type_name || item.overhead_type || "Overhead",
        description: item.notes || item.overhead_type_name || "Overhead",
        amount: toNumber(item.amount),
    }))

    const variables = (finance.expenses?.variables ?? []).map((item, index) => {
        const record = asRecord(item)
        const quantity = toNumber(record.quantity || 1)
        const amount = toNumber(record.total || record.amount || toNumber(record.price) * quantity)
        return {
            id: `expense-${String(record.id ?? index)}`,
            date: String(record.timestamp || record.invoice_date || record.created_at || ""),
            category: String(record.category_name || record.category || "Other expense"),
            description: String(record.name || record.description || "Expense"),
            amount,
        }
    })

    return [...overheads, ...variables]
}

function aggregate(transactions: FinancialTransaction[], groupBy: GroupBy) {
    const groups = new Map<string, number>()
    transactions.forEach((item) => {
        const key = groupBy === "category"
            ? item.category
            : groupBy === "month"
                ? item.date.slice(0, 7)
                : mondayFor(item.date)
        groups.set(key, (groups.get(key) ?? 0) + item.amount)
    })
    return [...groups.entries()].map(([label, amount]) => ({ label, amount }))
}

function SummaryCard({ label, value, detail }: { label: string; value: string; detail?: string }) {
    return (
        <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="mt-2 text-xl font-semibold tabular-nums text-foreground">{value}</p>
            {detail ? <p className="mt-1 text-xs text-muted-foreground">{detail}</p> : null}
        </div>
    )
}

export function WeeklyFinancialActivityView({
    finance,
    kind,
    isLoading,
}: {
    finance: FinanceResponse | undefined
    kind: ActivityKind
    isLoading: boolean
}) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const { data: user } = useUser()
    const pathname = `/reports/financial-activity/${kind}`
    const transactions = React.useMemo(() => {
        if (!finance) return []
        const rows = kind === "revenue" ? revenueTransactions(finance) : expenseTransactions(finance)
        return rows.filter((item) => item.date && Number.isFinite(item.amount))
    }, [finance, kind])
    const weekStarts = React.useMemo(
        () => [...new Set(transactions.map((item) => mondayFor(item.date)))].sort().reverse(),
        [transactions],
    )
    const requestedWeek = searchParams.get("week")
    const selectedWeek = requestedWeek && weekStarts.includes(requestedWeek)
        ? requestedWeek
        : weekStarts[0] || mondayFor(new Date())
    const previousWeek = addDays(selectedWeek, -7)
    const selectedRows = transactions.filter((item) => mondayFor(item.date) === selectedWeek)
    const currentTotal = selectedRows.reduce((sum, item) => sum + item.amount, 0)
    const previousTotal = transactions
        .filter((item) => mondayFor(item.date) === previousWeek)
        .reduce((sum, item) => sum + item.amount, 0)
    const month = selectedWeek.slice(0, 7)
    const monthToDate = transactions
        .filter((item) => item.date.slice(0, 7) === month)
        .reduce((sum, item) => sum + item.amount, 0)
    const difference = currentTotal - previousTotal
    const groupBy = (["week", "month", "category"].includes(searchParams.get("groupBy") ?? "")
        ? searchParams.get("groupBy")
        : "week") as GroupBy
    const groupedRows = aggregate(transactions, kind === "expenses" ? groupBy : "category")
    const maxDistribution = Math.max(...groupedRows.map((item) => item.amount), 1)
    const currencyOptions = {
        language: user?.assembly?.locale,
        currency: user?.assembly?.currency,
    }

    function updateQuery(updates: Record<string, string>) {
        router.push(`${pathname}?${createQueryString(searchParams, updates)}`)
    }

    if (isLoading) {
        return <div className="min-h-72 animate-pulse rounded-lg bg-muted/40" aria-label={`Loading ${kind}`} />
    }

    if (!transactions.length) {
        return (
            <EmptyState
                type="financialTransactions"
                title={`No ${kind} recorded`}
                description={`Add ${kind} transactions to see weekly totals and comparisons.`}
                size="full"
            />
        )
    }

    return (
        <div className="grid gap-4 py-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm text-muted-foreground">Weeks run Monday through Sunday.</p>
                <div className="flex flex-wrap items-center gap-2">
                    <NativeSelect
                        aria-label="Reporting week"
                        value={selectedWeek}
                        onChange={(event) => updateQuery({ week: event.target.value })}
                    >
                        {weekStarts.map((week) => (
                            <NativeSelectOption key={week} value={week}>{formatRange(week)}</NativeSelectOption>
                        ))}
                    </NativeSelect>
                    {kind === "expenses" ? (
                        <NativeSelect
                            aria-label="Group expenses by"
                            value={groupBy}
                            onChange={(event) => updateQuery({ groupBy: event.target.value })}
                        >
                            <NativeSelectOption value="week">Group by week</NativeSelectOption>
                            <NativeSelectOption value="month">Group by month</NativeSelectOption>
                            <NativeSelectOption value="category">Group by category</NativeSelectOption>
                        </NativeSelect>
                    ) : null}
                </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <SummaryCard label={`Weekly ${kind}`} value={formatCurrency(currentTotal, currencyOptions)} detail={formatRange(selectedWeek)} />
                <SummaryCard label="Month to date" value={formatCurrency(monthToDate, currencyOptions)} detail={month} />
                <SummaryCard label="Previous week" value={formatCurrency(previousTotal, currencyOptions)} detail={formatRange(previousWeek)} />
                <SummaryCard label="Weekly change" value={formatCurrency(difference, currencyOptions)} detail="Current week minus previous week" />
            </div>

            <div className="overflow-x-auto rounded-lg border border-border bg-card">
                <div className="grid min-w-3xl grid-cols-[120px_1fr_1fr_140px] gap-3 border-b border-border bg-muted/40 px-4 py-3 text-xs font-semibold uppercase text-muted-foreground">
                    <span>Date</span><span>Category</span><span>Description</span><span className="text-right">Amount</span>
                </div>
                {selectedRows.map((item) => (
                    <div key={item.id} className="grid min-w-3xl grid-cols-[120px_1fr_1fr_140px] gap-3 border-b border-border px-4 py-3 text-sm last:border-0">
                        <span>{item.date.slice(0, 10)}</span><span>{item.category}</span><span>{item.description}</span>
                        <span className="text-right tabular-nums">{formatCurrency(item.amount, currencyOptions)}</span>
                    </div>
                ))}
            </div>

            <div className="rounded-lg border border-border bg-card p-4">
                <h2 className="text-sm font-semibold capitalize">{kind} distribution</h2>
                <div className="mt-4 grid gap-3">
                    {groupedRows.map((item) => (
                        <div key={item.label} className="grid items-center gap-3 sm:grid-cols-[160px_1fr_140px]">
                            <span className="truncate text-sm">{item.label}</span>
                            <span className="h-2 rounded-full bg-muted"><span className="block h-2 rounded-full bg-primary" style={{ width: `${Math.max(3, item.amount / maxDistribution * 100)}%` }} /></span>
                            <span className="text-right text-sm tabular-nums">{formatCurrency(item.amount, currencyOptions)}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
