"use server"

import { apiRoutes } from "@/config/urls"
import { cookies } from "next/headers"
import type { RegionalDashboardResponse } from "../types/regional-dashboard"

type RegionalDashboardParams = {
    regionId: string
    year?: string
}

export async function getRegionalDashboard({
    regionId,
    year,
}: RegionalDashboardParams): Promise<RegionalDashboardResponse> {
    const cookieStore = await cookies()
    const params = new URLSearchParams()

    if (year) {
        params.set("year", year)
    }

    const queryString = params.toString()
    const endpoint = `${apiRoutes.reports.regions.dashboard(regionId)}${queryString ? `?${queryString}` : ""}`

    const response = await fetch(endpoint, {
        headers: {
            Cookie: cookieStore.toString(),
        },
        cache: "no-store",
    })

    if (!response.ok) {
        throw new Error("Failed to fetch regional dashboard. Please try again later.")
    }

    return response.json()
}
