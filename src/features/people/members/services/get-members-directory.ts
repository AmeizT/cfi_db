"use server"

import { cookies } from "next/headers"
import { apiRoutes } from "@/config/urls"
import { withJwt } from "@/config/headers"
import {
    MembersListResponseSchema,
    type MembersListResponse,
} from "../schemas/member"

export type MembersDirectoryParams = {
    search?: string
}

function buildMembersQuery({ search }: MembersDirectoryParams) {
    const params = new URLSearchParams()
    const trimmedSearch = search?.trim()

    if (trimmedSearch) {
        params.set("fullname", trimmedSearch)
    }

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

    return MembersListResponseSchema.parse(await response.json())
}
