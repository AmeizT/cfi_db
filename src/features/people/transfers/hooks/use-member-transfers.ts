import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query"
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

export const memberTransferQueryKeys = {
    all: ["people", "member-transfers"] as const,
    list: (params: MemberTransferParams = {}) =>
        [...memberTransferQueryKeys.all, "list", params] as const,
    incoming: (params: MemberTransferParams = {}) =>
        [...memberTransferQueryKeys.all, "incoming", params] as const,
    outgoing: (params: MemberTransferParams = {}) =>
        [...memberTransferQueryKeys.all, "outgoing", params] as const,
    history: (memberId?: string | number) =>
        [...memberTransferQueryKeys.all, "history", memberId ?? "all"] as const,
    memberships: (memberId: string | number) =>
        [...memberTransferQueryKeys.all, "memberships", String(memberId)] as const,
    assemblies: ["people", "transfer-assemblies"] as const,
}

export function useMemberTransfers(params: MemberTransferParams = {}) {
    return useQuery({
        queryKey: memberTransferQueryKeys.list(params),
        queryFn: () => getMemberTransfers(params),
        placeholderData: keepPreviousData,
    })
}

export function useIncomingMemberTransfers(params: MemberTransferParams = {}) {
    return useQuery({
        queryKey: memberTransferQueryKeys.incoming(params),
        queryFn: () => getIncomingMemberTransfers(params),
        placeholderData: keepPreviousData,
    })
}

export function useOutgoingMemberTransfers(params: MemberTransferParams = {}) {
    return useQuery({
        queryKey: memberTransferQueryKeys.outgoing(params),
        queryFn: () => getOutgoingMemberTransfers(params),
        placeholderData: keepPreviousData,
    })
}

export function useMemberTransferHistory(memberId?: string | number) {
    return useQuery({
        queryKey: memberTransferQueryKeys.history(memberId),
        queryFn: () => getMemberTransferHistory(memberId),
        placeholderData: keepPreviousData,
    })
}

export function useMemberAssemblyMemberships(memberId: string | number) {
    return useQuery({
        queryKey: memberTransferQueryKeys.memberships(memberId),
        queryFn: () => getMemberAssemblyMemberships(memberId),
        enabled: Boolean(memberId),
    })
}

export function useTransferAssemblies() {
    return useQuery({
        queryKey: memberTransferQueryKeys.assemblies,
        queryFn: getTransferAssemblies,
        placeholderData: keepPreviousData,
    })
}

export function useCreateMemberTransfer() {
    return useMutation({
        mutationFn: createMemberTransfer,
    })
}

export function useAcceptMemberTransfer() {
    return useMutation({
        mutationFn: acceptMemberTransfer,
    })
}

export function useRejectMemberTransfer() {
    return useMutation({
        mutationFn: rejectMemberTransfer,
    })
}

export function useCancelMemberTransfer() {
    return useMutation({
        mutationFn: cancelMemberTransfer,
    })
}
