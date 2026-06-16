"use server"

import React from "react"
import { url } from "@/config/urls"
import { cookies } from "next/headers"
import { User, UserSchema } from "../schemas/user"

export const getUser = React.cache(async () => {
    const cookieStore = await cookies()

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 5000)

    try {
        const response = await fetch(url.currentUser, {
            headers: {
                Cookie: cookieStore.toString(),
            },
            signal: controller.signal
        })

        clearTimeout(timeout)

        if (response.status === 401) {
            console.warn("User is unauthorized, likely due to an expired token.")
            return null
        }

        if (response.status === 403) {
            console.error("Access denied: insufficient permissions.")
            return null
        }

        if (!response.ok) {
            throw new Error(`Request failed with status ${response.status}`)
        }

        const user: User = await response.json()

        if (!isValidUser(user)) {
            throw new Error("Invalid user data received")
        }

        return user

    } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
            console.error("Request timed out")
        } else if (error instanceof TypeError) {
            console.error("Network error: possible connectivity issues")
        } else {
            console.error("User session fetch error:", error)
        }

        return null
    }
})

function isValidUser(user: unknown): user is User {
    return UserSchema.safeParse(user).success
}