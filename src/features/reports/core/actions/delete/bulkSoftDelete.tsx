"use server"

import { cookies } from "next/headers"
import { apiRoutes, type ApiBulkDeleteRouteKey } from "@/config/urls"

type BulkDeletePayload = {
    resource: ApiBulkDeleteRouteKey
    ids: number[]
}

export async function bulksoftDeleteRecords({resource, ids}: BulkDeletePayload) {
    const cookieStore = await cookies()
    const route = apiRoutes[resource]
    const endpoint = route.bulkDelete()

    const response = await fetch(endpoint, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Cookie: cookieStore.toString(),
        },
        cache: "no-store",
        body: JSON.stringify({ ids })
    })

    if (!response.ok) {
        throw new Error("Failed to delete record. Please try again.")
    }

    return response.json().catch(() => ({ success: true }))
}
