"use server"

import { TitheConfig } from "@/dal/types"
import { cookies } from "next/headers"
import { apiRoutes } from "@/config/urls"
import { Expenditure, Overhead, Revenue } from "@/dal/types"
import { CashflowResponse } from "../../finance/cashflow/types/cashflow"

type Expenses = {
    overheads: Overhead[]
    variables: Expenditure
}

export type FinanceResponse = {
    tithes: TitheConfig
    revenue: Revenue[]
    expenses: Expenses
    cashflow: CashflowResponse
}

export type Finance = {
    finance: FinanceResponse
}

export async function getReportFinance(reportId: string): Promise<FinanceResponse> {
    const cookieStore = await cookies()
    const [revenueRes, tithesRes, expensesRes, cashflowRes] = await Promise.all([
        fetch(`${apiRoutes.reports.detail(reportId)}revenue`, {
            headers: { Cookie: cookieStore.toString() }
        }),
        fetch(`${apiRoutes.reports.detail(reportId)}tithes`, {
            headers: { Cookie: cookieStore.toString() }
        }),
        fetch(`${apiRoutes.reports.detail(reportId)}overheads`, {
            headers: { Cookie: cookieStore.toString() }
        }),
        fetch(`${apiRoutes.reports.detail(reportId)}cashflow`, {
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