"use server"

import { cookies } from "next/headers"
import { apiRoutes } from "@/config/urls"
import { withJwt } from "@/config/headers"
import {
    AssetsListResponseSchema,
    type AssetsListResponse,
} from "../schemas/asset"

export type AssetsDirectoryParams = {
    page?: number
    pageSize?: number
}

function buildAssetsQuery({ page, pageSize }: AssetsDirectoryParams) {
    const params = new URLSearchParams()

    if (page) {
        params.set("page", String(page))
    }

    if (pageSize) {
        params.set("page_size", String(pageSize))
    }

    const query = params.toString()
    return query ? `?${query}` : ""
}

export async function getAssetsDirectory(
    params: AssetsDirectoryParams = {}
): Promise<AssetsListResponse> {
    const cookieStore = await cookies()
    const accessToken = cookieStore.get("accessToken")?.value
    const endpoint = `${apiRoutes.finance.assets.list()}${buildAssetsQuery(params)}`

    const response = await fetch(endpoint, {
        ...withJwt(accessToken),
        cache: "no-store",
    })

    if (!response.ok) {
        throw new Error("Failed to fetch assets.")
    }

    return AssetsListResponseSchema.parse(await response.json())
}
