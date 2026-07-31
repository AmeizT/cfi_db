import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function JethroMemberPagination({ page, count, pageSize, hasNext, disabled, onPage }: {
    page: number
    count: number
    pageSize: number
    hasNext: boolean
    disabled: boolean
    onPage: (page: number) => void
}) {
    const pages = Math.max(1, Math.ceil(count / pageSize))
    return (
        <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Page {page} of {pages} · {count} result{count === 1 ? "" : "s"}</span>
            <span className="flex gap-1">
                <Button type="button" variant="ghost" size="icon" className="size-7" disabled={disabled || page <= 1} onClick={() => onPage(page - 1)} aria-label="Previous page"><ChevronLeft /></Button>
                <Button type="button" variant="ghost" size="icon" className="size-7" disabled={disabled || !hasNext} onClick={() => onPage(page + 1)} aria-label="Next page"><ChevronRight /></Button>
            </span>
        </div>
    )
}
