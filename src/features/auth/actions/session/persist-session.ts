"use server"

import axios from "axios"
import { url } from "@/config/urls"
import { cookies } from "next/headers"

export async function persistAuthSession() {
    const cookieStore = await cookies()
    const userId = cookieStore.get("userId")?.value
    const lastLogin = cookieStore.get("lastLogin")?.value
    const lastLogout = cookieStore.get("lastLogout")?.value

    if (!lastLogout) {
        return
    }

    const sessionData = {
        user: userId,
        last_login: lastLogin,
        last_logout: lastLogout
    }

    try {
        const response = await axios.post(url.sessionHistory, sessionData)

        if (response.status === 201) {
            clearAuthCookies()
        }
    } catch (error) {
        console.error("Failed to persist auth session.", error)
        throw new Error("Failed to update authentication history.")
    }
}

async function clearAuthCookies() {
    const cookieStore = await cookies()
    const cookiesToClear = ["lastLogin", "lastLogout", "userId"];
    cookiesToClear.forEach(cookieName => cookieStore.delete(cookieName))
}