"use client"

import * as React from "react"
import { AlertCircleIcon, PlayIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

type QuickEntryCommandInputProps = {
    value: string
    placeholder?: string
    error?: string | null
    suggestion?: string
    validTypes: string[]
    disabled?: boolean
    onChange: (value: string) => void
    onSubmit: () => void
    onClearSuggestions?: () => void
}

export function QuickEntryCommandInput({
    value,
    placeholder = "/create attendance",
    error,
    suggestion,
    validTypes,
    disabled = false,
    onChange,
    onSubmit,
    onClearSuggestions,
}: QuickEntryCommandInputProps) {
    const errorId = React.useId()

    function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
        if (event.key === "Enter") {
            event.preventDefault()
            onSubmit()
        }

        if (event.key === "Escape") {
            onClearSuggestions?.()
        }
    }

    return (
        <div className="grid gap-2">
            <Label htmlFor="quick-entry-command">Command</Label>

            <div className="flex flex-col gap-2 sm:flex-row">
                <Input
                    id="quick-entry-command"
                    value={value}
                    disabled={disabled}
                    placeholder={placeholder}
                    spellCheck={false}
                    autoCapitalize="none"
                    autoComplete="off"
                    aria-invalid={Boolean(error)}
                    aria-describedby={error ? errorId : undefined}
                    className="font-mono text-sm"
                    onChange={(event) => onChange(event.target.value)}
                    onKeyDown={handleKeyDown}
                />
                <Button
                    type="button"
                    disabled={disabled}
                    onClick={onSubmit}
                    className="sm:w-auto"
                >
                    <PlayIcon className="size-4" />
                    Create
                </Button>
            </div>

            {error ? (
                <div
                    id={errorId}
                    role="alert"
                    className="flex items-start gap-2 rounded-md border border-destructive/25 bg-destructive/5 px-3 py-2 text-sm text-destructive"
                >
                    <AlertCircleIcon className="mt-0.5 size-4 shrink-0" />
                    <div>
                        <p>{error}</p>
                        {suggestion ? (
                            <p className="mt-1 text-foreground">
                                Did you mean: <span className="font-medium">{suggestion}</span>?
                            </p>
                        ) : null}
                        <p className={cn("mt-1 text-muted-foreground", suggestion && "text-xs")}>
                            Valid types: {validTypes.join(", ")}
                        </p>
                    </div>
                </div>
            ) : null}
        </div>
    )
}
