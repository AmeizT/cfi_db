"use server"

import { cookies } from "next/headers"
import { apiRoutes } from "@/config/urls"

export async function softDeleteRecord(resource: keyof typeof apiRoutes, recordId: string) {
    const cookieStore = await cookies()
    const route = apiRoutes[resource]

    if (!route?.detail) {
        throw new Error(`No detail route for resource: ${resource}`)
    }

    const endpoint = route.detail(recordId)

    try {
        const response = await fetch(`${endpoint}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Cookie: cookieStore.toString(),
            },
            cache: "no-store",
        })

        if (!response.ok) {
            throw new Error("Failed to delete record. Please try again.")
        }

        return {
            success: true,
            status: response.status,
        }
    } catch (error) {
        return {
            success: false,
            error:
                error instanceof Error
                    ? error.message
                    : "Unknown error",
        }
    }
}