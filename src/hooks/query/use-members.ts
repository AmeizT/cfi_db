import { useQuery } from "@tanstack/react-query"
import { getMembers } from "@/features/people/services/get-members"
import { useActiveAssemblyId } from "./use-user"
import { assemblyQueryKeys } from "@/lib/query-keys"

export function useMembers() {
    const assemblyId = useActiveAssemblyId()
    return useQuery({
        queryKey: assemblyQueryKeys.key(assemblyId, "members"),
        queryFn: () => getMembers(),
        enabled: Boolean(assemblyId),
    })
}
