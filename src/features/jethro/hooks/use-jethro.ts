import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { useActiveAssemblyId } from "@/hooks/query/use-user"
import { assemblyQueryKeys } from "@/lib/query-keys"
import {
    archiveJethroConversation,
    cancelTithe,
    confirmTithe,
    createJethroConversation,
    getJethroConversation,
    getJethroConversations,
    getJethroStatus,
    getTitheMemberCandidates,
    selectTitheMember,
    sendJethroMessage,
} from "../services/jethro"

export const jethroKeys = {
    all: (assemblyId?: string) => assemblyQueryKeys.key(assemblyId, "jethro"),
    conversations: (assemblyId?: string) => [...jethroKeys.all(assemblyId), "conversations"] as const,
    detail: (assemblyId: string | undefined, id: string) => [...jethroKeys.all(assemblyId), "conversation", id] as const,
}

export function useJethroConversations() {
    const assemblyId = useActiveAssemblyId()
    return useQuery({
        queryKey: jethroKeys.conversations(assemblyId),
        queryFn: getJethroConversations,
        enabled: Boolean(assemblyId),
    })
}

export function useJethroStatus() {
    const assemblyId = useActiveAssemblyId()
    return useQuery({
        queryKey: [...jethroKeys.all(assemblyId), "status"],
        queryFn: getJethroStatus,
        enabled: Boolean(assemblyId),
        staleTime: 60_000,
    })
}

export function useJethroConversation(id?: string) {
    const assemblyId = useActiveAssemblyId()
    return useQuery({
        queryKey: jethroKeys.detail(assemblyId, id || "new"),
        queryFn: () => getJethroConversation(id!),
        enabled: Boolean(assemblyId && id),
    })
}

function useInvalidateJethro() {
    const assemblyId = useActiveAssemblyId()
    const client = useQueryClient()
    return () => client.invalidateQueries({ queryKey: jethroKeys.all(assemblyId) })
}

export function useSendJethroMessage() {
    const invalidate = useInvalidateJethro()
    return useMutation({
        mutationFn: sendJethroMessage,
        onSuccess: invalidate,
        onError: (error) => toast.error(error.message),
    })
}

export function useCreateJethroConversation() {
    const invalidate = useInvalidateJethro()
    return useMutation({ mutationFn: createJethroConversation, onSuccess: invalidate })
}

export function useArchiveJethroConversation() {
    const invalidate = useInvalidateJethro()
    return useMutation({ mutationFn: archiveJethroConversation, onSuccess: invalidate })
}

export function useTitheMemberCandidates(draftId: string, query: string, page: number) {
    const assemblyId = useActiveAssemblyId()
    return useQuery({
        queryKey: [...jethroKeys.all(assemblyId), "tithe-draft", draftId, "members", query, page],
        queryFn: () => getTitheMemberCandidates({ draftId, query, page }),
        enabled: Boolean(assemblyId && draftId),
    })
}

export function useSelectTitheMember() {
    const invalidate = useInvalidateJethro()
    return useMutation({
        mutationFn: selectTitheMember,
        onSuccess: invalidate,
        onError: (error) => toast.error(error.message),
    })
}

export function useConfirmTithe() {
    const invalidate = useInvalidateJethro()
    return useMutation({
        mutationFn: confirmTithe,
        onSuccess: invalidate,
        onError: (error) => toast.error(error.message),
    })
}

export function useCancelTithe() {
    const invalidate = useInvalidateJethro()
    return useMutation({
        mutationFn: cancelTithe,
        onSuccess: invalidate,
        onError: (error) => toast.error(error.message),
    })
}
