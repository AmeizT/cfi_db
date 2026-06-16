"use server"

import { url } from "@/config/urls"
import { cookies } from "next/headers"

interface ReportEndpoint {
    pkey: string
    endpoint: string
}

export async function getReportDetails({ pkey, endpoint }: ReportEndpoint) {
    const cookieStore = await cookies()
    const COMPUTED_URL = `${url.reports}${pkey}/${endpoint}`
    console.log(COMPUTED_URL)

    try {
        const response = await fetch(COMPUTED_URL, {
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