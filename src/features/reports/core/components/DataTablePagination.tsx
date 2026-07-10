"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

const DEFAULT_PAGE_SIZE_OPTIONS = [10, 25, 50, 100]
const MAX_VISIBLE_PAGES = 5

type DataTablePaginationProps = {
    totalRows: number
    currentPage: number
    pageSize: number
    pageSizeOptions?: number[]
    onPageChange: (page: number) => void
    onPageSizeChange: (size: number) => void
    className?: string
    style?: React.CSSProperties
}

function getVisiblePages(totalPages: number, currentPage: number) {
    const visibleCount = Math.min(MAX_VISIBLE_PAGES, totalPages)
    const half = Math.floor(visibleCount / 2)
    let start = Math.max(1, currentPage - half)
    const endFromStart = start + visibleCount - 1

    if (endFromStart > totalPages) {
        start = Math.max(1, totalPages - visibleCount + 1)
    }

    return Array.from({ length: visibleCount }, (_, index) => start + index)
}

export const DataTablePagination = React.forwardRef<HTMLDivElement, DataTablePaginationProps>(function DataTablePagination({
    totalRows,
    currentPage,
    pageSize,
    pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
    onPageChange,
    onPageSizeChange,
    className,
    style,
}, ref) {
    if (totalRows <= pageSize) {
        return null
    }

    const totalPages = Math.max(1, Math.ceil(totalRows / pageSize))
    const safePage = Math.min(Math.max(currentPage, 1), totalPages)
    const startRow = (safePage - 1) * pageSize + 1
    const endRow = Math.min(safePage * pageSize, totalRows)
    const visiblePages = getVisiblePages(totalPages, safePage)
    const isFirstPage = safePage <= 1
    const isLastPage = safePage >= totalPages

    function goToPage(page: number) {
        if (page < 1 || page > totalPages || page === safePage) {
            return
        }

        onPageChange(page)
    }

    return (
        <div
            ref={ref}
            style={style}
            className={cn(
                "flex flex-col gap-3 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between",
                className ?? "rounded-lg border bg-card px-3 py-3"
            )}
        >
            <div className="tabular-nums">
                Showing {startRow}-{endRow} of {totalRows} results
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="flex items-center gap-2">
                    <span className="text-sm">Rows</span>
                    <Select
                        value={String(pageSize)}
                        onValueChange={(value) => onPageSizeChange(Number(value))}
                    >
                        <SelectTrigger
                            aria-label="Rows per page"
                            className="w-20"
                            size="sm"
                        >
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent align="end">
                            {pageSizeOptions.map((size) => (
                                <SelectItem key={size} value={String(size)}>
                                    {size}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex items-center gap-1">
                    <Button
                        type="button"
                        variant="ghost"
                        disabled={isFirstPage}
                        onClick={() => goToPage(safePage - 1)}
                    >
                        Previous
                    </Button>

                    {visiblePages.map((page) => (
                        <Button
                            key={page}
                            type="button"
                            aria-current={page === safePage ? "page" : undefined}
                            variant={page === safePage ? "outline" : "ghost"}
                            size="icon"
                            onClick={() => goToPage(page)}
                        >
                            {page}
                        </Button>
                    ))}

                    <Button
                        type="button"
                        variant="ghost"
                        disabled={isLastPage}
                        onClick={() => goToPage(safePage + 1)}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    )
})
