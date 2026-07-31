"use server"

import { cookies } from "next/headers"
import { apiRoutes } from "@/config/urls"
import { withJwt } from "@/config/headers"
import { FormerMemberListSchema, type FormerMemberList } from "./schema"

export type FormerMemberParams = {
    reason?: string
    search?: string
    page?: number
    page_size?: number
}

export async function getFormerMembers(params: FormerMemberParams = {}): Promise<FormerMemberList> {
    const query = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== "") query.set(key, String(value))
    })
    const token = (await cookies()).get("accessToken")?.value
    const response = await fetch(`${apiRoutes.formerMembers.list()}?${query}`, {
        ...withJwt(token),
        cache: "no-store",
    })
    if (!response.ok) throw new Error("Failed to load former members.")
    return FormerMemberListSchema.parse(await response.json())
}
