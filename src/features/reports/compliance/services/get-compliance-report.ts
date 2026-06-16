"use server"

import { apiRoutes } from "@/config/urls"
import { cookies } from "next/headers"
import { AssemblyComplianceReport  } from "@/dal/types"

export async function getComplianceReport(assemblyId: string): Promise<AssemblyComplianceReport > {
    const cookieStore = await cookies()

    try {
        const response = await fetch(`${apiRoutes.reports.analyzer(assemblyId)}`, {
            headers: {
                Cookie: cookieStore.toString(),
            },
            cache: "no-store",
        })
        if (!response.ok) {
            throw new Error("Failed to fetch compliance report. Please try again later.")
        }
        const complianceReport = await response.json()
        return complianceReport
    } catch (error) {
        throw error
    }
}