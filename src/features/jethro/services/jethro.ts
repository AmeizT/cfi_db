"use server"

import { cookies } from "next/headers"
import { apiRoutes } from "@/config/urls"
import { withJwt } from "@/config/headers"
import {
    JethroConversationSchema,
    JethroConversationsSchema,
    JethroSendResponseSchema,
    JethroStatusSchema,
    JethroTitheConfirmationSchema,
    JethroTitheMemberSelectionSchema,
    JethroTitheSuccessSchema,
} from "../schemas/jethro"

async function request(endpoint: string, init: RequestInit = {}) {
    const token = (await cookies()).get("accessToken")?.value
    const response = await fetch(endpoint, {
        ...withJwt(token),
        ...init,
        headers: {
            ...withJwt(token).headers,
            "Content-Type": "application/json",
            ...init.headers,
        },
        cache: "no-store",
    })
    const body = await response.json().catch(() => null)
    if (!response.ok) {
        const detail = body?.detail
            || (body && typeof body === "object" ? Object.values(body).flat(2).find((value) => typeof value === "string") : null)
        throw new Error(typeof detail === "string" ? detail : "Jethro request failed.")
    }
    return body
}

export async function getJethroConversations() {
    return JethroConversationsSchema.parse(await request(apiRoutes.jethro.conversations()))
}

export async function getJethroStatus() {
    return JethroStatusSchema.parse(await request(apiRoutes.jethro.status()))
}

export async function getJethroConversation(publicId: string) {
    return JethroConversationSchema.parse(await request(apiRoutes.jethro.conversation(publicId)))
}

export async function createJethroConversation() {
    return JethroConversationSchema.parse(await request(apiRoutes.jethro.conversations(), {
        method: "POST",
        body: JSON.stringify({}),
    }))
}

export async function archiveJethroConversation(publicId: string) {
    return JethroConversationSchema.parse(await request(apiRoutes.jethro.conversation(publicId), {
        method: "PATCH",
        body: JSON.stringify({ is_archived: true }),
    }))
}

export async function sendJethroMessage(payload: { message: string; conversation_id?: string }) {
    return JethroSendResponseSchema.parse(await request(apiRoutes.jethro.messages(), {
        method: "POST",
        body: JSON.stringify(payload),
    }))
}

export async function getTitheMemberCandidates(payload: { draftId: string; query: string; page: number; pageSize?: number }) {
    const endpoint = new URL(apiRoutes.jethro.titheMembers(payload.draftId))
    endpoint.searchParams.set("query", payload.query)
    endpoint.searchParams.set("page", String(payload.page))
    endpoint.searchParams.set("page_size", String(payload.pageSize ?? 10))
    return JethroTitheMemberSelectionSchema.parse(await request(endpoint.toString()))
}

export async function selectTitheMember(payload: { draftId: string; memberPublicId: string }) {
    return JethroTitheConfirmationSchema.parse(await request(apiRoutes.jethro.selectTitheMember(payload.draftId), {
        method: "POST",
        body: JSON.stringify({ member_public_id: payload.memberPublicId }),
    }))
}

export async function confirmTithe(draftId: string) {
    return JethroTitheSuccessSchema.parse(await request(apiRoutes.jethro.confirmTithe(draftId), { method: "POST" }))
}

export async function cancelTithe(draftId: string) {
    return JethroTitheConfirmationSchema.parse(await request(apiRoutes.jethro.cancelTithe(draftId), { method: "POST" }))
}
