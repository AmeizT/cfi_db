"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { apiRoutes } from "@/config/urls"
import { useActiveAssemblyId } from "@/hooks/query/use-user"
import { assemblyQueryKeys } from "@/lib/query-keys"

export type BatchKind = "tithes" | "revenue" | "overhead" | "expenses"

const endpoints = {
    tithes: apiRoutes.finance.tithes.batch,
    revenue: apiRoutes.finance.revenue.batch,
    overhead: apiRoutes.finance.overhead.batch,
    expenses: apiRoutes.finance.expenditures.batch,
} satisfies Record<BatchKind, () => string>

export type BatchErrorBody = {
    message?: string
    errors?: { entries?: Record<string, Record<string, string[] | string>> }
}

export class BatchRequestError extends Error {
    body: BatchErrorBody
    constructor(body: BatchErrorBody) {
        super(body.message || "Could not save entries.")
        this.body = body
    }
}

export function useBatchEntry(kind: BatchKind) {
    const assemblyId = useActiveAssemblyId()
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (body: FormData) => {
            const response = await fetch(endpoints[kind](), { method: "POST", credentials: "include", body })
            const data = await response.json().catch(() => ({}))
            if (!response.ok) throw new BatchRequestError(data)
            return data
        },
        onSuccess: async () => {
            await Promise.all([
                queryClient.invalidateQueries({ queryKey: assemblyQueryKeys.scope(assemblyId) }),
                queryClient.invalidateQueries({ queryKey: ["reports"] }),
                queryClient.invalidateQueries({ queryKey: [kind] }),
                queryClient.invalidateQueries({ queryKey: ["finance"] }),
            ])
        },
    })
}

async function fetchOptions(url: string) {
    const response = await fetch(url, { credentials: "include" })
    if (!response.ok) throw new Error("Could not load entry options.")
    const data = await response.json()
    return Array.isArray(data) ? data : data.results ?? []
}

export function useFinancialEntryOptions(kind: BatchKind) {
    const assemblyId = useActiveAssemblyId()
    const url = kind === "tithes"
        ? `${apiRoutes.members.list()}?page_size=100`
        : kind === "revenue"
            ? apiRoutes.finance.revenue.categories()
            : kind === "overhead"
                ? apiRoutes.finance.overhead.types()
                : null
    return useQuery<Array<Record<string, unknown>>>({
        queryKey: assemblyQueryKeys.key(assemblyId, "manual-entry-options", kind),
        queryFn: () => fetchOptions(url!),
        enabled: Boolean(assemblyId && url),
    })
}

export function useCreateFinancialOption(kind: "revenue" | "overhead") {
    const assemblyId = useActiveAssemblyId()
    const queryClient = useQueryClient()
    const url = kind === "revenue" ? apiRoutes.finance.revenue.categories() : apiRoutes.finance.overhead.types()
    return useMutation({
        mutationFn: async (name: string) => {
            const response = await fetch(url, {
                method: "POST", credentials: "include", headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name }),
            })
            const body = await response.json().catch(() => ({}))
            if (!response.ok) throw new Error(body.detail || "Could not create the option.")
            return body as Record<string, unknown>
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: assemblyQueryKeys.key(assemblyId, "manual-entry-options", kind) })
        },
    })
}
