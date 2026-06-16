"use server"

import { cookies } from "next/headers"
import { url } from "@/config/urls"
import { withJwt } from "@/config/headers"

export async function getReport(id: string) {
    const cookieStore = await cookies()
    const accessToken: string | undefined = cookieStore.get("accessToken")?.value ?? undefined

    try {
        const response = await fetch(`${url.reports}${id}`, withJwt(accessToken))
        if (!response.ok) {
            throw new Error("Failed to fetch report. Please try again later.")
        }
        const report = await response.json()
        return report
    } catch (error) {
        throw error
    }
}