"use client"

import { Loader2Icon, PencilIcon, SaveIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { QuickEntryReportSchema, ReportDraft } from "./quick-entry-types"
import {
    formatQuickEntryValue,
    validateReportDraft,
} from "./quick-entry-utils"

type QuickEntryReviewProps = {
    schema: QuickEntryReportSchema
    draft: ReportDraft
    contextLabel: string
    saving?: boolean
    onEdit: () => void
    onSave: () => void
}

export function QuickEntryReview({
    schema,
    draft,
    contextLabel,
    saving = false,
    onEdit,
    onSave,
}: QuickEntryReviewProps) {
    const errors = validateReportDraft(draft, schema)
    const hasErrors = Object.keys(errors).length > 0
    const summary = schema.calculateSummary?.(draft.values) ?? []
    const dateField = schema.fields.find((field) => field.type === "date")
    const reportDate = dateField
        ? formatQuickEntryValue(dateField, draft.values[dateField.key])
        : ""

    return (
        <section className="rounded-lg border border-border bg-background p-4">
            <div className="flex flex-col gap-3 border-b border-border pb-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <h2 className="text-lg font-semibold text-foreground">
                        {schema.label} Report
                    </h2>
                    <div className="mt-1 grid gap-1 text-sm text-muted-foreground">
                        {reportDate ? <p>Report date: {reportDate}</p> : null}
                        <p>Assembly: {contextLabel}</p>
                    </div>
                </div>

                <Button type="button" variant="outline" onClick={onEdit} disabled={saving}>
                    <PencilIcon className="size-4" />
                    Edit
                </Button>
            </div>

            <dl className="grid gap-2 py-4">
                {schema.fields.map((field) => (
                    <div
                        key={field.key}
                        className="grid gap-1 text-sm sm:grid-cols-[220px_1fr]"
                    >
                        <dt className="text-muted-foreground">{field.label}</dt>
                        <dd className="font-medium text-foreground">
                            {formatQuickEntryValue(field, draft.values[field.key]) || "-"}
                        </dd>
                    </div>
                ))}
            </dl>

            {summary.length > 0 ? (
                <div className="grid gap-2 border-y border-border py-3">
                    {summary.map((item) => (
                        <div
                            key={item.label}
                            className="flex items-center justify-between gap-4 text-sm"
                        >
                            <span className="font-medium text-foreground">{item.label}</span>
                            <span className="font-semibold tabular-nums text-foreground">
                                {item.value}
                            </span>
                        </div>
                    ))}
                </div>
            ) : null}

            {hasErrors ? (
                <div role="alert" className="mt-4 rounded-md border border-destructive/25 bg-destructive/5 p-3">
                    <p className="text-sm font-semibold text-destructive">Resolve validation issues before saving.</p>
                    <ul className="mt-2 grid gap-1 text-sm text-destructive">
                        {Object.entries(errors).map(([key, error]) => (
                            <li key={key}>{error}</li>
                        ))}
                    </ul>
                </div>
            ) : null}

            <div className="mt-4 flex justify-end">
                <Button
                    type="button"
                    disabled={hasErrors || saving}
                    onClick={onSave}
                >
                    {saving ? (
                        <Loader2Icon className="size-4 animate-spin" />
                    ) : (
                        <SaveIcon className="size-4" />
                    )}
                    Save report
                </Button>
            </div>
        </section>
    )
}
