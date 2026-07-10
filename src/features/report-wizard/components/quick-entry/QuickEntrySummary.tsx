"use client"

import { AlertCircleIcon, CheckCircle2Icon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { QuickEntryReportSchema, ReportDraft } from "./quick-entry-types"
import { validateReportDraft } from "./quick-entry-utils"

type QuickEntrySummaryProps = {
    schema: QuickEntryReportSchema
    draft: ReportDraft
}

export function QuickEntrySummary({ schema, draft }: QuickEntrySummaryProps) {
    const validationErrors = validateReportDraft(draft, schema)
    const errorCount = Object.keys(validationErrors).length
    const summary = schema.calculateSummary?.(draft.values) ?? []

    return (
        <aside className="rounded-lg border border-border bg-muted/25 p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                    <p className="text-sm font-semibold text-foreground">
                        {schema.label}
                    </p>
                    {schema.description ? (
                        <p className="mt-1 text-sm text-muted-foreground">
                            {schema.description}
                        </p>
                    ) : null}
                </div>

                {errorCount === 0 ? (
                    <Badge variant="secondary" className="gap-1 text-emerald-700 dark:text-emerald-300">
                        <CheckCircle2Icon className="size-3" />
                        Valid
                    </Badge>
                ) : (
                    <Badge variant="outline" className="gap-1 text-amber-700 dark:text-amber-300">
                        <AlertCircleIcon className="size-3" />
                        {errorCount} issue{errorCount === 1 ? "" : "s"}
                    </Badge>
                )}
            </div>

            {summary.length > 0 ? (
                <div className="mt-4 grid gap-2 border-t border-border pt-3">
                    {summary.map((item) => (
                        <div
                            key={item.label}
                            className="flex items-center justify-between gap-4 text-sm"
                        >
                            <span className="text-muted-foreground">{item.label}</span>
                            <span className="font-semibold tabular-nums text-foreground">
                                {item.value}
                            </span>
                        </div>
                    ))}
                </div>
            ) : null}

            {errorCount > 0 ? (
                <ul className="mt-4 grid gap-1 border-t border-border pt-3 text-sm text-destructive">
                    {Object.entries(validationErrors).map(([key, error]) => (
                        <li key={key}>{error}</li>
                    ))}
                </ul>
            ) : null}
        </aside>
    )
}
