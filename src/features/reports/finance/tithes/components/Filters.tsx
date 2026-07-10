"use client"

import * as React from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { SearchIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { createQueryString } from "@/features/reports/core/lib/create-query-string"

export function Filters() {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const currentSearch = searchParams.get("search") ?? ""

    function applySearch(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        const formData = new FormData(event.currentTarget)
        const search = String(formData.get("search") ?? "")
        const query = createQueryString(searchParams, {
            search: search.trim() || null,
            page: 1,
        })

        router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false })
    }

    return (
        <form onSubmit={applySearch} className="flex flex-col gap-2 px-6 pb-4 sm:flex-row sm:items-center">
            <div className="relative w-full sm:max-w-xs">
                <SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <input
                    key={currentSearch}
                    name="search"
                    defaultValue={currentSearch}
                    placeholder="Search contributors, receipts, references"
                    className="h-9 w-full rounded-md border border-input bg-background pl-9 pr-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
            </div>
            <Button type="submit" variant="outline" size="sm" className="h-9">
                Apply
            </Button>
        </form>
    )
}
