import { useQuery } from "@tanstack/react-query"
import { getHomecells } from "../services/get-homecells"
import { useActiveAssemblyId } from "@/hooks/query/use-user"
import { assemblyQueryKeys } from "@/lib/query-keys"

export function useHomecell() {
    const assemblyId = useActiveAssemblyId()
    return useQuery({
        queryKey: assemblyQueryKeys.key(assemblyId, "homecells"),
        queryFn: () => getHomecells(),
        enabled: Boolean(assemblyId),
    })
}
