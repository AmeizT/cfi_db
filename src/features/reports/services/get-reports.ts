"use server"

import { cookies } from "next/headers"
import { url } from "@/config/urls"
import { withJwt } from "@/config/headers"

export async function getReports(params: string) {
    const cookieStore = await cookies()
    const accessToken: string | undefined = cookieStore.get("accessToken")?.value ?? undefined

    try {
        const response = await fetch(`${url.reports}${params}`, withJwt(accessToken))
        if (!response.ok) {
            throw new Error("Failed to fetch reports. Please try again later.")
        }
        const reports = await response.json()
        return reports
    } catch (error) {
        throw error
    }
}