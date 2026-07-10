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

    try {
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

        console.log("Updated successfully")

        if (!response.ok) {
            throw new Error("Failed to update record. Please try again.")
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
