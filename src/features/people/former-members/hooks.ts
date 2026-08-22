import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useActiveAssemblyId } from "@/hooks/query/use-user"
import { assemblyQueryKeys } from "@/lib/query-keys"
import { getFormerMember, getFormerMembers, readmitFormerMember, type FormerMemberParams } from "./service"

export const formerMemberQueryKeys = {
    all: ["people", "former-members"] as const,
    list: (params: FormerMemberParams) => [...formerMemberQueryKeys.all, params] as const,
}

export function useFormerMember(id?: string | null) {
    const assemblyId = useActiveAssemblyId()
    return useQuery({
        queryKey: assemblyQueryKeys.key(assemblyId, "people", "former-member", id ?? "none"),
        queryFn: () => getFormerMember(id!),
        enabled: Boolean(assemblyId && id),
    })
}

export function useReadmitFormerMember() {
    const assemblyId = useActiveAssemblyId()
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: readmitFormerMember,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: assemblyQueryKeys.scope(assemblyId) }),
    })
}

export function useFormerMembers(params: FormerMemberParams = {}) {
    const assemblyId = useActiveAssemblyId()
    return useQuery({
        queryKey: assemblyQueryKeys.key(assemblyId, ...formerMemberQueryKeys.list(params)),
        queryFn: () => getFormerMembers(params),
        enabled: Boolean(assemblyId),
    })
}
