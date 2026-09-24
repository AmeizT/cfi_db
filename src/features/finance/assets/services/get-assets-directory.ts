"use server"

import { cookies } from "next/headers"
import { apiRoutes } from "@/config/urls"
import { withJwt } from "@/config/headers"
import {
    AssetSchema,
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

export async function getAssetDetail(id: string) {
    const token = (await cookies()).get("accessToken")?.value
    const response = await fetch(apiRoutes.finance.assets.detail(id), {
        ...withJwt(token),
        cache: "no-store",
    })
    if (!response.ok) throw new Error("The saved asset could not be loaded. Refresh the collection to check it.")
    return AssetSchema.parse(await response.json())
}
