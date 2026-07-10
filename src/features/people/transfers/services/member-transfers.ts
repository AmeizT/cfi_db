"use server"

import { cookies } from "next/headers"
import type { z } from "zod"
import { apiRoutes } from "@/config/urls"
import { withJwt } from "@/config/headers"
import {
    AssemblyMembershipListSchema,
    CreateMemberTransferPayloadSchema,
    MemberTransferListSchema,
    MemberTransferSchema,
    TransferAssemblyListSchema,
    type AcceptMemberTransferPayload,
    type AssemblyMembershipList,
    type CancelMemberTransferPayload,
    type CreateMemberTransferPayload,
    type MemberTransfer,
    type MemberTransferList,
    type RejectMemberTransferPayload,
    type TransferAssemblyList,
} from "../schemas/member-transfer"

export type MemberTransferParams = {
    status?: string
    member?: string | number
}

function buildQuery(params: MemberTransferParams = {}) {
    const query = new URLSearchParams()

    if (params.status) query.set("status", params.status)
    if (params.member) query.set("member", String(params.member))

    const queryString = query.toString()
    return queryString ? `?${queryString}` : ""
}

async function getAccessToken() {
    const cookieStore = await cookies()
    return cookieStore.get("accessToken")?.value
}

function parseApiError(body: unknown, fallback: string) {
    if (!body || typeof body !== "object") return fallback

    if ("detail" in body && typeof body.detail === "string") {
        return body.detail
    }

    if ("non_field_errors" in body && Array.isArray(body.non_field_errors)) {
        return body.non_field_errors.join(" ")
    }

    return Object.values(body)
        .flatMap((value) => Array.isArray(value) ? value : [value])
        .filter((value): value is string => typeof value === "string")
        .join(" ") || fallback
}

async function readBody(response: Response) {
    try {
        return await response.json()
    } catch {
        return null
    }
}

async function requestJson<T>(
    endpoint: string,
    schema: z.ZodType<T>,
    init: RequestInit = {},
    fallbackError = "Member transfer request failed."
): Promise<T> {
    const accessToken = await getAccessToken()
    const response = await fetch(endpoint, {
        ...withJwt(accessToken),
        ...init,
        headers: {
            ...withJwt(accessToken).headers,
            ...init.headers,
        },
        cache: "no-store",
    })
    const body = await readBody(response)

    if (!response.ok) {
        throw new Error(parseApiError(body, fallbackError))
    }

    return schema.parse(body)
}

export async function getMemberTransfers(
    params: MemberTransferParams = {}
): Promise<MemberTransferList> {
    return requestJson(
        `${apiRoutes.memberTransfers.list()}${buildQuery(params)}`,
        MemberTransferListSchema,
        {},
        "Failed to load member transfers."
    )
}

export async function getIncomingMemberTransfers(
    params: MemberTransferParams = {}
): Promise<MemberTransferList> {
    return requestJson(
        `${apiRoutes.memberTransfers.incoming()}${buildQuery(params)}`,
        MemberTransferListSchema,
        {},
        "Failed to load incoming transfer requests."
    )
}

export async function getOutgoingMemberTransfers(
    params: MemberTransferParams = {}
): Promise<MemberTransferList> {
    return requestJson(
        `${apiRoutes.memberTransfers.outgoing()}${buildQuery(params)}`,
        MemberTransferListSchema,
        {},
        "Failed to load outgoing transfer requests."
    )
}

export async function getMemberTransferHistory(
    memberId?: string | number
): Promise<MemberTransferList> {
    return requestJson(
        `${apiRoutes.memberTransfers.history()}${buildQuery({ member: memberId })}`,
        MemberTransferListSchema,
        {},
        "Failed to load transfer history."
    )
}

export async function getMemberAssemblyMemberships(
    memberId: string | number
): Promise<AssemblyMembershipList> {
    return requestJson(
        `${apiRoutes.assemblyMemberships.list()}${buildQuery({ member: memberId })}`,
        AssemblyMembershipListSchema,
        {},
        "Failed to load assembly memberships."
    )
}

export async function getTransferAssemblies(): Promise<TransferAssemblyList> {
    return requestJson(
        apiRoutes.assemblies.list(),
        TransferAssemblyListSchema,
        {},
        "Failed to load assemblies."
    )
}

export async function createMemberTransfer(
    payload: CreateMemberTransferPayload
): Promise<MemberTransfer> {
    const parsedPayload = CreateMemberTransferPayloadSchema.parse(payload)

    return requestJson(
        apiRoutes.memberTransfers.list(),
        MemberTransferSchema,
        {
            method: "POST",
            body: JSON.stringify(parsedPayload),
        },
        "Failed to create transfer request."
    )
}

export async function acceptMemberTransfer({
    id,
    notes,
}: AcceptMemberTransferPayload): Promise<MemberTransfer> {
    return requestJson(
        apiRoutes.memberTransfers.accept(id),
        MemberTransferSchema,
        {
            method: "POST",
            body: JSON.stringify({ notes: notes ?? "" }),
        },
        "Failed to accept transfer request."
    )
}

export async function rejectMemberTransfer({
    id,
    rejection_reason,
    notes,
}: RejectMemberTransferPayload): Promise<MemberTransfer> {
    return requestJson(
        apiRoutes.memberTransfers.reject(id),
        MemberTransferSchema,
        {
            method: "POST",
            body: JSON.stringify({
                rejection_reason,
                notes: notes ?? "",
            }),
        },
        "Failed to reject transfer request."
    )
}

export async function cancelMemberTransfer({
    id,
    notes,
}: CancelMemberTransferPayload): Promise<MemberTransfer> {
    return requestJson(
        apiRoutes.memberTransfers.cancel(id),
        MemberTransferSchema,
        {
            method: "POST",
            body: JSON.stringify({ notes: notes ?? "" }),
        },
        "Failed to cancel transfer request."
    )
}
