"use server"

import { cookies } from "next/headers"
import { url } from "@/config/urls"
import { withJwt } from "@/config/headers"

export async function getFinanceSummary(params: string) {
    const cookieStore = await cookies()
    const accessToken: string | undefined = cookieStore.get("accessToken")?.value ?? undefined

    try {
        const res = await fetch(`${url.financeSummary}${params}`, withJwt(accessToken))
        if (!res.ok) {
            throw new Error("Failed to fetch assets. Please try again later.")
        }
        const assets = await res.json()
        return assets
    } catch (error) {
        throw error
    }
}