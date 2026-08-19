import { useQuery } from "@tanstack/react-query"
import {
    getMembersDirectory,
    getMembersDirectoryPage,
    getMemberDetail,
    type MembersDirectoryParams,
} from "../services/get-members-directory"
import type { MembersListResponse } from "../schemas/member"
import type { Member, MembersPage } from "../schemas/member"
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

export function useMembersDirectoryPage(params: MembersDirectoryParams) {
    const assemblyId = useActiveAssemblyId()
    const queryKey = assemblyQueryKeys.key(assemblyId, "people", "member-directory", params)
    return useQuery<MembersPage>({
        queryKey,
        queryFn: () => getMembersDirectoryPage(params),
        placeholderData: (data, query) => keepPreviousAssemblyData(data, query, queryKey),
        enabled: Boolean(assemblyId),
    })
}

export function useMemberDetail(memberKey?: string | null) {
    const assemblyId = useActiveAssemblyId()
    return useQuery<Member>({
        queryKey: assemblyQueryKeys.key(assemblyId, "people", "member", memberKey ?? "none"),
        queryFn: () => getMemberDetail(memberKey!),
        enabled: Boolean(assemblyId && memberKey),
    })
}
