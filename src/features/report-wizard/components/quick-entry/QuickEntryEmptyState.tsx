"use client"

import { KeyboardIcon } from "lucide-react"

type QuickEntryEmptyStateProps = {
    suggestedCommand: string
}

export function QuickEntryEmptyState({ suggestedCommand }: QuickEntryEmptyStateProps) {
    return (
        <div className="rounded-lg border border-dashed border-border bg-muted/20 p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-md border border-border bg-background text-muted-foreground">
                    <KeyboardIcon className="size-5" />
                </span>
                <div>
                    <p className="text-sm font-semibold text-foreground">
                        Start a quick entry draft
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Type a create command, then fill the generated report fields.
                    </p>
                    <p className="mt-3 w-fit rounded-md bg-muted px-2 py-1 font-mono text-sm text-foreground">
                        {suggestedCommand}
                    </p>
                </div>
            </div>
        </div>
    )
}
