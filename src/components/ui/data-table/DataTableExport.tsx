"use client"

import { Table } from "@tanstack/react-table"
import { DownloadIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { exportTablePdf, type PdfTableRow } from "@/features/data-table/utils/pdf-export"
import type {
    DataTableExportContext,
    DataTableExportFormat,
    DataTableExportMetadata,
} from "@/features/reports/core/components/DataTable.types"

type DataTableExportProps<T> = {
    table: Table<T>
    filename?: string
    format?: DataTableExportFormat
    metadata?: DataTableExportMetadata
    onExport?: (context: DataTableExportContext<T>) => void | Promise<void>
}

function formatColumnLabel(value: string) {
    return value
        .replace(/_/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase())
}

function getExportFilters<T>(table: Table<T>) {
    const filters: Record<string, string> = {}

    for (const filter of table.getState().columnFilters) {
        if (filter.value != null && filter.value !== "") {
            filters[filter.id] = String(filter.value)
        }
    }

    const sorting = table
        .getState()
        .sorting.map((sort) => `${sort.id} ${sort.desc ? "desc" : "asc"}`)
        .join(", ")

    if (sorting) {
        filters.sorting = sorting
    }

    return filters
}

export function DataTableExport<T>({
    table,
    filename = "export",
    format = "csv",
    metadata,
    onExport,
}: DataTableExportProps<T>) {
    async function handleExport() {
        const resolvedMetadata = {
            ...metadata,
            generatedAt: metadata?.generatedAt ?? new Date(),
            filters: {
                ...getExportFilters(table),
                ...metadata?.filters,
            },
        }

        if (onExport) {
            await onExport({
                table,
                filename,
                metadata: resolvedMetadata,
            })
            return
        }

        if (format === "pdf") {
            const columns = table.getVisibleLeafColumns().map((column) => ({
                id: column.id,
                label: formatColumnLabel(column.id),
            }))
            const rows = table.getRowModel().rows.map((row) => {
                const output: PdfTableRow = {}
                row.getVisibleCells().forEach((cell) => {
                    output[cell.column.id] = cell.getValue()
                })
                return output
            })

            exportTablePdf({
                filename,
                title: resolvedMetadata.title ?? formatColumnLabel(filename),
                metadata: resolvedMetadata,
                columns,
                rows,
            })
            return
        }

        const headers = table
            .getVisibleLeafColumns()
            .map((col) => col.id)
            .join(",")

        const rows = table.getRowModel().rows.map((row) =>
            row
                .getVisibleCells()
                .map((cell) => {
                    const value = cell.getValue()
                    // Wrap in quotes if the value contains a comma or newline
                    const str = value == null ? "" : String(value)
                    return str.includes(",") || str.includes("\n")
                        ? `"${str.replace(/"/g, '""')}"`
                        : str
                })
                .join(",")
        )

        const csv = [headers, ...rows].join("\n")
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
        const url = URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.href = url
        link.download = `${filename}.csv`
        link.click()
        URL.revokeObjectURL(url)
    }

    return (
        <Button variant="toolbar" onClick={handleExport}>
            <DownloadIcon size={14} className="opacity-60" aria-hidden="true" />
            Export
        </Button>
    )
}
