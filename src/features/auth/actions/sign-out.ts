// src/features/auth/actions/sign-out.ts
"use server"

import { formatISO } from "date-fns"
import { cookies } from "next/headers"

/**
 * Signs out the user by clearing auth cookies and logging session end time.
 * @param userId - ID of the user to log out (optional, for audit/log purposes)
 */
export async function signOut(userId: string | null): Promise<{ success: boolean }> {
    const cookieStore = await cookies()

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

        return { success: true }
    } catch (error) {
        console.error("Logout failed:", error)
        return { success: false }
    }
}