"use client"

import * as React from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useDebouncedCallback } from "use-debounce"
import { applySearchParamUpdates, clampPage } from "./entity-master-detail.utils"

type UrlStateOptions<TTab extends string> = {
    defaultTab: TTab
    validTabs: readonly TTab[]
    defaultSegment?: string
    validSegments?: readonly string[]
    selectedIdParam?: string
}

export function useMasterDetailUrlState<TTab extends string>({
    defaultTab,
    validTabs,
    defaultSegment,
    validSegments,
    selectedIdParam = "selected",
}: UrlStateOptions<TTab>) {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const search = searchParams.get("search") ?? ""
    const selectedId = searchParams.get(selectedIdParam)
    const requestedTab = searchParams.get("tab") as TTab | null
    const activeTab = requestedTab && validTabs.includes(requestedTab) ? requestedTab : defaultTab
    const requestedSegment = searchParams.get("segment")
    const activeSegment = requestedSegment && validSegments?.includes(requestedSegment)
        ? requestedSegment
        : defaultSegment
    const page = clampPage(Number(searchParams.get("page") ?? 1))
    const pageSize = Math.min(50, Math.max(10, Number(searchParams.get("page_size") ?? 20) || 20))
    const filters = searchParams.get("filters") ?? "all"

    const update = React.useCallback((
        changes: Record<string, string | number | null | undefined>,
        mode: "push" | "replace" = "replace",
    ) => {
        const params = applySearchParamUpdates(searchParams, changes)
        const href = params.size ? `${pathname}?${params.toString()}` : pathname
        router[mode](href, { scroll: false })
    }, [pathname, router, searchParams])

    const setSearch = useDebouncedCallback((value: string) => {
        update({ search: value.trim() || null, page: null, [selectedIdParam]: null })
    }, 300)

    return {
        search,
        selectedId,
        activeTab,
        activeSegment,
        page,
        pageSize,
        filters,
        setSearch,
        setSelectedId: (id: string | null, options?: { replace?: boolean }) =>
            update({ [selectedIdParam]: id }, options?.replace ? "replace" : "push"),
        setActiveTab: (tab: TTab) => update({ tab }, "push"),
        setSegment: (segment: string) => update({ segment, page: null, [selectedIdParam]: null, tab: null }, "push"),
        setPage: (nextPage: number) => update({ page: nextPage <= 1 ? null : nextPage, [selectedIdParam]: null }, "push"),
        setFilters: (filters: string) => update({ filters: filters === "all" ? null : filters, page: null, [selectedIdParam]: null }, "push"),
        update,
    }
}
