"use server"

import { url } from "@/config/urls"
import { cookies } from "next/headers"

export async function getReports(params: string) {
    const cookieStore = await cookies()

    try {
        const response = await fetch(`${url.reports}${params}`, {
            headers: {
                Cookie: cookieStore.toString(),
            },
            cache: "no-store",
        })
        if (!response.ok) {
            throw new Error("Failed to fetch reports. Please try again later.")
        }
        const reports = await response.json()
        return reports
    } catch (error) {
        throw error
    }
}