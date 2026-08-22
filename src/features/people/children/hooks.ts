import { useQuery } from "@tanstack/react-query"
import { useActiveAssemblyId } from "@/hooks/query/use-user"
import { assemblyQueryKeys, keepPreviousAssemblyData } from "@/lib/query-keys"
import { getChildrenDirectory, type ChildrenDirectoryParams } from "./service"

export function useChildrenDirectory(params: ChildrenDirectoryParams) {
    const assemblyId = useActiveAssemblyId()
    const queryKey = assemblyQueryKeys.key(assemblyId, "people", "children", params)
    return useQuery({
        queryKey,
        queryFn: () => getChildrenDirectory(params),
        enabled: Boolean(assemblyId),
        placeholderData: (data, query) => keepPreviousAssemblyData(data, query, queryKey),
    })
}
