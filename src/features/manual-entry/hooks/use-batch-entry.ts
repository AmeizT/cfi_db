"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { apiRoutes } from "@/config/urls"
import { useActiveAssemblyId } from "@/hooks/query/use-user"
import { assemblyQueryKeys } from "@/lib/query-keys"

export type BatchKind = "tithes" | "revenue" | "overhead" | "expenses"
export type FinancialCategoryKind = "revenue" | "overhead"

export type FinancialCategoryOption = {
    id: number | string
    name: string
    normalized_name?: string
    kind: FinancialCategoryKind
    assembly?: number | string | null
    is_custom: boolean
    is_standard?: boolean
    is_global?: boolean
    reporting_group?: string
    usage_count?: number
    needs_review?: boolean
    standard_category?: {
        id: number | string
        name: string
        reporting_group?: string
    } | null
}

export type FinancialCategorySuggestions = {
    assembly_name: string
    assembly_matches: FinancialCategoryOption[]
    standard_matches: FinancialCategoryOption[]
}

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
    return useQuery<Array<FinancialCategoryOption & Record<string, unknown>>>({
        queryKey: assemblyQueryKeys.key(assemblyId, "manual-entry-options", kind),
        queryFn: () => fetchOptions(url!),
        enabled: Boolean(assemblyId && url),
    })
}

export function useFinancialCategorySuggestions(
    kind: FinancialCategoryKind,
    query: string,
) {
    const assemblyId = useActiveAssemblyId()
    const normalizedQuery = query.trim()
    const url = kind === "revenue"
        ? apiRoutes.finance.revenue.suggestions()
        : apiRoutes.finance.overhead.suggestions()

    return useQuery<FinancialCategorySuggestions>({
        queryKey: assemblyQueryKeys.key(
            assemblyId,
            "financial-category-suggestions",
            kind,
            normalizedQuery,
        ),
        queryFn: async ({ signal }) => {
            const params = new URLSearchParams({ q: normalizedQuery })
            const response = await fetch(`${url}?${params}`, {
                credentials: "include",
                signal,
            })
            const body = await response.json().catch(() => ({}))
            if (!response.ok) {
                throw new Error(body.detail || "Could not search financial categories.")
            }
            return body as FinancialCategorySuggestions
        },
        enabled: Boolean(assemblyId && normalizedQuery.length >= 2),
        staleTime: 30_000,
    })
}

export type CreateFinancialCategoryInput = {
    name: string
    standard_category_id: number | string | null
    needs_review: boolean
}

export function useCreateFinancialOption(kind: FinancialCategoryKind) {
    const assemblyId = useActiveAssemblyId()
    const queryClient = useQueryClient()
    const url = kind === "revenue" ? apiRoutes.finance.revenue.categories() : apiRoutes.finance.overhead.types()
    return useMutation({
        mutationFn: async (input: CreateFinancialCategoryInput | string) => {
            const payload: CreateFinancialCategoryInput = typeof input === "string"
                ? { name: input, standard_category_id: null, needs_review: true }
                : input
            const response = await fetch(url, {
                method: "POST", credentials: "include", headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            })
            const body = await response.json().catch(() => ({}))
            if (!response.ok) {
                const message = body.name?.[0]
                    || body.standard_category_id?.[0]
                    || body.non_field_errors?.[0]
                    || body.detail
                    || "Could not create the option."
                throw new Error(message)
            }
            return body as FinancialCategoryOption
        },
        onSuccess: async (created) => {
            queryClient.setQueryData<Array<FinancialCategoryOption>>(
                assemblyQueryKeys.key(assemblyId, "manual-entry-options", kind),
                (current = []) => current.some((option) => String(option.id) === String(created.id))
                    ? current
                    : [...current, created].sort((left, right) => left.name.localeCompare(right.name)),
            )
            await queryClient.invalidateQueries({ queryKey: assemblyQueryKeys.key(assemblyId, "manual-entry-options", kind) })
        },
    })
}
