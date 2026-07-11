"use client"

import * as React from "react"
import { SearchIcon } from "lucide-react"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export type RegionalOrderingOption = {
    label: string
    value: string
}

type RegionalDirectoryToolbarProps = {
    search: string
    ordering: string
    searchPlaceholder: string
    orderingOptions: RegionalOrderingOption[]
    onSearchChange: (value: string) => void
    onOrderingChange: (value: string) => void
}

export function RegionalDirectoryToolbar({
    search,
    ordering,
    searchPlaceholder,
    orderingOptions,
    onSearchChange,
    onOrderingChange,
}: RegionalDirectoryToolbarProps) {
    const [localSearch, setLocalSearch] = React.useState(search)
    const selectedOrdering = orderingOptions.some((option) => option.value === ordering)
        ? ordering
        : orderingOptions[0]?.value

    React.useEffect(() => {
        queueMicrotask(() => setLocalSearch(search))
    }, [search])

    React.useEffect(() => {
        if (localSearch === search) {
            return
        }

        const timeoutId = window.setTimeout(() => {
            onSearchChange(localSearch)
        }, 300)

        return () => window.clearTimeout(timeoutId)
    }, [localSearch, onSearchChange, search])

    return (
        <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full sm:max-w-sm">
                <SearchIcon
                    aria-hidden="true"
                    className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                />
                <Input
                    aria-label="Search regional directory"
                    className="h-9 pl-9"
                    placeholder={searchPlaceholder}
                    value={localSearch}
                    onChange={(event) => setLocalSearch(event.target.value)}
                />
            </div>

            <Select
                value={selectedOrdering}
                onValueChange={onOrderingChange}
            >
                <SelectTrigger
                    aria-label="Sort regional directory"
                    className="h-9 w-full sm:w-52"
                >
                    <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent align="end">
                    {orderingOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    )
}
