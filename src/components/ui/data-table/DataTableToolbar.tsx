"use client"

import * as React from "react"
import type { Table } from "@tanstack/react-table"
import {
    Columns3Icon,
    MoreVerticalIcon,
    PrinterIcon,
    RotateCcwIcon,
    Rows3Icon,
    Trash2Icon,
} from "lucide-react"

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type {
    DataTableExportContext,
    DataTableExportFormat,
    DataTableExportMetadata,
} from "@/features/reports/core/components/DataTable.types"
import { DataTableExport } from "./DataTableExport"
import { DataTableFilters } from "./DataTableFilters"
import { Separator } from "../separator";

export type DataTableDensity = "compact" | "default" | "comfortable"

type DataTableToolbarProps<T> = {
    table: Table<T>
    showColumnVisibility?: boolean
    showExport?: boolean
    showFilters?: boolean
    enableDelete?: boolean
    exportFormat?: DataTableExportFormat
    exportMetadata?: DataTableExportMetadata
    onExport?: (context: DataTableExportContext<T>) => void | Promise<void>
    exportFilename?: string
    leading?: React.ReactNode
    supplementalActions?: React.ReactNode
    density?: DataTableDensity
    onDensityChange?: (density: DataTableDensity) => void
    onResetView?: () => void
    onDeleteAll?: () => void | Promise<void>
}

export function DataTableToolbar<T>({
    table,
    showColumnVisibility = true,
    showExport = true,
    showFilters = true,
    enableDelete = true,
    exportFormat,
    exportMetadata,
    onExport,
    exportFilename = "export",
    leading,
    supplementalActions,
    density = "default",
    onDensityChange,
    onResetView,
    onDeleteAll,
}: DataTableToolbarProps<T>) {
    const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false)
    const columns = table.getAllColumns().filter((column) => column.getCanHide())

    return (
        <>
            <div className="flex min-h-12 w-full flex-wrap items-center justify-between gap-3 py-3 border-b-0 border-border-subtle">
                <div className="min-w-0 flex-1">{leading}</div>

                <div className="ml-auto flex shrink-0 items-center gap-1 sm:gap-3">
                    {showFilters ? <DataTableFilters table={table} /> : null}
                    {supplementalActions}
                    <Separator orientation="vertical" aria-hidden="true" className="data-[orientation=vertical]:h-4.5 mx-1 hidden w-px sm:block" />

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="size-8 rounded-full bg-zinc-100 dark:bg-surface hover:bg-zinc-200/70 dark:hover:bg-surface"
                                aria-label="More table options"
                            >
                                <MoreVerticalIcon className="size-5" aria-hidden="true" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-60 rounded-2xl p-2">
                            {showColumnVisibility ? (
                                <DropdownMenuSub>
                                    <DropdownMenuSubTrigger className="h-10 rounded-xl px-3">
                                        <Columns3Icon aria-hidden="true" />
                                        Columns
                                    </DropdownMenuSubTrigger>
                                    <DropdownMenuSubContent className="w-52 rounded-xl p-1">
                                        {columns.map((column) => (
                                            <DropdownMenuCheckboxItem
                                                key={column.id}
                                                checked={column.getIsVisible()}
                                                onCheckedChange={(checked) => column.toggleVisibility(Boolean(checked))}
                                                className="capitalize"
                                            >
                                                {column.id.replaceAll("_", " ")}
                                            </DropdownMenuCheckboxItem>
                                        ))}
                                    </DropdownMenuSubContent>
                                </DropdownMenuSub>
                            ) : null}

                            <DropdownMenuSub>
                                <DropdownMenuSubTrigger className="h-10 rounded-xl px-3">
                                    <Rows3Icon aria-hidden="true" />
                                    Density
                                </DropdownMenuSubTrigger>
                                <DropdownMenuSubContent className="w-44 rounded-xl p-1">
                                    <DropdownMenuRadioGroup
                                        value={density}
                                        onValueChange={(value) => onDensityChange?.(value as DataTableDensity)}
                                    >
                                        <DropdownMenuRadioItem value="compact">Compact</DropdownMenuRadioItem>
                                        <DropdownMenuRadioItem value="default">Default</DropdownMenuRadioItem>
                                        <DropdownMenuRadioItem value="comfortable">Comfortable</DropdownMenuRadioItem>
                                    </DropdownMenuRadioGroup>
                                </DropdownMenuSubContent>
                            </DropdownMenuSub>

                            <DropdownMenuItem
                                className="h-10 rounded-xl px-3"
                                onSelect={() => onResetView?.()}
                            >
                                <RotateCcwIcon aria-hidden="true" />
                                Reset view
                            </DropdownMenuItem>

                            <DropdownMenuSeparator className="my-1" />

                            {showExport ? (
                                <DataTableExport
                                    table={table}
                                    filename={exportFilename}
                                    format={exportFormat}
                                    metadata={exportMetadata}
                                    onExport={onExport}
                                    trigger="menu-item"
                                />
                            ) : null}
                            <DropdownMenuItem
                                className="h-10 rounded-xl px-3"
                                onSelect={() => window.print()}
                            >
                                <PrinterIcon aria-hidden="true" />
                                Print
                            </DropdownMenuItem>

                            <DropdownMenuSeparator className="my-1" />

                            <DropdownMenuItem
                                variant="destructive"
                                className="h-10 rounded-xl px-3"
                                disabled={!enableDelete || !onDeleteAll}
                                onSelect={() => setDeleteDialogOpen(true)}
                            >
                                <Trash2Icon aria-hidden="true" />
                                Delete all rows
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete all rows?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will remove every row in the current table. This action cannot be undone from this view.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            className="bg-destructive text-white hover:bg-destructive/90"
                            onClick={() => void onDeleteAll?.()}
                        >
                            Delete all rows
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}
