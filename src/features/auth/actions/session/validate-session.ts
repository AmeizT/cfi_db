"use server"

import { url } from "@/config/urls"
import { cookies } from "next/headers"

export async function validateSession() {
    const cookieStore = await cookies()
    const accessToken: string | undefined = cookieStore.get("accessToken")?.value ?? undefined

    if (accessToken) {
        try {
            const response = await fetch(url.verifySession, {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ token: accessToken })
            })
            if (!response?.ok) {
                throw new Error("Failed to verify your session.")
            }
            const validationStatus = await response.status
            return validationStatus
        } catch (error) {
            throw error
        }
    } else {
        return
    }
}