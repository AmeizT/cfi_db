import { keepPreviousData, useQuery } from "@tanstack/react-query"
import {
    getRegionalAssemblies,
    getRegionalUsers,
} from "../services/regional-administration.api"
import type {
    PaginatedResponse,
    RegionalAssembly,
    RegionalListParams,
    RegionalUser,
} from "../types/regional-administration"

function getRegionalDirectoryQueryKey(
    resource: "assemblies" | "users",
    params: RegionalListParams
) {
    return [
        "regional-administration",
        resource,
        params.page ?? 1,
        params.pageSize ?? 10,
        params.search ?? "",
        params.ordering ?? "",
    ] as const
}

export function useRegionalAssemblies(params: RegionalListParams) {
    return useQuery<PaginatedResponse<RegionalAssembly>>({
        queryKey: getRegionalDirectoryQueryKey("assemblies", params),
        queryFn: () => getRegionalAssemblies(params),
        placeholderData: keepPreviousData,
    })
}

export function useRegionalUsers(params: RegionalListParams) {
    return useQuery<PaginatedResponse<RegionalUser>>({
        queryKey: getRegionalDirectoryQueryKey("users", params),
        queryFn: () => getRegionalUsers(params),
        placeholderData: keepPreviousData,
    })
}
