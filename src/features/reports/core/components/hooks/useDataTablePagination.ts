"use client"

import * as React from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

const DEFAULT_PAGE = 1
const DEFAULT_PAGE_SIZE = 10
const PAGE_SIZE_OPTIONS = [10, 25, 50, 100]

function parsePositiveInteger(value: string | null, fallback: number) {
    const parsed = Number(value)

    if (!Number.isInteger(parsed) || parsed < 1) {
        return fallback
    }

    return parsed
}

function parsePageSize(value: string | null, fallback: number) {
    const parsed = parsePositiveInteger(value, fallback)

    return PAGE_SIZE_OPTIONS.includes(parsed)
        ? parsed
        : fallback
}

type UseDataTablePaginationOptions = {
    defaultPage?: number
    defaultPageSize?: number
}

export function useDataTablePagination({
    defaultPage = DEFAULT_PAGE,
    defaultPageSize = DEFAULT_PAGE_SIZE,
}: UseDataTablePaginationOptions = {}) {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const currentPage = parsePositiveInteger(
        searchParams.get("page"),
        defaultPage
    )
    const pageSize = parsePageSize(searchParams.get("page_size"), defaultPageSize)

    const updatePaginationParams = React.useCallback(
        (updates: { page: number; pageSize?: number }) => {
            const params = new URLSearchParams(searchParams.toString())
            params.set("page", String(updates.page))

            if (updates.pageSize) {
                params.set("page_size", String(updates.pageSize))
            } else if (!params.get("page_size")) {
                params.set("page_size", String(pageSize))
            }

            const query = params.toString()
            router.replace(query ? `${pathname}?${query}` : pathname, {
                scroll: false,
            })
        },
        [pageSize, pathname, router, searchParams]
    )

    const onPageChange = React.useCallback(
        (page: number) => updatePaginationParams({ page }),
        [updatePaginationParams]
    )

    const onPageSizeChange = React.useCallback(
        (size: number) => {
            const nextSize = PAGE_SIZE_OPTIONS.includes(size)
                ? size
                : DEFAULT_PAGE_SIZE

            updatePaginationParams({
                page: 1,
                pageSize: nextSize,
            })
        },
        [updatePaginationParams]
    )

    return {
        currentPage,
        pageSize,
        pageSizeOptions: PAGE_SIZE_OPTIONS,
        onPageChange,
        onPageSizeChange,
    }
}
