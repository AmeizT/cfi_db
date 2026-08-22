"use client"

import { CheckIcon, FilterIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type FilterOption = { value: string; label: string }

export function EntityFilterMenu({ value, options, onValueChange }: { value?: string; options: FilterOption[]; onValueChange: (value: string) => void }) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button type="button" size="icon" variant="outline" aria-label="Filter directory" title="Filter directory">
                    <FilterIcon aria-hidden="true" className="size-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                {options.map((option) => (
                    <DropdownMenuItem key={option.value} onSelect={() => onValueChange(option.value)}>
                        <span className="flex-1">{option.label}</span>
                        {value === option.value ? <CheckIcon aria-hidden="true" className="size-4" /> : null}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
