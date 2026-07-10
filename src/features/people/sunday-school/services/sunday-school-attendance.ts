"use server"

import { cookies } from "next/headers"
import type { z } from "zod"
import { apiRoutes } from "@/config/urls"
import { withJwt } from "@/config/headers"
import {
    SundaySchoolAggregatesSchema,
    SundaySchoolAttendanceListSchema,
    SundaySchoolAttendancePayloadSchema,
    SundaySchoolAttendanceSchema,
    type SundaySchoolAggregates,
    type SundaySchoolAttendance,
    type SundaySchoolAttendanceList,
    type SundaySchoolAttendancePayload,
} from "../schemas/sunday-school"

export type SundaySchoolAttendanceParams = {
    className?: string
    status?: string
    dateAfter?: string
    dateBefore?: string
}

function buildQuery(params: SundaySchoolAttendanceParams = {}) {
    const query = new URLSearchParams()

    if (params.className) query.set("class_name", params.className)
    if (params.status) query.set("status", params.status)
    if (params.dateAfter) query.set("service_date_after", params.dateAfter)
    if (params.dateBefore) query.set("service_date_before", params.dateBefore)

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

    return fallback
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
    fallbackError = "Sunday School attendance request failed."
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

export async function getSundaySchoolAttendance(
    params: SundaySchoolAttendanceParams = {}
): Promise<SundaySchoolAttendanceList> {
    return requestJson(
        `${apiRoutes.sundaySchoolAttendance.list()}${buildQuery(params)}`,
        SundaySchoolAttendanceListSchema,
        {},
        "Failed to load Sunday School attendance."
    )
}

export async function getSundaySchoolAttendanceDetail(
    id: string | number
): Promise<SundaySchoolAttendance> {
    return requestJson(
        apiRoutes.sundaySchoolAttendance.detail(id),
        SundaySchoolAttendanceSchema,
        {},
        "Failed to load Sunday School attendance record."
    )
}

export async function getSundaySchoolAggregates(
    params: SundaySchoolAttendanceParams = {}
): Promise<SundaySchoolAggregates> {
    return requestJson(
        `${apiRoutes.sundaySchoolAttendance.aggregates()}${buildQuery(params)}`,
        SundaySchoolAggregatesSchema,
        {},
        "Failed to load Sunday School attendance statistics."
    )
}

export async function createSundaySchoolAttendance(
    payload: SundaySchoolAttendancePayload
): Promise<SundaySchoolAttendance> {
    const parsedPayload = SundaySchoolAttendancePayloadSchema.parse(payload)

    return requestJson(
        apiRoutes.sundaySchoolAttendance.list(),
        SundaySchoolAttendanceSchema,
        {
            method: "POST",
            body: JSON.stringify(parsedPayload),
        },
        "Failed to create Sunday School attendance."
    )
}

export async function updateSundaySchoolAttendance(
    id: string | number,
    payload: SundaySchoolAttendancePayload
): Promise<SundaySchoolAttendance> {
    const parsedPayload = SundaySchoolAttendancePayloadSchema.parse(payload)

    return requestJson(
        apiRoutes.sundaySchoolAttendance.detail(id),
        SundaySchoolAttendanceSchema,
        {
            method: "PATCH",
            body: JSON.stringify(parsedPayload),
        },
        "Failed to update Sunday School attendance."
    )
}

export async function approveSundaySchoolAttendance(
    id: string | number
): Promise<SundaySchoolAttendance> {
    return requestJson(
        apiRoutes.sundaySchoolAttendance.approve(id),
        SundaySchoolAttendanceSchema,
        { method: "POST" },
        "Failed to approve Sunday School attendance."
    )
}

export async function rejectSundaySchoolAttendance(
    id: string | number
): Promise<SundaySchoolAttendance> {
    return requestJson(
        apiRoutes.sundaySchoolAttendance.reject(id),
        SundaySchoolAttendanceSchema,
        { method: "POST" },
        "Failed to reject Sunday School attendance."
    )
}
