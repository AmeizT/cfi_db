"use server"

import { cookies } from "next/headers"
import { apiRoutes } from "@/config/urls"
import { withJwt } from "@/config/headers"
import {
    getMembersFromResponse,
    MembersApiResponseSchema,
    type MembersListResponse,
} from "../schemas/member"

export type MembersDirectoryParams = {
    search?: string
    group?: "all" | "adults"
}

function buildMembersQuery({ search, group }: MembersDirectoryParams) {
    const params = new URLSearchParams()
    params.set("page_size", "100")
    const trimmedSearch = search?.trim()

    if (trimmedSearch) {
        params.set("fullname", trimmedSearch)
    }
    if (group === "adults") params.set("group", "adults")

    const query = params.toString()
    return query ? `?${query}` : ""
}

export async function getMembersDirectory(
    params: MembersDirectoryParams = {}
): Promise<MembersListResponse> {
    const cookieStore = await cookies()
    const accessToken = cookieStore.get("accessToken")?.value
    const endpoint = `${apiRoutes.members.list()}${buildMembersQuery(params)}`

    const response = await fetch(endpoint, {
        ...withJwt(accessToken),
        cache: "no-store",
    })

    if (!response.ok) {
        throw new Error("Failed to fetch members.")
    }

    return getMembersFromResponse(MembersApiResponseSchema.parse(await response.json()))
}
