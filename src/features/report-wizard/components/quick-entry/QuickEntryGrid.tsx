"use client"

import * as React from "react"
import { QuickEntryRow } from "./QuickEntryRow"
import type {
    QuickEntryFieldDefinition,
    QuickEntryReportSchema,
    ReportDraft,
} from "./quick-entry-types"

type QuickEntryValueElement =
    | HTMLInputElement
    | HTMLTextAreaElement
    | HTMLSelectElement

type QuickEntryGridProps = {
    schema: QuickEntryReportSchema
    draft: ReportDraft
    fieldKeyValues: Record<string, string>
    fieldKeyErrors: Record<string, string>
    rawValues: Record<string, string>
    displayValues: Record<string, string>
    activeRow: number
    focusVersion: number
    onActiveRowChange: (index: number) => void
    onFieldKeyChange: (key: string, value: string) => void
    onCommitFieldKey: (fromKey: string) => void
    onRawValueChange: (key: string, value: string) => void
    onCommitField: (key: string) => void
    onClearField: (key: string) => void
    onReview: () => void
    onSave: () => void
}

function shouldHandleArrowNavigation(field: QuickEntryFieldDefinition) {
    return !["text", "textarea"].includes(field.type)
}

export function QuickEntryGrid({
    schema,
    draft,
    fieldKeyValues,
    fieldKeyErrors,
    rawValues,
    displayValues,
    activeRow,
    focusVersion,
    onActiveRowChange,
    onFieldKeyChange,
    onCommitFieldKey,
    onRawValueChange,
    onCommitField,
    onClearField,
    onReview,
    onSave,
}: QuickEntryGridProps) {
    const keyRefs = React.useRef<HTMLInputElement[]>([])
    const inputRefs = React.useRef<QuickEntryValueElement[]>([])

    React.useEffect(() => {
        inputRefs.current[0]?.focus()
    }, [focusVersion])

    function focusRow(index: number) {
        const nextIndex = Math.max(0, Math.min(schema.fields.length - 1, index))
        onActiveRowChange(nextIndex)
        inputRefs.current[nextIndex]?.focus()
    }

    function handleKeyCellKeyDown(
        event: React.KeyboardEvent<HTMLInputElement>,
        field: QuickEntryFieldDefinition,
        index: number
    ) {
        if (event.key === "Enter") {
            event.preventDefault()
            onCommitFieldKey(field.key)
            inputRefs.current[index]?.focus()
            return
        }

        if (event.key === "ArrowDown") {
            event.preventDefault()
            keyRefs.current[Math.min(index + 1, schema.fields.length - 1)]?.focus()
            return
        }

        if (event.key === "ArrowUp") {
            event.preventDefault()
            keyRefs.current[Math.max(index - 1, 0)]?.focus()
        }
    }

    function handleRowKeyDown(
        event: React.KeyboardEvent<QuickEntryValueElement>,
        field: QuickEntryFieldDefinition,
        index: number
    ) {
        if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
            event.preventDefault()
            onCommitField(field.key)
            onReview()
            return
        }

        if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "s") {
            event.preventDefault()
            onCommitField(field.key)
            onSave()
            return
        }

        if (event.key === "Enter" && field.type !== "textarea") {
            event.preventDefault()
            onCommitField(field.key)
            focusRow(index + 1)
            return
        }

        if (event.key === "ArrowDown" && shouldHandleArrowNavigation(field)) {
            event.preventDefault()
            onCommitField(field.key)
            focusRow(index + 1)
            return
        }

        if (event.key === "ArrowUp" && shouldHandleArrowNavigation(field)) {
            event.preventDefault()
            onCommitField(field.key)
            focusRow(index - 1)
        }
    }

    return (
        <section
            aria-label={`${schema.label} quick entry fields`}
            className="overflow-hidden bg-background"
        >
            <div className="grid gap-2 px-3 pb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground md:grid-cols-[minmax(140px,220px)_1fr_32px]">
                <span>Key</span>
                <span>Value</span>
                <span aria-hidden="true" />
            </div>

            {schema.fields.map((field, index) => (
                <QuickEntryRow
                    key={field.key}
                    field={field}
                    fieldKeyValue={fieldKeyValues[field.key] ?? field.key}
                    value={rawValues[field.key] ?? ""}
                    displayValue={displayValues[field.key]}
                    keyError={fieldKeyErrors[field.key]}
                    error={draft.errors[field.key]}
                    active={activeRow === index}
                    keyInputRef={(node) => {
                        if (node) keyRefs.current[index] = node
                    }}
                    inputRef={(node) => {
                        if (node) inputRefs.current[index] = node
                    }}
                    onFieldKeyChange={(value) => onFieldKeyChange(field.key, value)}
                    onFieldKeyFocus={() => onActiveRowChange(index)}
                    onFieldKeyBlur={() => onCommitFieldKey(field.key)}
                    onFieldKeyDown={(event) => handleKeyCellKeyDown(event, field, index)}
                    onChange={(value) => onRawValueChange(field.key, value)}
                    onFocus={() => onActiveRowChange(index)}
                    onBlur={() => onCommitField(field.key)}
                    onKeyDown={(event) => handleRowKeyDown(event, field, index)}
                    onClear={() => onClearField(field.key)}
                />
            ))}
        </section>
    )
}
