import { keepPreviousData, useQuery } from "@tanstack/react-query"
import {
    getAssetsDirectory,
    type AssetsDirectoryParams,
} from "../services/get-assets-directory"
import type { AssetsListResponse } from "../schemas/asset"

export function useAssetsDirectory(params: AssetsDirectoryParams) {
    return useQuery<AssetsListResponse>({
        queryKey: [
            "finance",
            "assets",
            params.page ?? 1,
            params.pageSize ?? 10,
        ],
        queryFn: () => getAssetsDirectory(params),
        placeholderData: keepPreviousData,
    })
}
