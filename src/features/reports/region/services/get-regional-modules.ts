"use server"

import { apiRoutes } from "@/config/urls"
import { cookies } from "next/headers"
import type {
    RegionalModuleResponse,
    RegionalOverviewResponse,
} from "../types/regional-modules"
import { RegionalModuleResponseSchema } from "../types/regional-modules"

async function fetchRegional<T>(endpoint: string, errorMessage: string): Promise<T> {
    const cookieStore = await cookies()

    const response = await fetch(endpoint, {
        headers: {
            Cookie: cookieStore.toString(),
        },
        cache: "no-store",
    })

    if (!response.ok) {
        throw new Error(errorMessage)
    }

    return response.json()
}

async function fetchRegionalModule(endpoint: string, errorMessage: string) {
    const data = await fetchRegional<unknown>(endpoint, errorMessage)
    const parsed = RegionalModuleResponseSchema.safeParse(data)

    return parsed.success ? parsed.data : data as RegionalModuleResponse
}

export async function getRegionalOverview(regionId: string | number) {
    return fetchRegional<RegionalOverviewResponse>(
        apiRoutes.regional.overview(regionId),
        "Failed to fetch regional overview."
    )
}

export async function getRegionalFinance(regionId: string | number) {
    return fetchRegionalModule(
        apiRoutes.regional.finance(regionId),
        "Failed to fetch regional finance."
    )
}

export async function getRegionalCompliance(regionId: string | number) {
    return fetchRegionalModule(
        apiRoutes.regional.compliance(regionId),
        "Failed to fetch regional compliance."
    )
}

export async function getRegionalRisk(regionId: string | number) {
    return fetchRegionalModule(
        apiRoutes.regional.risk(regionId),
        "Failed to fetch regional risk."
    )
}

export async function getRegionalGrowth(regionId: string | number) {
    return fetchRegionalModule(
        apiRoutes.regional.growth(regionId),
        "Failed to fetch regional growth."
    )
}

export async function getRegionalMinistry(regionId: string | number) {
    return fetchRegionalModule(
        apiRoutes.regional.ministry(regionId),
        "Failed to fetch regional ministry."
    )
}

export async function getRegionalLeadership(regionId: string | number) {
    return fetchRegionalModule(
        apiRoutes.regional.leadership(regionId),
        "Failed to fetch regional leadership."
    )
}
