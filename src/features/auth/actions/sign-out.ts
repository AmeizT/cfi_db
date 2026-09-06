// src/features/auth/actions/sign-out.ts
"use server"

import { formatISO } from "date-fns"
import { cookies } from "next/headers"
import { apiRoutes } from "@/config/urls"

/**
 * Signs out the user by clearing auth cookies and logging session end time.
 * @param userId - ID of the user to log out (optional, for audit/log purposes)
 */
export async function signOut(userId: string | null): Promise<{ success: boolean }> {
    const cookieStore = await cookies()

    try {
        const csrfToken = cookieStore.get("csrftoken")?.value
        const response = await fetch(apiRoutes.auth.logout(), {
            method: "POST",
            headers: {
                Cookie: cookieStore.toString(),
                ...(csrfToken ? { "X-CSRFToken": csrfToken } : {}),
            },
            cache: "no-store",
        })
        if (!response.ok) {
            console.error(`Backend logout failed with status ${response.status}`)
        }
    } catch (error) {
        console.error("Backend logout failed:", error)
    }

    try {
        cookieStore.delete("accessToken")
        cookieStore.delete("refreshToken")

        if (userId !== null) {
            cookieStore.set("user", String(userId), {
                path: "/",
                sameSite: "strict",
                httpOnly: true,
            })
        }

        cookieStore.set("signedOutAt", formatISO(new Date()), {
            path: "/",
            sameSite: "strict",
            httpOnly: true,
        })
    } catch (error) {
        console.error("Local logout cleanup failed:", error)
        return { success: false }
    }

    return { success: true }
}
