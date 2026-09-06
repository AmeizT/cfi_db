"use server"

import { cookies } from "next/headers"
import { apiRoutes } from "@/config/urls"
import { withJwt } from "@/config/headers"
import {
    getMembersFromResponse,
    getMembersPageFromResponse,
    MembersApiResponseSchema,
    MemberSchema,
    type Member,
    MemberUpdateSchema,
    type MemberUpdate,
    type MembersListResponse,
    type MembersPage,
} from "../schemas/member"

export type MembersDirectoryParams = {
    search?: string
    group?: "all" | "adults"
    page?: number
    page_size?: number
}

function buildMembersQuery({ search, group, page, page_size }: MembersDirectoryParams) {
    const params = new URLSearchParams()
    params.set("page_size", String(page_size ?? 100))
    if (page && page > 1) params.set("page", String(page))
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

export async function getMembersDirectoryPage(
    params: MembersDirectoryParams = {}
): Promise<MembersPage> {
    const cookieStore = await cookies()
    const accessToken = cookieStore.get("accessToken")?.value
    const response = await fetch(`${apiRoutes.members.list()}${buildMembersQuery(params)}`, {
        ...withJwt(accessToken),
        cache: "no-store",
    })
    if (!response.ok) throw new Error("Failed to fetch members.")
    return getMembersPageFromResponse(MembersApiResponseSchema.parse(await response.json()))
}

export async function getMemberDetail(memberKey: string): Promise<Member> {
    const cookieStore = await cookies()
    const accessToken = cookieStore.get("accessToken")?.value
    const response = await fetch(apiRoutes.members.detail(memberKey), {
        ...withJwt(accessToken),
        cache: "no-store",
    })
    if (!response.ok) throw new Error(response.status === 404 ? "Member not found." : "Failed to fetch member profile.")
    return MemberSchema.parse(await response.json())
}

async function memberMutationError(response: Response, fallback: string) {
    const payload = await response.json().catch(() => null) as Record<string, unknown> | null
    if (payload?.detail && typeof payload.detail === "string") return payload.detail
    if (payload && Object.keys(payload).length) {
        return Object.entries(payload)
            .map(([field, value]) => `${field}: ${Array.isArray(value) ? value.join(", ") : String(value)}`)
            .join(" ")
    }
    return fallback
}

export async function updateMemberDetail(memberKey: string, updates: MemberUpdate): Promise<Member> {
    const cookieStore = await cookies()
    const accessToken = cookieStore.get("accessToken")?.value
    const payload = MemberUpdateSchema.parse(updates)
    const response = await fetch(apiRoutes.members.detail(memberKey), {
        ...withJwt(accessToken),
        method: "PATCH",
        headers: {
            ...withJwt(accessToken).headers,
            "Content-Type": "application/json",
        },
        cache: "no-store",
        body: JSON.stringify(payload),
    })
    if (!response.ok) throw new Error(await memberMutationError(response, "Failed to update member."))
    return MemberSchema.parse(await response.json())
}

export async function deleteMember(memberKey: string): Promise<void> {
    const cookieStore = await cookies()
    const accessToken = cookieStore.get("accessToken")?.value
    const response = await fetch(apiRoutes.members.detail(memberKey), {
        ...withJwt(accessToken),
        method: "DELETE",
        cache: "no-store",
    })
    if (!response.ok) throw new Error(await memberMutationError(response, "Failed to delete member."))
}
