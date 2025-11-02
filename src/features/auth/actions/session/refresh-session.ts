"use server"

import { cookies } from "next/headers"
import axios, { AxiosError } from "axios"
import { url } from "@/config/urls"
import { jsonHeaders } from "@/config/headers"

export async function refreshSession() {
    const cookieStore = await cookies()
    const refreshToken = cookieStore.get("refreshToken")?.value

    if (!refreshToken) {
        throw new Error("No refresh token found. Please sign in again.")
    }

    try {
        const response = await axios.post(
            url.refreshSession,
            { refresh: refreshToken },
            jsonHeaders
        )

        if (response.status === 200 && response.data?.access) {
            const newAccessToken = response.data.access

            cookieStore.set({
                name: "accessToken",
                value: newAccessToken,
                httpOnly: true,
                path: "/",
                secure: process.env.NODE_ENV === "production",
                maxAge: 60 * 60, // 1 hour
                sameSite: "strict",
            })

            return newAccessToken
        } else {
            throw new Error("Invalid server response while refreshing session.")
        }
    } catch (error) {
        const axiosError = error as AxiosError

        if (axiosError.response) {
            console.error("Session refresh failed:", axiosError.response.data)
        } else if (axiosError.request) {
            console.error("No response from server during session refresh:", axiosError.message)
        } else {
            console.error("Unexpected error during session refresh:", axiosError.message)
        }

        throw new Error("Session refresh failed. Please log in again.")
    }
}