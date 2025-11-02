"use server"

import { url } from "@/config/urls"
import { cookies } from "next/headers"
import { withJwt } from "@/config/headers"

export async function getHomecells() {
    const cookieStore = await cookies()
    const accessToken: string | undefined = cookieStore.get("accessToken")?.value ?? undefined

    try {
        const res = await fetch(url.homecells, withJwt(accessToken))
        if (!res.ok) {
            throw new Error("Failed to fetch homecells data. Please try again later.")
        }
        const homecells = await res.json()
        return homecells
    } catch (error) {
        throw error
    }
}