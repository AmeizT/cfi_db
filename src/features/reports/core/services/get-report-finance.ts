"use server"

import { Tithe, TitheConfig } from "@/dal/types"
import { cookies } from "next/headers"
import { apiRoutes } from "@/config/urls"
import { Expenditure, Overhead, Revenue } from "@/dal/types"
import { CashflowResponse, CashflowRow } from "../../finance/cashflow/types/cashflow"

type Expenses = {
    overheads: Overhead[]
    variables: Expenditure
}

export type PaginatedTableResponse<T> = {
    count?: number
    next?: string | null
    previous?: string | null
    results?: T[]
}

export type PaginatedTitheConfig = TitheConfig & PaginatedTableResponse<Tithe>
export type PaginatedCashflowResponse = CashflowResponse & PaginatedTableResponse<CashflowRow & { id?: number }>

export type FinanceResponse = {
    tithes: PaginatedTitheConfig
    revenue: Revenue[]
    expenses: Expenses
    cashflow: PaginatedCashflowResponse
}

export type Finance = {
    finance: FinanceResponse
}

type PaginationParams = {
    page?: number
    pageSize?: number
}

function buildPaginationQuery(pagination?: PaginationParams) {
    const params = new URLSearchParams()

    if (pagination?.page) {
        params.set("page", String(pagination.page))
    }

    if (pagination?.pageSize) {
        params.set("page_size", String(pagination.pageSize))
    }

    const query = params.toString()
    return query ? `?${query}` : ""
}

export async function getReportFinance(
    reportId: string,
    pagination?: PaginationParams
): Promise<FinanceResponse> {
    const cookieStore = await cookies()
    const query = buildPaginationQuery(pagination)
    const [revenueRes, tithesRes, expensesRes, cashflowRes] = await Promise.all([
        fetch(`${apiRoutes.reports.detail(reportId)}revenue`, {
            headers: { Cookie: cookieStore.toString() }
        }),
        fetch(`${apiRoutes.reports.detail(reportId)}tithes/${query}`, {
            headers: { Cookie: cookieStore.toString() }
        }),
        fetch(`${apiRoutes.reports.detail(reportId)}overheads`, {
            headers: { Cookie: cookieStore.toString() }
        }),
        fetch(`${apiRoutes.reports.detail(reportId)}cashflow/${query}`, {
            headers: { Cookie: cookieStore.toString() }
        }),
    ])

    if (!revenueRes.ok || !tithesRes.ok || !expensesRes.ok) {
        throw new Error("Failed to fetch finance data")
    }

    const [revenue, tithes, expenses, cashflow] = await Promise.all([
        revenueRes.json(),
        tithesRes.json(),
        expensesRes.json(),
        cashflowRes.json()
    ])

    return {
        revenue,
        tithes,
        expenses,
        cashflow
    }
}
