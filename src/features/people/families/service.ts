"use server"

import { cookies } from "next/headers"
import { apiRoutes } from "@/config/urls"
import { withJwt } from "@/config/headers"
import { HouseholdsResponseSchema } from "./schema"

export type HouseholdParams = { search?: string; status?: string; page?: number; page_size?: number }

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
