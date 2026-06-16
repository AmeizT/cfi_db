"use server"

import { url } from "@/config/urls"
import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"
import { FormState } from "@/types/form-state"

const fail = (status: number, message: string): FormState => ({
    success: false,
    status,
    message,
})

export async function setActiveTeamspace(
    _prev: FormState,
    formData: FormData
): Promise<FormState> {
    const teamspaceId = formData.get("church")?.toString().trim()
    if (!teamspaceId) return fail(400, "Missing teamspace ID")

    const cookieStore = await cookies()
    const accessToken = cookieStore.get("accessToken")?.value
    if (!accessToken) return fail(401, "Not authenticated")

    try {
        const response = await fetch(url.currentUser, {
            method: "PATCH",
            cache: "no-store",
            headers: {
                "Content-Type": "application/json",
                authorization: `JWT ${accessToken}`,
            },
            body: JSON.stringify({ church: teamspaceId }),
        })

        if (!response.ok) {
            const error = await response.json().catch(() => ({}))
            return fail(response.status, error?.detail ?? "Failed to switch teamspace")
        }

        revalidatePath("/", "layout")

        return {
            success: true,
            status: response.status,
            message: "Teamspace switched",
        }
    } catch (error) {
        console.error("Teamspace switch failed:", error)
        return fail(500, "Unexpected error while switching teamspace")
    }
}