"use server"

import { cookies } from "next/headers"
import { refreshBackendSession } from "../../server/auth-session"

export async function refreshSession() {
    const cookieStore = await cookies()
    const refreshToken = cookieStore.get("refreshToken")?.value

    if (!refreshToken) {
        throw new Error("No refresh token found. Please sign in again.")
    }

    try {
        const tokens = await refreshBackendSession(
            refreshToken,
            cookieStore.toString()
        )

        if (!tokens?.access) {
            throw new Error("Invalid server response while refreshing session.")
        }

        const cookieOptions = {
            httpOnly: true,
            path: "/",
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax" as const,
        }
        cookieStore.set("accessToken", tokens.access, cookieOptions)
        if (tokens.refresh) {
            cookieStore.set("refreshToken", tokens.refresh, cookieOptions)
        }

        return true
    } catch (error) {
        console.error("Session refresh failed:", error)
        throw new Error("Session refresh failed. Please log in again.")
    }
}
