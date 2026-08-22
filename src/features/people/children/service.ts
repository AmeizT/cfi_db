"use server"

import { cookies } from "next/headers"
import { apiRoutes } from "@/config/urls"
import { withJwt } from "@/config/headers"
import { ChildrenDirectoryResponseSchema } from "./schema"

export type ChildrenDirectoryParams = {
    search?: string
    gender?: string
    status?: string
    page?: number
    page_size?: number
}

export async function getChildrenDirectory(params: ChildrenDirectoryParams = {}) {
    const query = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== "") query.set(key, String(value))
    })
    const token = (await cookies()).get("accessToken")?.value
    const response = await fetch(`${apiRoutes.members.junior.list()}?${query}`, {
        ...withJwt(token),
        cache: "no-store",
    })
    if (!response.ok) throw new Error("Failed to load children.")
    return ChildrenDirectoryResponseSchema.parse(await response.json())
}
