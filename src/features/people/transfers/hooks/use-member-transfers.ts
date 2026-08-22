import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
    acceptMemberTransfer,
    cancelMemberTransfer,
    createMemberTransfer,
    getIncomingMemberTransfers,
    getMemberAssemblyMemberships,
    getMemberTransferHistory,
    getMemberTransfers,
    getOutgoingMemberTransfers,
    getTransferAssemblies,
    rejectMemberTransfer,
    type MemberTransferParams,
} from "../services/member-transfers"
import { useActiveAssemblyId } from "@/hooks/query/use-user"
import { assemblyQueryKeys } from "@/lib/query-keys"
import { buildTransferQueryKey } from "../utils/transfer-query-key"

export const memberTransferQueryKeys = {
    all: ["people", "member-transfers"] as const,
    scope: (assemblyId: string | number | null | undefined) =>
        assemblyQueryKeys.key(assemblyId, ...memberTransferQueryKeys.all),
    view: buildTransferQueryKey,
    memberships: (
        assemblyId: string | number | null | undefined,
        memberId: string | number,
    ) => [...memberTransferQueryKeys.scope(assemblyId), "memberships", String(memberId)] as const,
    assemblies: (assemblyId: string | number | null | undefined) =>
        assemblyQueryKeys.key(assemblyId, "people", "transfer-assemblies"),
}

export function useMemberTransfers(params: MemberTransferParams = {}) {
    const assemblyId = useActiveAssemblyId()
    return useQuery({
        queryKey: memberTransferQueryKeys.view(assemblyId, "all", params),
        queryFn: () => getMemberTransfers(params),
        enabled: Boolean(assemblyId),
    })
}

export function useIncomingMemberTransfers(params: MemberTransferParams = {}) {
    const assemblyId = useActiveAssemblyId()
    return useQuery({
        queryKey: memberTransferQueryKeys.view(assemblyId, "incoming", params),
        queryFn: () => getIncomingMemberTransfers(params),
        enabled: Boolean(assemblyId),
    })
}

export function useOutgoingMemberTransfers(params: MemberTransferParams = {}) {
    const assemblyId = useActiveAssemblyId()
    return useQuery({
        queryKey: memberTransferQueryKeys.view(assemblyId, "outgoing", params),
        queryFn: () => getOutgoingMemberTransfers(params),
        enabled: Boolean(assemblyId),
    })
}

export function useMemberTransferHistory(params: MemberTransferParams = {}) {
    const assemblyId = useActiveAssemblyId()
    return useQuery({
        queryKey: memberTransferQueryKeys.view(assemblyId, "history", params),
        queryFn: () => getMemberTransferHistory(params),
        enabled: Boolean(assemblyId),
    })
}

export function useMemberAssemblyMemberships(memberId: string | number) {
    const assemblyId = useActiveAssemblyId()
    return useQuery({
        queryKey: memberTransferQueryKeys.memberships(assemblyId, memberId),
        queryFn: () => getMemberAssemblyMemberships(memberId),
        enabled: Boolean(assemblyId && memberId),
    })
}

export function useTransferAssemblies() {
    const assemblyId = useActiveAssemblyId()
    return useQuery({
        queryKey: memberTransferQueryKeys.assemblies(assemblyId),
        queryFn: getTransferAssemblies,
        enabled: Boolean(assemblyId),
    })
}

function useInvalidateMemberTransfers() {
    const assemblyId = useActiveAssemblyId()
    const queryClient = useQueryClient()

    return () => queryClient.invalidateQueries({
        queryKey: memberTransferQueryKeys.scope(assemblyId),
    })
}

export function useCreateMemberTransfer() {
    const invalidateTransfers = useInvalidateMemberTransfers()
    return useMutation({
        mutationFn: createMemberTransfer,
        onSuccess: invalidateTransfers,
    })
}

export function useAcceptMemberTransfer() {
    const invalidateTransfers = useInvalidateMemberTransfers()
    return useMutation({
        mutationFn: acceptMemberTransfer,
        onSuccess: invalidateTransfers,
    })
}

export function useRejectMemberTransfer() {
    const invalidateTransfers = useInvalidateMemberTransfers()
    return useMutation({
        mutationFn: rejectMemberTransfer,
        onSuccess: invalidateTransfers,
    })
}

export function useCancelMemberTransfer() {
    const invalidateTransfers = useInvalidateMemberTransfers()
    return useMutation({
        mutationFn: cancelMemberTransfer,
        onSuccess: invalidateTransfers,
    })
}
