"use client"

import { useState, type ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { Loader2Icon, PencilIcon, PlusIcon } from "lucide-react"
import { TrashBinMinimalisticIcon } from '@solar-icons/react/linear/trash-bin-minimalistic'

type MultiEntryFormProps = {
    rows: Array<{ id: string }>
    renderRow: (row: { id: string }, index: number) => ReactNode
    renderSummary?: (row: { id: string }, index: number) => ReactNode
    onAddRow: () => void
    onRemoveRow: (index: number) => void
    onCancel: () => void
    totalLabel: string
    isPending: boolean
}

export function MultiEntryForm({ rows, renderRow, renderSummary, onAddRow, onRemoveRow, onCancel, totalLabel, isPending }: MultiEntryFormProps) {
    const [activeIndex, setActiveIndex] = useState(0)

    function addRow() {
        setActiveIndex(rows.length)
        onAddRow()
    }

    function removeRow(index: number) {
        if (index <= activeIndex) {
            setActiveIndex(Math.max(0, activeIndex - 1))
        }
        onRemoveRow(index)
    }

    return (
        <div className="space-y-4">
            <div className="space-y-3">
                {rows.map((row, index) => {
                    const expanded = index === activeIndex || !renderSummary

                    return (
                    <fieldset key={row.id} disabled={isPending} className="relative rounded-xl border border-border bg-card px-3 pb-3">
                        <legend className="sr-only">Entry {index + 1}</legend>
                        <div className="py-2 mb-3 flex items-center justify-between">
                            <span className="px-2 py-1 text-sm font-semibold rounded-lg bg-muted">Entry {index + 1}</span>
                            <div className="flex items-center gap-1">
                                {!expanded ? (
                                    <Button type="button" size="sm" variant="ghost" onClick={() => setActiveIndex(index)}>
                                        <PencilIcon className="size-4" /> Edit
                                    </Button>
                                ) : null}
                                <Button type="button" size="icon" variant="ghost" disabled={rows.length === 1 || isPending} onClick={() => removeRow(index)} aria-label={`Remove entry ${index + 1}`}>
                                    <TrashBinMinimalisticIcon className="size-5" />
                                </Button>
                            </div>
                        </div>
                        {expanded ? renderRow(row, index) : renderSummary?.(row, index)}
                    </fieldset>
                    )
                })}
            </div>

            <div className="flex flex-col gap-3 pt-0 sm:flex-row sm:items-center sm:justify-between">
                <div className="w-full flex flex-col gap-2">
                    <div className="py-3 w-full border-y border-border-subtle">
                        <Button 
                            type="button" 
                            variant="outline" 
                            onClick={addRow}
                            disabled={isPending}
                            className="h-10 w-full border border-border border-dashed"
                        >
                            <PlusIcon className="size-4" /> Add another item
                        </Button>
                    </div>
                    
                    <div className="py-3 w-full flex justify-between">
                        <div>
                            <p className="text-sm font-medium">{rows.length} {rows.length === 1 ? "entry" : "entries"}</p>
                            <p className="text-sm text-muted-foreground">Total: {totalLabel}</p>
                        </div>
                        
                        <div className="flex flex-wrap justify-end gap-2">
                            <Button type="button" variant="outline" className="shadow-elevation-sm" onClick={onCancel} disabled={isPending}>
                                Cancel
                            </Button>

                            <Button type="submit" disabled={isPending}>
                                {isPending ? <Loader2Icon className="size-4 animate-spin" /> : null}
                                Save entries
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
