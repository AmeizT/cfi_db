"use client"

import * as React from "react"
import { FilterIcon, SearchIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import type { EntitySegment } from "./entity-master-detail.types"

type EntityListHeaderProps = {
    title: string
    countLabel: string
    search: string
    searchPlaceholder: string
    segments?: EntitySegment[]
    activeSegment?: string
    primaryAction?: React.ReactNode
    filters?: React.ReactNode
    onSearchChange: (value: string) => void
    onSegmentChange?: (value: string) => void
}

export function EntityListHeader({
    title,
    countLabel,
    search,
    searchPlaceholder,
    segments,
    activeSegment,
    primaryAction,
    filters,
    onSearchChange,
    onSegmentChange,
}: EntityListHeaderProps) {
    const [value, setValue] = React.useState(search)

    return (
        <header className="shrink-0 border-b border-border-subtle px-4 py-4">
            <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                    <h2 className="truncate text-base font-semibold text-foreground">{title}</h2>
                    <p className="text-xs text-muted-foreground" aria-live="polite">{countLabel}</p>
                </div>
                {primaryAction}
            </div>

            {segments?.length ? (
                <div className="mt-4 flex gap-1 overflow-x-auto" aria-label="Directory segments">
                    {segments.map((segment) => (
                        <Button
                            key={segment.value}
                            type="button"
                            size="sm"
                            variant="ghost"
                            className={cn(
                                "h-8 shrink-0 rounded-full px-3",
                                segment.value === activeSegment && "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground",
                            )}
                            aria-pressed={segment.value === activeSegment}
                            onClick={() => onSegmentChange?.(segment.value)}
                        >
                            {segment.label}
                        </Button>
                    ))}
                </div>
            ) : null}

            <div className="mt-4 flex items-center gap-2">
                <div className="relative min-w-0 flex-1">
                    <SearchIcon aria-hidden="true" className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        value={value}
                        className="h-9 pl-9"
                        aria-label={searchPlaceholder}
                        placeholder={searchPlaceholder}
                        onChange={(event) => {
                            setValue(event.target.value)
                            onSearchChange(event.target.value)
                        }}
                    />
                </div>
                {filters ?? (
                    <Button type="button" size="icon" variant="outline" disabled aria-label="Additional filters unavailable" title="Additional filters unavailable">
                        <FilterIcon aria-hidden="true" className="size-4" />
                    </Button>
                )}
            </div>
        </header>
    )
}
