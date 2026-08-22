"use server"

import { cookies } from "next/headers"
import { apiRoutes } from "@/config/urls"
import { withJwt } from "@/config/headers"
import { FormerMemberDetailSchema, FormerMemberListSchema, type FormerMemberDetail, type FormerMemberList } from "./schema"

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

export async function getFormerMember(id: string | number): Promise<FormerMemberDetail> {
    const token = (await cookies()).get("accessToken")?.value
    const response = await fetch(apiRoutes.formerMembers.detail(id), {
        ...withJwt(token),
        cache: "no-store",
    })
    if (!response.ok) throw new Error(response.status === 404 ? "Former member not found." : "Failed to load former member.")
    return FormerMemberDetailSchema.parse(await response.json())
}

export async function readmitFormerMember(id: string | number) {
    const token = (await cookies()).get("accessToken")?.value
    const response = await fetch(apiRoutes.formerMembers.readmit(id), {
        ...withJwt(token),
        method: "POST",
        headers: { ...withJwt(token).headers, "Content-Type": "application/json" },
        body: JSON.stringify({ joined_on: new Date().toISOString().slice(0, 10) }),
    })
    if (!response.ok) throw new Error("The former member could not be restored.")
    return response.json()
}
