"use server"

import { cookies } from "next/headers"
import { 
    AttendanceStatement,
    AttendanceKpis, 
    QuarterResponse, 
    TithesQuarterStatement, 
    TithesKpis,
    CashflowKpis,
    FinanceSummary
} from "../../statements/types/summary.types"

export type ReportTab = "attendance" | "tithes" | "cashflow"

export type ReportMap = {
    attendance: {
        statement: AttendanceStatement
        kpis: AttendanceKpis
    }
    tithes: {
        statement: TithesQuarterStatement
        kpis: TithesKpis
    }
    cashflow: {
        statement: FinanceSummary
        kpis: CashflowKpis
    }
}

export async function getAnalytics<T extends ReportTab>(
    tab: T,
    period: string
): Promise<QuarterResponse<ReportMap[T]["statement"], ReportMap[T]["kpis"]>> {
        
    const cookieStore = await cookies()

    const url = `http://localhost:8000/api/v1/reports/summary/${tab}/?period=${period}`

    const response = await fetch(url, {
        headers: { Cookie: cookieStore.toString() },
        cache: "no-store",
    })

    if (!response.ok) {
        throw new Error("Failed to fetch the statement. Please try again later.");
    }

    return response.json();
}

export async function getAttendanceAnalytics(period: string) {
    return await getAnalytics("attendance", period);
}

export async function getTithesAnalytics(period: string) {
    return await getAnalytics("tithes", period);
}

export async function getCashflowAnalytics(period: string) {
    return await getAnalytics("cashflow", period);
}


