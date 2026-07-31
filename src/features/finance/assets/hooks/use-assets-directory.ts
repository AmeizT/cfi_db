import { useQuery } from "@tanstack/react-query"
import {
    getAssetsDirectory,
    type AssetsDirectoryParams,
} from "../services/get-assets-directory"
import type { AssetsListResponse } from "../schemas/asset"
import { useActiveAssemblyId } from "@/hooks/query/use-user"
import { assemblyQueryKeys, keepPreviousAssemblyData } from "@/lib/query-keys"

export function useAssetsDirectory(params: AssetsDirectoryParams) {
    const assemblyId = useActiveAssemblyId()
    const queryKey = assemblyQueryKeys.key(assemblyId, "finance", "assets", params.page ?? 1, params.pageSize ?? 10)
    return useQuery<AssetsListResponse>({
        queryKey,
        queryFn: () => getAssetsDirectory(params),
        placeholderData: (data, query) => keepPreviousAssemblyData(data, query, queryKey),
        enabled: Boolean(assemblyId),
    })
}
