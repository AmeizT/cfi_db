"use client"

import { Table } from "@tanstack/react-table"
import { Settings2Icon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SettingsIcon } from '@solar-icons/react/bold-duotone/settings'

type DataTableColumnVisibilityProps<T> = {
    table: Table<T>
}

export function DataTableColumnVisibility<T>({ table }: DataTableColumnVisibilityProps<T>) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="toolbar">
                    <SettingsIcon className="opacity-60" aria-hidden="true" />
                    Edit columns
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
                <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {table
                    .getAllColumns()
                    .filter((col) => col.getCanHide())
                    .map((col) => (
                        <DropdownMenuCheckboxItem
                            key={col.id}
                            className="capitalize"
                            checked={col.getIsVisible()}
                            onCheckedChange={(value) => col.toggleVisibility(!!value)}
                        >
                            {col.id}
                        </DropdownMenuCheckboxItem>
                    ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}