"use server"

import { cookies } from "next/headers"
import { apiRoutes, type ApiDetailRouteKey } from "@/config/urls"

export async function softDeleteRecord(resource: ApiDetailRouteKey, recordId: string) {
    const cookieStore = await cookies()
    const route = apiRoutes[resource]

    const endpoint = route.detail(recordId)

    const response = await fetch(`${endpoint}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            Cookie: cookieStore.toString(),
        },
        cache: "no-store",
    })

    if (!response.ok) {
        const payload = await response.json().catch(() => null) as { detail?: string } | null
        throw new Error(payload?.detail ?? "Failed to delete record. Please try again.")
    }

    return { success: true, status: response.status }
}
