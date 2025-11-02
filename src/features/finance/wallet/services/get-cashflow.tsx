"use server"

import { cookies } from "next/headers"
import { url } from "@/config/urls"
import { withJwt } from "@/config/headers"

export async function getCashflow(params: string) {
    const cookieStore = await cookies()
    const accessToken: string | undefined = cookieStore.get("accessToken")?.value ?? undefined

    try {
        const res = await fetch(`${url.yearlySummary}${params}`, withJwt(accessToken))
        if (!res.ok) {
            throw new Error("Failed to fetch cashflow. Please try again later.")
        }
        const data = await res.json()
        return data
    } catch (error) {
        throw error
    }
}