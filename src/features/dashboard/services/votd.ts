"use server"

import { apiRoutes } from "@/config/urls"
import { cookies } from "next/headers"
import { Votd } from "../types/votd";

export async function getVotd(): Promise<Votd> {
    const cookieStore = await cookies()
   
    try {
        const response = await fetch(`${apiRoutes.scripture.list()}`, {
            headers: {
                Cookie: cookieStore.toString(),
            },
            cache: "no-store",
        })
        if (!response.ok) {
            throw new Error("Failed to fetch votd. Please try again later.")
        }
        const votd = await response.json()
        return votd
    } catch (error) {
        throw error
    }
}



