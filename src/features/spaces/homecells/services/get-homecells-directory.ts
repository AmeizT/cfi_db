"use server"

import { cookies } from "next/headers"
import { apiRoutes } from "@/config/urls"
import { withJwt } from "@/config/headers"
import {
    HomecellsListResponseSchema,
    type HomecellsListResponse,
} from "../schemas/homecell"

export async function getHomecellsDirectory(): Promise<HomecellsListResponse> {
    const cookieStore = await cookies()
    const accessToken = cookieStore.get("accessToken")?.value

    const response = await fetch(apiRoutes.spaces.homecells.list(), {
        ...withJwt(accessToken),
        cache: "no-store",
    })

    if (!response.ok) {
        throw new Error("Failed to fetch home cells.")
    }

    return HomecellsListResponseSchema.parse(await response.json())
}
