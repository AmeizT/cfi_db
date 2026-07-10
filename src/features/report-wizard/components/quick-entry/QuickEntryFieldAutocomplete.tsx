"use client"

import * as React from "react"
import type { QuickEntryFieldSuggestion } from "./quick-entry-types"
import { cn } from "@/lib/utils"

type QuickEntryFieldAutocompleteProps = {
    id: string
    open: boolean
    activeIndex: number
    suggestions: QuickEntryFieldSuggestion[]
    onSelect: (suggestion: QuickEntryFieldSuggestion) => void
}

export function QuickEntryFieldAutocomplete({
    id,
    open,
    activeIndex,
    suggestions,
    onSelect,
}: QuickEntryFieldAutocompleteProps) {
    if (!open || suggestions.length === 0) return null

    return (
        <div
            id={id}
            role="listbox"
            className="absolute left-0 right-0 top-full z-20 mt-1 overflow-hidden rounded-md border border-border bg-popover text-popover-foreground shadow-md"
        >
            {suggestions.map((suggestion, index) => (
                <button
                    key={suggestion.key}
                    type="button"
                    role="option"
                    aria-selected={activeIndex === index}
                    className={cn(
                        "flex w-full flex-col items-start px-3 py-2 text-left text-sm outline-none hover:bg-accent hover:text-accent-foreground focus-visible:bg-accent",
                        activeIndex === index && "bg-accent text-accent-foreground"
                    )}
                    onMouseDown={(event) => {
                        event.preventDefault()
                        onSelect(suggestion)
                    }}
                >
                    <span className="font-medium">{suggestion.label}</span>
                    <span className="text-xs text-muted-foreground">
                        {suggestion.key}
                    </span>
                </button>
            ))}
        </div>
    )
}
