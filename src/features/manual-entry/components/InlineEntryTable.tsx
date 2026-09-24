"use client"

import type { ReactNode } from "react"
import { Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export function InlineEntryTable({ headers, rows, renderCells, onAdd, onRemove, addLabel, disabled, totalLabel, dirtyLabel, savedRows = [] }: {
    savedRows?: Array<{ id: string; cells: ReactNode[] }>
    headers: string[]
    rows: Array<{ id: string }>
    renderCells: (index: number) => ReactNode[]
    onAdd: () => void
    onRemove: (index: number) => void
    addLabel: string
    disabled?: boolean
    totalLabel: string
    dirtyLabel?: string
}) {
    return <div className="space-y-3">
        <div className="overflow-x-auto rounded-lg border border-border-subtle">
            <table className="w-full border-collapse text-sm">
                <thead><tr className="border-b border-border-subtle bg-muted/30">
                    {headers.map((label, index) => <th key={index} scope="col" className="whitespace-nowrap px-3 py-2 text-left font-medium text-muted-foreground">{label}</th>)}
                    <th scope="col"><span className="sr-only">Remove unsaved row</span></th>
                </tr></thead>
                <tbody>{savedRows.map(row => <tr key={`saved-${row.id}`} className="border-b border-border-subtle bg-muted/10">{row.cells.map((cell, index) => <td key={index} className="px-3 py-2 align-top">{cell ?? "—"}</td>)}<td className="px-2 py-2 text-xs text-muted-foreground">Saved</td></tr>)}{rows.map((row, index) => <tr key={row.id} className="border-b border-border-subtle">
                    {renderCells(index).map((cell, column) => <td key={column} className="min-w-36 p-2 align-top [&_input]:h-9 [&_input]:shadow-none [&_input]:placeholder:text-muted-foreground [&_select]:h-9 [&_textarea]:min-h-9">{cell}</td>)}
                    <td className="p-2 align-top"><Button type="button" size="icon" variant="ghost" disabled={disabled} aria-label={`Remove unsaved row ${index + 1}`} onClick={() => onRemove(index)}><X className="size-4" /></Button></td>
                </tr>)}</tbody>
                <tfoot><tr><td colSpan={headers.length + 1} className="p-1"><Button type="button" variant="ghost" className="w-full justify-start" disabled={disabled} onClick={onAdd}><Plus className="size-4" />{addLabel}</Button></td></tr></tfoot>
            </table>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
            <span className="text-muted-foreground">{dirtyLabel ?? `${rows.length} ${rows.length === 1 ? "row" : "rows"}`}</span>
            <span className="font-medium tabular-nums">{savedRows.length ? "New entries total" : "Total"}: {totalLabel}</span>
        </div>
    </div>
}
