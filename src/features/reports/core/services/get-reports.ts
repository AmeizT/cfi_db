"use server"

import { url } from "@/config/urls"
import { cookies } from "next/headers"
import type { TableSchema } from "@/features/data-table/types/tableSchema.types"
import type { AssemblyReport } from "../schemas/report/assembly.schema"

type ReportSectionData = {
    attendances: unknown[]
    tithes: unknown[]
    incomes: unknown[]
    expenditures: unknown[]
}

export type ReportsQueryItem = AssemblyReport & {
    data?: ReportSectionData
}

export type ReportsQueryData = ReportsQueryItem[] & {
    data: ReportsQueryItem[]
    results: ReportsQueryItem[]
    count: number
    table_schema?: TableSchema
}

type ReportEnvelope = {
    data?: unknown
    results?: unknown
    count?: unknown
    table_schema?: TableSchema
}

function isRecord(value: unknown): value is Record<string, unknown> {
    return Boolean(value) && typeof value === "object" && !Array.isArray(value)
}

function normalizeReportsResponse(payload: unknown): ReportsQueryData {
    const envelope: ReportEnvelope = isRecord(payload) ? payload : {}
    const rows = Array.isArray(payload)
        ? payload
        : Array.isArray(envelope.data)
            ? envelope.data
            : Array.isArray(envelope.results)
                ? envelope.results
                : []

    const reports = rows as ReportsQueryItem[]
    const count = Number(envelope.count)

    return Object.assign([...reports], {
        data: reports,
        results: reports,
        count: Number.isFinite(count) ? count : reports.length,
        table_schema: envelope.table_schema,
    })
}

export async function getReports(params: string): Promise<ReportsQueryData> {
    const cookieStore = await cookies()

    try {
        const response = await fetch(`${url.reports}${params}`, {
            headers: {
                Cookie: cookieStore.toString(),
            },
            cache: "no-store",
        })
        if (!response.ok) {
            throw new Error("Failed to fetch reports. Please try again later.")
        }
        const reports: unknown = await response.json()
        return normalizeReportsResponse(reports)
    } catch (error) {
        throw error
    }
}
