"use server"

import { cookies } from "next/headers"
import { apiRoutes, type ApiDetailRouteKey } from "@/config/urls"

interface ActionProps {
    resource: ApiDetailRouteKey
    recordId: number 
    columnId: string
    value: unknown
}

export async function updateCell({
    resource,
    recordId,
    columnId,
    value,
}: ActionProps)
{
    const cookieStore = await cookies()
    const route = apiRoutes[resource]

    const endpoint = route.detail(recordId)

    const response = await fetch(endpoint, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            Cookie: cookieStore.toString(),
        },
        body: JSON.stringify({
            [columnId]: value,
        }),
    })

    if (!response.ok) {
        const payload = await response.json().catch(() => null) as Record<string, unknown> | null
        const detail = typeof payload?.detail === "string"
            ? payload.detail
            : "Failed to update record. Please try again."
        throw new Error(detail)
    }

    return response.json().catch(() => ({ success: true, status: response.status }))
}
