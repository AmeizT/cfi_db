"use client"

import * as React from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useDataTablePagination } from "@/features/reports/core/components/hooks/useDataTablePagination"

type UseRegionalDirectoryTableStateOptions = {
    defaultOrdering?: string
}

export function useRegionalDirectoryTableState({
    defaultOrdering,
}: UseRegionalDirectoryTableStateOptions = {}) {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const pagination = useDataTablePagination()

    const search = searchParams.get("search") ?? ""
    const ordering = searchParams.get("ordering") ?? defaultOrdering ?? ""

    const updateTableParams = React.useCallback(
        (updates: Record<string, string | null>) => {
            const params = new URLSearchParams(searchParams.toString())

            Object.entries(updates).forEach(([key, value]) => {
                if (value === null || value === "") {
                    params.delete(key)
                } else {
                    params.set(key, value)
                }
            })

            const query = params.toString()
            router.replace(query ? `${pathname}?${query}` : pathname, {
                scroll: false,
            })
        },
        [pathname, router, searchParams]
    )

    const onSearchChange = React.useCallback(
        (value: string) => {
            const nextSearch = value.trim()
            updateTableParams({
                search: nextSearch || null,
                page: "1",
            })
        },
        [updateTableParams]
    )

    const onSortChange = React.useCallback(
        (value: string) => {
            updateTableParams({
                ordering: value || null,
                page: "1",
            })
        },
        [updateTableParams]
    )

    const queryParams = React.useMemo(
        () => ({
            page: pagination.currentPage,
            pageSize: pagination.pageSize,
            search,
            ordering,
        }),
        [ordering, pagination.currentPage, pagination.pageSize, search]
    )

    return {
        ...pagination,
        search,
        ordering,
        queryParams,
        onSearchChange,
        onSortChange,
    }
}
