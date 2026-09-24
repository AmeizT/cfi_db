"use client"

import { Children, cloneElement, Fragment, isValidElement, useState, type ReactNode } from "react"
import { InlineEntryTable } from "./InlineEntryTable"
import { Button } from "@/components/ui/button"
import { Loader2Icon, PencilIcon, PlusIcon } from "lucide-react"
import { TrashBinMinimalisticIcon } from '@solar-icons/react/linear/trash-bin-minimalistic'

type MultiEntryFormProps = {
    inline?: { headers: string[]; savedRows?: Array<{ id: string; cells: ReactNode[] }>; addLabel: string; dirtyLabel?: string; externalSave?: boolean; saveLabel?: string }
    rows: Array<{ id: string }>
    renderRow: (row: { id: string }, index: number) => ReactNode
    renderSummary?: (row: { id: string }, index: number) => ReactNode
    onAddRow: () => void
    onRemoveRow: (index: number) => void
    onCancel: () => void
    totalLabel: string
    isPending: boolean
}

export function MultiEntryForm({ inline, rows, renderRow, renderSummary, onAddRow, onRemoveRow, onCancel, totalLabel, isPending }: MultiEntryFormProps) {
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

    if (inline) {
        const cells = (node: ReactNode): ReactNode[] => Children.toArray(node).flatMap(child =>
            isValidElement<{ children?: ReactNode }>(child) && child.type === Fragment ? cells(child.props.children) : [child]
        )
        const labelControls = (node: ReactNode, label: string): ReactNode => Children.map(node, child => {
            if (!isValidElement<{ children?: ReactNode; name?: string; "aria-label"?: string }>(child)) return child
            return cloneElement(child, {
                ...(child.props.name ? { "aria-label": child.props["aria-label"] ?? label } : {}),
                ...(child.props.children !== undefined ? { children: labelControls(child.props.children, label) } : {}),
            })
        })
        return <fieldset disabled={isPending} className="min-w-0 space-y-4">
            <InlineEntryTable savedRows={inline.savedRows} headers={inline.headers} rows={rows} renderCells={index => {
                const row = renderRow(rows[index], index)
                return (isValidElement<{ children?: ReactNode }>(row) ? cells(row.props.children) : [row]).map((cell, column) => labelControls(cell, `${inline.headers[column]} row ${index + 1}`))
            }} onAdd={onAddRow} onRemove={onRemoveRow} addLabel={inline.addLabel} disabled={isPending} totalLabel={totalLabel} dirtyLabel={inline.dirtyLabel} />
            {!inline.externalSave && <div className="flex justify-end gap-2"><Button type="button" variant="outline" onClick={onCancel}>Discard changes</Button><Button type="submit" disabled={isPending || rows.length === 0}>{isPending ? "Saving…" : inline.saveLabel ?? "Save & Continue"}</Button></div>}
        </fieldset>
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
