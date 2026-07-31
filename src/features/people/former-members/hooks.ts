import { useQuery } from "@tanstack/react-query"
import { useActiveAssemblyId } from "@/hooks/query/use-user"
import { assemblyQueryKeys } from "@/lib/query-keys"
import { getFormerMembers, type FormerMemberParams } from "./service"

export const formerMemberQueryKeys = {
    all: ["people", "former-members"] as const,
    list: (params: FormerMemberParams) => [...formerMemberQueryKeys.all, params] as const,
}

export function useFormerMembers(params: FormerMemberParams = {}) {
    const assemblyId = useActiveAssemblyId()
    return useQuery({
        queryKey: assemblyQueryKeys.key(assemblyId, ...formerMemberQueryKeys.list(params)),
        queryFn: () => getFormerMembers(params),
        enabled: Boolean(assemblyId),
    })
}
