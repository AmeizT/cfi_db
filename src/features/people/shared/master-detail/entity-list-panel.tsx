import type { ReactNode } from "react"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { EntityPagination } from "./entity-master-detail.types"

type EntityListPanelProps = {
    children: ReactNode
    header: ReactNode
    pagination?: EntityPagination
    hidden?: boolean
}

export function EntityListPanel({ children, header, pagination, hidden }: EntityListPanelProps) {
    const lastPage = pagination ? Math.max(1, Math.ceil(pagination.total / pagination.pageSize)) : 1

    return (
        <aside
            aria-label="Directory list"
            className={cn(
                "min-h-0 w-full shrink-0 overflow-hidden bg-background lg:flex lg:w-[22rem] lg:flex-col lg:border-r lg:border-border-subtle xl:w-[23rem]",
                hidden ? "hidden lg:flex" : "flex flex-col",
            )}
        >
            {header}
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain" role="listbox">
                {children}
            </div>
            {pagination && lastPage > 1 ? (
                <footer className="flex shrink-0 items-center justify-between border-t border-border-subtle px-3 py-2 text-xs text-muted-foreground">
                    <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        disabled={pagination.page <= 1}
                        onClick={() => pagination.onPageChange(pagination.page - 1)}
                    >
                        <ChevronLeftIcon aria-hidden="true" className="size-4" /> Previous
                    </Button>
                    <span>Page {pagination.page} of {lastPage}</span>
                    <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        disabled={pagination.page >= lastPage}
                        onClick={() => pagination.onPageChange(pagination.page + 1)}
                    >
                        Next <ChevronRightIcon aria-hidden="true" className="size-4" />
                    </Button>
                </footer>
            ) : null}
        </aside>
    )
}
