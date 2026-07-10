"use client"

import * as React from "react"
import { XIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    NativeSelect,
    NativeSelectOption,
} from "@/components/ui/native-select"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import type { QuickEntryFieldDefinition } from "./quick-entry-types"

type QuickEntryValueElement =
    | HTMLInputElement
    | HTMLTextAreaElement
    | HTMLSelectElement

type QuickEntryRowProps = {
    field: QuickEntryFieldDefinition
    fieldKeyValue: string
    value: string
    displayValue?: string
    keyError?: string
    error?: string
    active?: boolean
    keyInputRef?: (node: HTMLInputElement | null) => void
    inputRef?: (node: QuickEntryValueElement | null) => void
    onFieldKeyChange: (value: string) => void
    onFieldKeyFocus: () => void
    onFieldKeyBlur: () => void
    onFieldKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void
    onChange: (value: string) => void
    onFocus: () => void
    onBlur: () => void
    onKeyDown: (event: React.KeyboardEvent<QuickEntryValueElement>) => void
    onClear: () => void
}

function getInputMode(field: QuickEntryFieldDefinition) {
    if (field.type === "number") return "numeric"
    if (field.type === "currency") return "decimal"
    return undefined
}

export function QuickEntryRow({
    field,
    fieldKeyValue,
    value,
    displayValue,
    keyError,
    error,
    active = false,
    keyInputRef,
    inputRef,
    onFieldKeyChange,
    onFieldKeyFocus,
    onFieldKeyBlur,
    onFieldKeyDown,
    onChange,
    onFocus,
    onBlur,
    onKeyDown,
    onClear,
}: QuickEntryRowProps) {
    const fieldId = React.useId()
    const keyId = `${fieldId}-key`
    const helpId = `${fieldId}-help`
    const errorId = `${fieldId}-error`
    const keyErrorId = `${fieldId}-key-error`
    const showDateHint = active && field.type === "date" && value.trim().length === 0
    const describedBy = [
        showDateHint || field.helpText || displayValue ? helpId : null,
        error ? errorId : null,
    ].filter(Boolean).join(" ") || undefined

    return (
        <div
            className={cn(
                "grid gap-2 border-t border-border px-3 py-2 md:grid-cols-[minmax(140px,220px)_1fr_32px] md:items-start",
                active && "bg-accent/45"
            )}
        >
            <div className="min-w-0">
                <label htmlFor={keyId} className="sr-only">
                    Field key for {field.label}
                </label>
                <Input
                    id={keyId}
                    ref={keyInputRef}
                    value={fieldKeyValue}
                    autoComplete="off"
                    autoCapitalize="none"
                    spellCheck={false}
                    aria-invalid={Boolean(keyError)}
                    aria-describedby={keyError ? keyErrorId : undefined}
                    className="h-8 rounded-none border-0 border-b border-dashed border-transparent bg-transparent px-0 text-sm font-semibold shadow-none focus-visible:border-primary focus-visible:ring-0"
                    onChange={(event) => onFieldKeyChange(event.target.value)}
                    onFocus={onFieldKeyFocus}
                    onBlur={onFieldKeyBlur}
                    onKeyDown={onFieldKeyDown}
                />
                {keyError ? (
                    <p id={keyErrorId} role="alert" className="mt-1 text-xs font-medium text-destructive">
                        {keyError}
                    </p>
                ) : null}
            </div>

            <div className="min-w-0">
                {field.type === "textarea" ? (
                    <Textarea
                        id={fieldId}
                        ref={inputRef}
                        value={value}
                        placeholder={field.placeholder}
                        aria-invalid={Boolean(error)}
                        aria-describedby={describedBy}
                        className="min-h-10 rounded-none border-0 border-b border-dashed border-transparent bg-transparent px-0 py-1 text-sm shadow-none focus-visible:border-primary focus-visible:ring-0"
                        onChange={(event) => onChange(event.target.value)}
                        onFocus={onFocus}
                        onBlur={onBlur}
                        onKeyDown={onKeyDown}
                    />
                ) : field.type === "select" ? (
                    <NativeSelect
                        id={fieldId}
                        ref={inputRef}
                        value={value}
                        aria-invalid={Boolean(error)}
                        aria-describedby={describedBy}
                        className="h-8 w-full rounded-none border-0 border-b border-dashed border-transparent bg-transparent px-0 text-sm shadow-none focus-visible:border-primary focus-visible:ring-0"
                        onChange={(event) => onChange(event.target.value)}
                        onFocus={onFocus}
                        onBlur={onBlur}
                        onKeyDown={onKeyDown}
                    >
                        <NativeSelectOption value="">
                            {field.placeholder ?? "Select..."}
                        </NativeSelectOption>
                        {field.options?.map((option) => (
                            <NativeSelectOption key={option.value} value={option.value}>
                                {option.label}
                            </NativeSelectOption>
                        ))}
                    </NativeSelect>
                ) : (
                    <Input
                        id={fieldId}
                        ref={inputRef}
                        value={value}
                        inputMode={getInputMode(field)}
                        placeholder={field.placeholder}
                        aria-invalid={Boolean(error)}
                        aria-describedby={describedBy}
                        className="h-8 rounded-none border-0 border-b border-dashed border-transparent bg-transparent px-0 text-sm shadow-none focus-visible:border-primary focus-visible:ring-0"
                        onChange={(event) => onChange(event.target.value)}
                        onFocus={onFocus}
                        onBlur={onBlur}
                        onKeyDown={onKeyDown}
                    />
                )}

                {showDateHint ? (
                    <p id={helpId} className="mt-1 text-xs text-muted-foreground">
                        Accepts: DD-MM-YY, DD/MM/YYYY, or YYYY-MM-DD. Example: 20-06-26 -&gt; 2026-06-20
                    </p>
                ) : displayValue ? (
                    <p id={helpId} className="mt-1 text-xs text-muted-foreground">
                        {displayValue}
                    </p>
                ) : field.helpText ? (
                    <p id={helpId} className="mt-1 text-xs text-muted-foreground">
                        {field.helpText}
                    </p>
                ) : null}

                {error ? (
                    <p id={errorId} role="alert" className="mt-1 text-xs font-medium text-destructive">
                        {error}
                    </p>
                ) : null}
            </div>

            <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label={`Clear ${field.label}`}
                className="size-8 text-muted-foreground hover:text-foreground"
                onClick={onClear}
            >
                <XIcon className="size-4" />
            </Button>
        </div>
    )
}
