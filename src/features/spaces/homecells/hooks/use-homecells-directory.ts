import { useQuery } from "@tanstack/react-query"
import { getHomecellsDirectory } from "../services/get-homecells-directory"
import type { HomecellsListResponse } from "../schemas/homecell"
import { useActiveAssemblyId } from "@/hooks/query/use-user"
import { assemblyQueryKeys } from "@/lib/query-keys"

export function useHomecellsDirectory() {
    const assemblyId = useActiveAssemblyId()
    return useQuery<HomecellsListResponse>({
        queryKey: assemblyQueryKeys.key(assemblyId, "spaces", "homecells"),
        queryFn: () => getHomecellsDirectory(),
        enabled: Boolean(assemblyId),
    })
}
