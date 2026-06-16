"use client"

import { Table } from "@tanstack/react-table"
import { ListFilterIcon, XIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

type DataTableFiltersProps<T> = {
    table: Table<T>
}

export function DataTableFilters<T>({ table }: DataTableFiltersProps<T>) {
    const filterableColumns = table
        .getAllColumns()
        .filter((col) => col.getCanFilter())

    const activeFiltersCount = filterableColumns.filter(
        (col) => col.getFilterValue() != null && col.getFilterValue() !== ""
    ).length

    function clearAllFilters() {
        filterableColumns.forEach((col) => col.setFilterValue(undefined))
    }

    return (
        <div className="flex items-center gap-2">
            <Popover>
                <PopoverTrigger asChild>
                    <Button variant="toolbar">
                        <ListFilterIcon size={16} className="opacity-60" aria-hidden="true" />
                        Filters
                        {activeFiltersCount > 0 && (
                            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                                {activeFiltersCount}
                            </span>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent align="start" className="w-72 space-y-3">
                    <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">Filters</p>
                        {activeFiltersCount > 0 && (
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 gap-1 text-xs"
                                onClick={clearAllFilters}
                            >
                                <XIcon size={12} />
                                Clear all
                            </Button>
                        )}
                    </div>
                    {filterableColumns.map((col) => {
                        const filterValue = (col.getFilterValue() ?? "") as string
                        const meta = col.columnDef.meta as { filterType?: "select"; filterOptions?: string[] } | undefined

                        if (meta?.filterType === "select" && meta.filterOptions) {
                            return (
                                <div key={col.id} className="space-y-1">
                                    <label className="text-xs text-muted-foreground capitalize">
                                        {col.id}
                                    </label>
                                    <Select
                                        value={filterValue}
                                        onValueChange={(val) =>
                                            col.setFilterValue(val === "__all__" ? undefined : val)
                                        }
                                    >
                                        <SelectTrigger className="h-8 text-sm">
                                            <SelectValue placeholder={`All`} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="__all__">All</SelectItem>
                                            {meta.filterOptions.map((opt) => (
                                                <SelectItem key={opt} value={opt}>
                                                    {opt}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            )
                        }

                        return (
                            <div key={col.id} className="space-y-1">
                                <label className="text-xs text-muted-foreground capitalize">
                                    {col.id}
                                </label>
                                <Input
                                    className="h-8 text-sm"
                                    placeholder={`Filter ${col.id}...`}
                                    value={filterValue}
                                    onChange={(e) => col.setFilterValue(e.target.value || undefined)}
                                />
                            </div>
                        )
                    })}
                    {filterableColumns.length === 0 && (
                        <p className="text-sm text-muted-foreground">No filterable columns.</p>
                    )}
                </PopoverContent>
            </Popover>
        </div>
    )
}