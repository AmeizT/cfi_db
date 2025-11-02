"use server"

import { cookies } from "next/headers"
import { url } from "@/config/urls"
import { withJwt } from "@/config/headers"

export async function getAttendance() {
    const cookieStore = await cookies()
    const accessToken: string | undefined = cookieStore.get("accessToken")?.value ?? undefined

    try {
        const res = await fetch(url.attendance, withJwt(accessToken))
        if (!res.ok) {
            throw new Error("Failed to fetch attendance data. Please try again later.")
        }
        const attendance = await res.json()
        return attendance
    } catch (error) {
        throw error
    }
}