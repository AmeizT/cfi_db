"use server"

import { cookies } from "next/headers"

export async function fetcher <T,>(url: string): Promise<T>{
    const cookieStore = await cookies()
    const accessToken: string | undefined = cookieStore.get("accessToken")?.value ?? undefined

    console.log("fetcher accessToken", accessToken)

    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${accessToken}`,
            "Content-Type": "application/json"
        },
        credentials: "include"
    })

    if (!response.ok) {
        throw new Error("Authentication failed")
    }

    return response.json()
}