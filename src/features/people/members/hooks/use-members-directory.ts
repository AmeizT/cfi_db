import { useQuery } from "@tanstack/react-query"
import {
    getMembersDirectory,
    type MembersDirectoryParams,
} from "../services/get-members-directory"
import type { MembersListResponse } from "../schemas/member"
import { useActiveAssemblyId } from "@/hooks/query/use-user"
import { assemblyQueryKeys, keepPreviousAssemblyData } from "@/lib/query-keys"

export function useMembersDirectory(params: MembersDirectoryParams) {
    const assemblyId = useActiveAssemblyId()
    const queryKey = assemblyQueryKeys.key(assemblyId, "people", "members", params.group ?? "all", params.search?.trim() ?? "")
    return useQuery<MembersListResponse>({
        queryKey,
        queryFn: () => getMembersDirectory(params),
        placeholderData: (data, query) => keepPreviousAssemblyData(data, query, queryKey),
        enabled: Boolean(assemblyId),
    })
}
