"use client"

import { Table } from "@tanstack/react-table"
import { DataTableColumnVisibility } from "./DataTableColumnVisibility"
import { DataTableExport } from "./DataTableExport"
import { DataTableFilters } from "./DataTableFilters"
import { Flex } from "../box";
import { Button } from "../button";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { createQueryString } from "@/features/reports/core/lib/create-query-string";
import { HugeiconsIcon } from "@hugeicons/react";
import { Delete02Icon, Delete03Icon } from "@hugeicons/core-free-icons";

type DataTableToolbarProps<T> = {
    table: Table<T>
    showColumnVisibility?: boolean
    showExport?: boolean
    showFilters?: boolean
    exportFilename?: string
}

export function DataTableToolbar<T>({
    table,
    showColumnVisibility = true,
    showExport = true,
    showFilters = true,
    exportFilename = "export",
}: DataTableToolbarProps<T>) {
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const params = createQueryString(searchParams, { 
        status: searchParams?.get("status") === "deleted" ? "all" : "deleted",
    })

    return (
        <Flex justify="between" align="center" gap={2} className="w-full">
            <Flex gap={2} align="center">
                {showFilters && <DataTableFilters table={table} />}
            </Flex>

            <Flex gap={2} align="center">
                <Button asChild variant="toolbar">
                    <Link href={`${pathname}?${params}`}>
                        <HugeiconsIcon icon={Delete03Icon} /> Trash
                    </Link>
                </Button>
                {showColumnVisibility && <DataTableColumnVisibility table={table} />}
                {showExport && <DataTableExport table={table} filename={exportFilename} />}
            </Flex>
        </Flex>
    )
}


