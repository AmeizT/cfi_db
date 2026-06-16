"use client"

import { Table } from "@tanstack/react-table"
import { DownloadIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

type DataTableExportProps<T> = {
    table: Table<T>
    filename?: string
}

export function DataTableExport<T>({ table, filename = "export" }: DataTableExportProps<T>) {
    function handleExport() {
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