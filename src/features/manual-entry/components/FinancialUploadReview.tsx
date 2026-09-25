"use client"

import { useId } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { InlineEntryTable } from "./InlineEntryTable"
import type { BatchKind } from "../hooks/use-batch-entry"
import { calculateEntryTotal } from "../lib/manual-entry-utils"
import type { UploadReviewProps } from "@/features/uploads/components/UploadEngine"

const columns: Record<BatchKind, Array<[string, string]>> = {
    tithes: [["member_name", "Contributor"], ["amount", "Amount"], ["payment_method", "Payment"], ["reference_code", "Reference"], ["timestamp", "Date"], ["notes", "Notes"]],
    revenue: [["category", "Category"], ["amount", "Amount"], ["timestamp", "Date"], ["notes", "Notes"]],
    overhead: [["overhead_type", "Type"], ["amount", "Amount"], ["timestamp", "Date"], ["notes", "Notes"]],
    expenses: [["name", "Item"], ["category", "Category"], ["price", "Unit price"], ["quantity", "Quantity"], ["invoice_date", "Date"], ["supplier", "Supplier"], ["invoice_number", "Invoice"], ["description", "Notes"]],
}

export function FinancialUploadReview({ kind, formId, data, errors, disabled, onChange, onAdd, onRemove, onSubmit, onCancel }: UploadReviewProps & { kind: BatchKind; formId?: string }) {
    const inputId = useId()
    const fields = [...columns[kind]]
    for (const key of new Set(data.flatMap(row => Object.keys(row)))) {
        if (!fields.some(([field]) => field === key)) fields.push([key, key.replaceAll("_", " ")])
    }
    const hasAmount = data.some(row => String(row[kind === "expenses" ? "price" : "amount"] ?? "").trim() !== "")
    const total = hasAmount ? new Intl.NumberFormat(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(calculateEntryTotal(kind, data)) : "—"
    const addLabel = kind === "tithes" ? "Add tithe" : kind === "revenue" ? "Add income" : kind === "overhead" ? "Add operating cost" : "Add expense"
    return <form id={formId} onSubmit={event => { event.preventDefault(); if (!disabled && data.length) void onSubmit() }}>
        <fieldset disabled={disabled} className="min-w-0 space-y-3">
            <InlineEntryTable headers={fields.map(([, label]) => label)} rows={data.map((_, index) => ({ id: String(index) }))} renderCells={index => fields.map(([key, label]) => {
                const error = errors.find(item => item.row === index + 2 && (!item.field || item.field === key))
                const errorId = `${inputId}-${index}-${key}`
                return <div key={key} className="space-y-1"><Input aria-label={`${label} row ${index + 1}`} aria-invalid={Boolean(error)} aria-describedby={error ? errorId : undefined} value={String(data[index][key] ?? "")} placeholder="—" onChange={event => onChange(index, key, event.target.value)} />{error && <p id={errorId} role="alert" className="text-xs text-destructive">{error.message}</p>}</div>
            })} onAdd={() => onAdd(Object.fromEntries(fields.map(([key]) => [key, ""])))} onRemove={onRemove} addLabel={addLabel} disabled={disabled} totalLabel={total} dirtyLabel="Review imported rows before saving" />
            <div className="flex justify-end gap-2"><Button type="button" variant="outline" onClick={onCancel}>Choose another file</Button>{!formId && <Button type="submit" disabled={disabled || !data.length}>{disabled ? "Saving…" : "Save & Continue"}</Button>}</div>
        </fieldset>
    </form>
}
