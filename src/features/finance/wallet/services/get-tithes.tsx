"use server"

import { cookies } from "next/headers"
import { url } from "@/config/urls"
import { withJwt } from "@/config/headers"

export async function getTithes() {
    const cookieStore = await cookies()
    const tithesURL = url.tithes
    const accessToken: string | undefined = cookieStore.get("accessToken")?.value ?? undefined

    try {
        const res = await fetch(tithesURL, withJwt(accessToken))
        if (!res.ok) {
            throw new Error("Failed to fetch tithes. Please try again later.")
        }
        const tithes = await res.json()
        return tithes
    } catch (error) {
        throw error
    }
}

export async function getTrashedTithes() {
    const cookieStore = await cookies()
    const tithesURL = url.trashedTithes
    const accessToken: string | undefined = cookieStore.get("accessToken")?.value ?? undefined

    try {
        const res = await fetch(tithesURL, withJwt(accessToken))
        if (!res.ok) {
            throw new Error("Failed to fetch tithes. Please try again later.")
        }
        const tithes = await res.json()
        return tithes
    } catch (error) {
        throw error
    }
}