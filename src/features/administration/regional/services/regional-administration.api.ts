import { apiClient, apiRoutes } from "@/config/urls"
import type {
    PaginatedResponse,
    RegionalAssembly,
    RegionalListParams,
    RegionalUser,
} from "../types/regional-administration"

function buildQueryString({
    page,
    pageSize,
    search,
    ordering,
}: RegionalListParams) {
    const params = new URLSearchParams()

    if (page) {
        params.set("page", String(page))
    }

    if (pageSize) {
        params.set("page_size", String(pageSize))
    }

    if (search?.trim()) {
        params.set("search", search.trim())
    }

    if (ordering?.trim()) {
        params.set("ordering", ordering.trim())
    }

    const query = params.toString()
    return query ? `?${query}` : ""
}

export function getRegionalAssemblies(params: RegionalListParams = {}) {
    return apiClient.get<PaginatedResponse<RegionalAssembly>>(
        `${apiRoutes.regionalAdministration.assemblies()}${buildQueryString(params)}`
    )
}

export function getRegionalUsers(params: RegionalListParams = {}) {
    return apiClient.get<PaginatedResponse<RegionalUser>>(
        `${apiRoutes.regionalAdministration.users()}${buildQueryString(params)}`
    )
}
