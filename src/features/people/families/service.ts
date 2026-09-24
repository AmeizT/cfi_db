"use server"

import { cookies } from "next/headers"
import { apiRoutes } from "@/config/urls"
import { withJwt } from "@/config/headers"
import { HouseholdDetailSchema, HouseholdSchema, HouseholdsResponseSchema, type Household, type HouseholdDetail } from "./schema"

export type HouseholdParams = { search?: string; status?: string; page?: number; page_size?: number }
export type HouseholdWriteInput = {
    name: string
    phone_number?: string
    email?: string
    address?: string
    city?: string
    country?: string
    notes?: string
}

export async function getHouseholds(params: HouseholdParams = {}) {
    const query = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== "") query.set(key, String(value))
    })
    const token = (await cookies()).get("accessToken")?.value
    const response = await fetch(`${apiRoutes.households.list()}?${query}`, {
        ...withJwt(token),
        cache: "no-store",
    })
    if (!response.ok) throw new Error("Failed to load households.")
    return HouseholdsResponseSchema.parse(await response.json())
}

export async function getHousehold(id: string | number): Promise<HouseholdDetail> {
    const token = (await cookies()).get("accessToken")?.value
    const response = await fetch(apiRoutes.households.detail(id), {
        ...withJwt(token),
        cache: "no-store",
    })
    if (!response.ok) throw new Error(response.status === 404 ? "Household not found." : "Failed to load household.")
    return HouseholdDetailSchema.parse(await response.json())
}

export async function createHousehold(values: HouseholdWriteInput): Promise<Household> {
    const token = (await cookies()).get("accessToken")?.value
    const response = await fetch(apiRoutes.households.list(), {
        ...withJwt(token),
        method: "POST",
        body: JSON.stringify(values),
    })
    if (!response.ok) throw new Error("The household could not be created.")
    return HouseholdSchema.parse(await response.json())
}

export async function updateHousehold({ id, values }: { id: number; values: Partial<HouseholdWriteInput> & { assembly?: number } }): Promise<Household> {
    const token = (await cookies()).get("accessToken")?.value
    const response = await fetch(apiRoutes.households.detail(id), {
        ...withJwt(token),
        method: "PATCH",
        body: JSON.stringify(values),
    })
    if (!response.ok) {
        const errors = await response.json().catch(() => null)
        const message = errors?.assembly ?? errors?.detail
        throw new Error(Array.isArray(message) ? message.join(" ") : typeof message === "string" ? message : "The household could not be updated.")
    }
    return HouseholdSchema.parse(await response.json())
}


export async function deleteHousehold(id: number): Promise<void> {
    const token = (await cookies()).get("accessToken")?.value
    const response = await fetch(apiRoutes.households.detail(id), { ...withJwt(token), method: "DELETE" })
    if (!response.ok) throw new Error("The household could not be deleted.")
}

export async function getHouseholdTransferOptions(): Promise<{ id: number; name: string }[]> {
    const token = (await cookies()).get("accessToken")?.value
    const response = await fetch(`${apiRoutes.households.list()}transfer-options/`, { ...withJwt(token), cache: "no-store" })
    if (!response.ok) throw new Error("Unable to load household transfer destinations.")
    return response.json()
}
