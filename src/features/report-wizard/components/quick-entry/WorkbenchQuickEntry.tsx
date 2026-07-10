"use client"

import * as React from "react"
import Link from "next/link"
import { useQueryClient } from "@tanstack/react-query"
import {
    AlertTriangleIcon,
    ArrowUpIcon,
    CheckCircle2Icon,
    FileSpreadsheetIcon,
    FileTextIcon,
    HelpCircleIcon,
    ImageIcon,
    Loader2Icon,
    PaperclipIcon,
    PlusIcon,
    RotateCcwIcon,
    XIcon,
} from "lucide-react"
import { toast } from "sonner"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { apiRoutes } from "@/config/urls"
import { useUser } from "@/hooks/query/use-user"
import { createReportWizardHref } from "@/features/report-wizard/config/report-types"
import { cn } from "@/lib/utils"
import {
    createReportDraft,
    formatQuickEntryValue,
    parseCreateReportCommand,
    parseQuickEntryBatchInput,
    parseQuickEntryInput,
    parseQuickEntryValue,
    resolveReportType,
    serializeQuickEntryBackendPayload,
    validateReportDraft,
} from "./quick-entry-utils"
import type { ParsedQuickEntryBatchRow } from "./quick-entry-utils"
import type {
    ParsedQuickEntryResult,
    QuickEntryFieldDefinition,
    QuickEntryReportSchema,
    ReportDraft,
} from "./quick-entry-types"
import { CalendarAdd01Icon, CreditCardAddIcon, UploadSquare01Icon, WalletAdd02Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Textarea } from "@/components/ui/textarea";

type WorkbenchQuickEntryProps = {
    initialReportType?: string
    currentSectionId?: string
    contextLabel?: string
    periodLabel?: string
    sectionStatusId?: number
    closeHref?: string
    onClose?: () => void
}

type ApiErrorBody = {
    detail?: string
    error?: string
    message?: string
    non_field_errors?: string[]
    errors?: Array<{
        index: number
        errors: Record<string, string[] | string>
        existing_record_id?: number
    }>
}

type AttendancePreviewRow = ParsedQuickEntryBatchRow & {
    clientId: string
}

type AttendanceBulkCreateResponse = {
    count: number
    ids: number[]
    records: unknown[]
}

const REPORT_ACTIONS = [
    { label: "Create attendance", type: "attendance", icon: CalendarAdd01Icon },
    { label: "Create tithes", type: "tithes", icon: WalletAdd02Icon },
    { label: "Create revenue", type: "revenue", icon: WalletAdd02Icon },
    { label: "Create expenditure", type: "expenditure", icon: CreditCardAddIcon },
] as const

function hasValue(value: unknown) {
    if (value === undefined || value === null) return false
    if (typeof value === "string") return value.trim().length > 0
    return true
}

function hasDraftValues(draft: ReportDraft | null) {
    return Boolean(draft && Object.values(draft.values).some(hasValue))
}

function hasWorkbenchValues(draft: ReportDraft | null, attendanceRows: AttendancePreviewRow[]) {
    return hasDraftValues(draft) || attendanceRows.length > 0
}

function getFirstValidationError(errors: Record<string, string>) {
    return Object.values(errors)[0] ?? null
}

async function getResponseError(response: Response) {
    try {
        const body = await response.json() as ApiErrorBody
        return body.detail
            ?? body.error
            ?? body.message
            ?? body.non_field_errors?.join(", ")
            ?? "Could not save report."
    } catch {
        return "Could not save report."
    }
}

function getDateField(schema: QuickEntryReportSchema) {
    return schema.fields.find((field) => field.type === "date") ?? null
}

function getReportDateLabel(schema: QuickEntryReportSchema, draft: ReportDraft | null) {
    const dateField = getDateField(schema)
    if (!dateField || !draft) return ""

    return formatQuickEntryValue(dateField, draft.values[dateField.key])
}

function getMissingRequiredFields(schema: QuickEntryReportSchema, draft: ReportDraft | null) {
    if (!draft) return schema.fields.filter((field) => field.required)

    return schema.fields.filter((field) => field.required && !hasValue(draft.values[field.key]))
}

function getEnteredRows(schema: QuickEntryReportSchema, draft: ReportDraft) {
    return schema.fields
        .map((field) => ({
            field,
            value: draft.values[field.key],
            displayValue: formatQuickEntryValue(field, draft.values[field.key]),
        }))
        .filter((row) => hasValue(row.value))
}

function createPreviewRow(row: ParsedQuickEntryBatchRow): AttendancePreviewRow {
    const randomId = typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2)}`

    return {
        ...row,
        clientId: randomId,
    }
}

function getSerializableAttendanceRecord(
    schema: QuickEntryReportSchema,
    values: Record<string, unknown>
) {
    return Object.fromEntries(
        Object.entries(schema.serialize?.(values) ?? values)
            .filter(([, value]) => value !== undefined && value !== "")
    )
}

function getSerializableAttendanceRecords(
    schema: QuickEntryReportSchema,
    rows: AttendancePreviewRow[]
) {
    return rows.map((row) => getSerializableAttendanceRecord(schema, row.values))
}

function getNonDuplicateErrors(errors: Record<string, string>) {
    return Object.fromEntries(
        Object.entries(errors).filter(([, message]) => (
            !message.startsWith("Duplicates preview row")
        ))
    )
}

function validateAttendancePreviewRows(
    schema: QuickEntryReportSchema,
    rows: AttendancePreviewRow[]
) {
    const dateField = getDateField(schema)
    const seenKeys = new Map<string, number>()

    const validated = rows.map((row) => {
        const draft = createReportDraft(schema)
        draft.values = row.values
        draft.errors = getNonDuplicateErrors(row.errors)
        const errors = validateReportDraft(draft, schema)

        return {
            ...row,
            errors,
            state: Object.keys(errors).length > 0
                ? "needs_attention"
                : "ready",
        } satisfies AttendancePreviewRow
    })

    return validated.map((row, index) => {
        if (!dateField || Object.keys(row.errors).length > 0) {
            return row
        }

        const naturalKey = [
            row.values[dateField.key],
            row.values.service_type ?? "sunday",
            row.values.homecell ?? "",
        ].join("|")
        const duplicateOf = seenKeys.get(naturalKey)

        if (duplicateOf !== undefined) {
            return {
                ...row,
                errors: {
                    ...row.errors,
                    _record: `Duplicates preview row ${duplicateOf + 1}.`,
                },
                state: "duplicate",
            } satisfies AttendancePreviewRow
        }

        seenKeys.set(naturalKey, index)
        return row
    })
}

function flattenBackendError(errors: Record<string, string[] | string>) {
    return Object.entries(errors).reduce<Record<string, string>>((acc, [key, value]) => {
        acc[key] = Array.isArray(value) ? value.join(" ") : value
        return acc
    }, {})
}

function getAttendanceRowStatus(row: AttendancePreviewRow) {
    if (row.state === "duplicate") return "Duplicate"
    if (Object.keys(row.errors).length > 0) return "Needs attention"
    return "Ready"
}

function getAttendanceRowStatusClass(row: AttendancePreviewRow) {
    if (row.state === "duplicate") {
        return "border-amber-300 text-amber-700 dark:text-amber-300"
    }

    if (Object.keys(row.errors).length > 0) {
        return "border-destructive/40 text-destructive"
    }

    return "border-emerald-300 text-emerald-700 dark:text-emerald-300"
}

function getPreviewExample(schema: QuickEntryReportSchema) {
    const dateField = getDateField(schema)
    const fieldKeys = schema.fields
        .filter((field) => field.key !== dateField?.key && field.type === "number")
        .slice(0, 2)
        .map((field, index) => `${field.key}=${index === 0 ? 200 : 50}`)

    return [
        `${dateField?.aliases?.[0] ?? dateField?.key ?? "date"}=2026-06-18`,
        ...fieldKeys,
    ].join(" ")
}

function getContextLine(
    schema: QuickEntryReportSchema,
    draft: ReportDraft | null,
    assemblyLabel: string,
    periodLabel?: string
) {
    const reportDate = getReportDateLabel(schema, draft)

    if (reportDate) return `${assemblyLabel} - ${reportDate}`
    if (periodLabel) return `${assemblyLabel} - ${periodLabel}`
    return `${assemblyLabel} - Report date required`
}

function getPlaceholder(schema: QuickEntryReportSchema | null) {
    if (!schema) return "Type / for commands"
    if (schema.type === "attendance") return `Try: ${getPreviewExample(schema)}`
    if (schema.type === "tithes") return "Try: cash=1200 bank=4500 mobile_money=820 date=20-6-26"
    if (schema.type === "member") return "Try: first_name=John last_name=Ndlovu gender=Male dob=20-6-96"
    return "Try: amount=1200 category=Offering date=20-6-26"
}

function shouldShowDateHint(value: string) {
    return /\b(date|report_date|dob|date_of_birth)\s*=\s*$/i.test(value)
        || /\b(date|report_date|dob|date_of_birth)\s*=\s*\d{1,2}[-/.]?\d{0,2}$/i.test(value)
}

function WorkbenchUploadMenu({
    sectionId,
}: {
    sectionId?: string
}) {
    const uploadSection = sectionId === "income" ? "revenue" : sectionId === "expenditure" ? "expenses" : sectionId ?? "attendance"

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="size-8 rounded-full text-muted-foreground"
                    aria-label="Upload report"
                >
                    <PaperclipIcon className="size-5" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" side="top" className="w-64">
                <DropdownMenuLabel>Upload report</DropdownMenuLabel>
                <DropdownMenuItem asChild>
                    <Link href={createReportWizardHref(uploadSection, {
                        method: "upload",
                        upload_type: "excel",
                    })}>
                        <FileSpreadsheetIcon className="size-4" />
                        Excel / CSV template
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link href={createReportWizardHref(uploadSection, {
                        method: "upload",
                        upload_type: "photo",
                    })}>
                        <ImageIcon className="size-4" />
                        Image or scanned form
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <Link href={createReportWizardHref(uploadSection, {
                        method: "upload",
                        upload_type: "ocr",
                    })}>
                        <FileTextIcon className="size-4" />
                        OCR correction flow
                    </Link>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

const buttonStyles = cn(
    "h-7 rounded-[7px] bg-surface px-2 text-sm font-normal text-foreground outline-none has-[>svg]:px-2", 
    "transition-colors focus-visible:ring-2 focus-visible:ring-ring shadow-control",
    "hover:bg-neutral-50 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.85),0_1px_2px_rgba(0,0,0,0.07),0_0_0_1px_rgba(0,0,0,0.12)] dark:bg-[#1A1A19]",
    "dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_1px_2px_rgba(0,0,0,0.28),0_0_0_1px_rgba(255,255,255,0.10)]"
)

function WorkbenchWelcome({
    firstName,
    onCreate,
}: {
    firstName: string
    onCreate: (type: string) => void
}) {
    return (
        <div className="flex min-h-80 flex-1 flex-col items-center justify-center px-4 text-center">
            <div className="max-w-lg">
                <p className="text-2xl font-medium leading-tight tracking-tight text-primary md:text-[28px]">
                    Hello, {firstName}
                </p>
                <h2 className="mt-0 text-lg font-medium leading-tight tracking-tight text-foreground md:text-[28px]">
                    Welcome to your Workbench
                </h2>

                <div className="mt-7 flex flex-wrap justify-center gap-2">
                    {REPORT_ACTIONS.slice(0, 4).map((action) => (
                        <Button 
                            variant="outline"
                            key={action.type}
                            type="button"
                            className={buttonStyles}
                            onClick={() => onCreate(action.type)}
                        >
                            <HugeiconsIcon icon={action.icon} className="size-4" /> {action.label}
                        </Button>
                    ))}
                    <Button asChild className={buttonStyles}>
                        <Link
                        href={createReportWizardHref("attendance", {
                            method: "upload",
                            upload_type: "excel",
                        })}
                        
                    >
                        <HugeiconsIcon icon={UploadSquare01Icon} className="size-4" /> Upload report
                    </Link>
                    </Button>
                    {/* <Button variant="outline"
                        type="button"
                        className={buttonStyles}
                        onClick={() => onCreate("member")}
                    >
                        Add member
                    </Button> */}
                </div>
            </div>

            {/* <p className="mt-12 max-w-lg text-balance text-[13px] text-[#5d5d5f]">
                Work faster with quick entry, uploads, and report creation.
                
            </p> */}
        </div>
    )
}

function WorkbenchStatus({
    messages,
    warnings,
    errors,
}: {
    messages: string[]
    warnings: string[]
    errors: string[]
}) {
    if (messages.length === 0 && warnings.length === 0 && errors.length === 0) return null

    return (
        <div aria-live="polite" className="grid gap-2">
            {messages.slice(0, 3).map((message) => (
                <p key={message} className="flex items-center gap-2 text-sm text-emerald-700 dark:text-emerald-300">
                    <CheckCircle2Icon className="size-4" />
                    {message}
                </p>
            ))}
            {warnings.map((warning) => (
                <p key={warning} className="flex items-center gap-2 text-sm text-amber-700 dark:text-amber-300">
                    <AlertTriangleIcon className="size-4" />
                    {warning}
                </p>
            ))}
            {errors.map((error) => (
                <p key={error} role="alert" className="flex items-center gap-2 text-sm text-destructive">
                    <AlertTriangleIcon className="size-4" />
                    {error}
                </p>
            ))}
        </div>
    )
}

function WorkbenchPreview({
    schema,
    draft,
    assemblyLabel,
    periodLabel,
    onReview,
}: {
    schema: QuickEntryReportSchema
    draft: ReportDraft
    assemblyLabel: string
    periodLabel?: string
    onReview: () => void
}) {
    const rows = getEnteredRows(schema, draft)
    const summary = schema.calculateSummary?.(draft.values) ?? []
    const missing = getMissingRequiredFields(schema, draft)
    const recognizedCount = rows.length
    const errors = validateReportDraft(draft, schema)
    const hasBlockingErrors = Object.keys(errors).length > 0

    if (recognizedCount === 0) {
        return (
            <section className="mx-auto w-full max-w-full px-2 pt-4">
                <div className="rounded-lg border border-dashed border-border p-4 text-sm text-muted-foreground">
                    {schema.label} draft started. Enter values below with key=value.
                </div>
            </section>
        )
    }

    return (
        <section className="mx-auto w-full max-w-full px-2 pt-4">
            <div className="grid gap-5">
                <div>
                    <p className="text-lg font-medium text-foreground">
                        Your stats are ready to be created.
                    </p>
                    <div className="mt-4 flex flex-wrap items-center gap-2">
                        <Badge variant="secondary">{recognizedCount} fields recognised</Badge>
                        {missing.length > 0 ? (
                            <Badge variant="outline" className="border-amber-300 text-amber-700 dark:text-amber-300">
                                {missing.length} required missing
                            </Badge>
                        ) : (
                            <Badge variant="outline" className="border-emerald-300 text-emerald-700 dark:text-emerald-300">
                                Required fields complete
                            </Badge>
                        )}
                    </div>
                </div>

                <div>
                    <h2 className="text-lg font-semibold text-foreground">
                        {schema.label} {schema.type === "member" ? "draft" : "report"}
                    </h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                        {getContextLine(schema, draft, assemblyLabel, periodLabel)}
                    </p>
                </div>

                <div className="overflow-hidden rounded-lg border border-border">
                    <div className="grid grid-cols-2 border-b border-border bg-muted/30 text-sm font-semibold text-muted-foreground">
                        <div className="border-r border-border px-4 py-3">Field</div>
                        <div className="px-4 py-3">Value</div>
                    </div>
                    {rows.map((row) => (
                        <div
                            key={row.field.key}
                            className="grid grid-cols-2 border-b border-border last:border-b-0"
                        >
                            <div className="border-r border-border px-4 py-3 text-sm text-muted-foreground">
                                {row.field.label}
                            </div>
                            <div className="px-4 py-3 text-sm text-foreground">
                                {row.displayValue}
                            </div>
                        </div>
                    ))}
                    {summary.length > 0 ? (
                        <div className="border-t border-border bg-muted/20 px-4 py-3">
                            {summary.map((item) => (
                                <div
                                    key={item.label}
                                    className="flex items-center justify-between gap-4 text-sm font-semibold"
                                >
                                    <span className="text-foreground">{item.label}</span>
                                    <span className="tabular-nums text-foreground">{item.value}</span>
                                </div>
                            ))}
                        </div>
                    ) : null}
                </div>

                {hasBlockingErrors ? (
                    <div className="rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-950 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-100">
                        <p className="font-semibold">Your report still needs:</p>
                        <ul className="mt-2 grid gap-1">
                            {Object.entries(errors).map(([key, error]) => (
                                <li key={key}>{error}</li>
                            ))}
                        </ul>
                    </div>
                ) : null}

                <Button
                    type="button"
                    size="lg"
                    className="h-11 w-full rounded-lg text-sm font-semibold"
                    onClick={onReview}
                >
                    Review report
                </Button>
            </div>
        </section>
    )
}

function WorkbenchAttendanceBatchPreview({
    schema,
    rows,
    saving,
    onEditCell,
    onRemoveRow,
    onSave,
}: {
    schema: QuickEntryReportSchema
    rows: AttendancePreviewRow[]
    saving: boolean
    onEditCell: (rowId: string, field: QuickEntryFieldDefinition, value: string | boolean) => void
    onRemoveRow: (rowId: string) => void
    onSave: () => void
}) {
    const readyCount = rows.filter((row) => Object.keys(row.errors).length === 0).length
    const attentionCount = rows.length - readyCount
    const hasErrors = attentionCount > 0
    const jsonPreview = getSerializableAttendanceRecords(schema, rows)
    const example = getPreviewExample(schema)

    if (rows.length === 0) {
        return (
            <section className="mx-auto grid w-full max-w-5xl gap-4 px-2 pt-4">
                <div className="rounded-lg border border-dashed border-border bg-muted/20 p-4 text-sm text-muted-foreground">
                    <p className="font-medium text-foreground">Enter attendance values to create a preview.</p>
                    <p className="mt-2 font-mono text-xs">Example: {example}</p>
                    <p className="mt-1 font-mono text-xs">Batch: [{example}] [{example.replace("2026-06-18", "2026-06-27")}]</p>
                </div>
            </section>
        )
    }

    return (
        <section className="mx-auto grid w-full max-w-5xl gap-4 px-2 pt-4">
            <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline" className="border-emerald-300 text-emerald-700 dark:text-emerald-300">
                    {readyCount} {readyCount === 1 ? "record" : "records"} ready
                </Badge>
                {attentionCount > 0 ? (
                    <Badge variant="outline" className="border-amber-300 text-amber-700 dark:text-amber-300">
                        {attentionCount} {attentionCount === 1 ? "record needs" : "records need"} attention
                    </Badge>
                ) : null}
            </div>

            <div className="overflow-hidden rounded-lg border border-border">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-12">#</TableHead>
                                <TableHead>Status</TableHead>
                                {schema.fields.map((field) => (
                                    <TableHead key={field.key}>{field.label}</TableHead>
                                ))}
                                <TableHead className="w-14 text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {rows.map((row, rowIndex) => (
                                <TableRow key={row.clientId}>
                                    <TableCell className="font-mono text-muted-foreground">
                                        {rowIndex + 1}
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant="outline"
                                            className={getAttendanceRowStatusClass(row)}
                                        >
                                            {getAttendanceRowStatus(row)}
                                        </Badge>
                                        {row.errors._record ? (
                                            <p className="mt-1 max-w-48 whitespace-normal text-xs text-destructive">
                                                {row.errors._record}
                                            </p>
                                        ) : null}
                                    </TableCell>
                                    {schema.fields.map((field) => {
                                        const value = row.values[field.key]
                                        const error = row.errors[field.key]

                                        return (
                                            <TableCell key={field.key} className="min-w-36 align-top">
                                                {field.type === "select" ? (
                                                    <select
                                                        value={typeof value === "string" ? value : ""}
                                                        disabled={saving}
                                                        className="h-8 w-full rounded-md border border-input bg-background px-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                                        onChange={(event) => onEditCell(row.clientId, field, event.target.value)}
                                                    >
                                                        <option value="">Default</option>
                                                        {field.options?.map((option) => (
                                                            <option key={option.value} value={option.value}>
                                                                {option.label}
                                                            </option>
                                                        ))}
                                                    </select>
                                                ) : field.type === "boolean" ? (
                                                    <input
                                                        type="checkbox"
                                                        checked={value === true}
                                                        disabled={saving}
                                                        className="size-4 rounded border-input"
                                                        onChange={(event) => onEditCell(row.clientId, field, event.target.checked)}
                                                    />
                                                ) : (
                                                    <input
                                                        value={value === undefined || value === null ? "" : String(value)}
                                                        disabled={saving}
                                                        type={field.type === "number" ? "number" : field.type === "date" ? "date" : "text"}
                                                        min={field.min}
                                                        max={field.max}
                                                        className="h-8 w-full rounded-md border border-input bg-background px-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                                        onChange={(event) => onEditCell(row.clientId, field, event.target.value)}
                                                    />
                                                )}
                                                {error ? (
                                                    <p className="mt-1 max-w-44 whitespace-normal text-xs text-destructive">
                                                        {error}
                                                    </p>
                                                ) : null}
                                            </TableCell>
                                        )
                                    })}
                                    <TableCell className="text-right align-top">
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="size-8"
                                            disabled={saving}
                                            aria-label={`Remove preview row ${rowIndex + 1}`}
                                            onClick={() => onRemoveRow(row.clientId)}
                                        >
                                            <XIcon className="size-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>

            <div className="grid gap-2">
                <p className="text-sm font-medium text-foreground">JSON preview</p>
                <pre className="max-h-60 overflow-auto rounded-lg border border-border bg-muted/30 p-3 text-xs text-muted-foreground">
                    {JSON.stringify(jsonPreview, null, 2)}
                </pre>
            </div>

            {hasErrors ? (
                <div role="alert" className="rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm text-amber-950 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-100">
                    Nothing will be saved until the highlighted preview records are fixed or removed.
                </div>
            ) : null}

            <Button
                type="button"
                size="lg"
                className="h-11 w-full rounded-lg text-sm font-semibold"
                disabled={saving || rows.length === 0 || hasErrors}
                onClick={onSave}
            >
                {saving ? <Loader2Icon className="size-4 animate-spin" /> : null}
                {saving
                    ? `Saving ${rows.length} attendance ${rows.length === 1 ? "record" : "records"}...`
                    : `Save ${rows.length} attendance ${rows.length === 1 ? "record" : "records"}`}
            </Button>
        </section>
    )
}

function WorkbenchReview({
    schema,
    draft,
    assemblyLabel,
    periodLabel,
    saving,
    onEdit,
    onSave,
}: {
    schema: QuickEntryReportSchema
    draft: ReportDraft
    assemblyLabel: string
    periodLabel?: string
    saving: boolean
    onEdit: () => void
    onSave: () => void
}) {
    const rows = getEnteredRows(schema, draft)
    const summary = schema.calculateSummary?.(draft.values) ?? []
    const errors = validateReportDraft(draft, schema)
    const hasErrors = Object.keys(errors).length > 0

    return (
        <section className="mx-auto w-full max-w-full px-2 pt-4">
            <div className="grid gap-6">
                <div>
                    <h2 className="text-xl font-semibold text-foreground">
                        {schema.label} {schema.type === "member" ? "draft" : "report"}
                    </h2>
                    <dl className="mt-4 grid gap-2 text-base">
                        <div className="flex flex-wrap gap-x-2">
                            <dt className="font-medium text-foreground">Assembly:</dt>
                            <dd className="text-muted-foreground">{assemblyLabel}</dd>
                        </div>
                        <div className="flex flex-wrap gap-x-2">
                            <dt className="font-medium text-foreground">Reporting date:</dt>
                            <dd className="text-muted-foreground">
                                {getReportDateLabel(schema, draft) || periodLabel || "Not set"}
                            </dd>
                        </div>
                    </dl>
                </div>

                <div className="overflow-hidden rounded-lg border border-border">
                    {rows.map((row) => (
                        <div
                            key={row.field.key}
                            className="grid gap-1 border-b border-border px-5 py-4 last:border-b-0 sm:grid-cols-[220px_1fr]"
                        >
                            <dt className="text-muted-foreground">{row.field.label}</dt>
                            <dd className="font-medium text-foreground">{row.displayValue}</dd>
                        </div>
                    ))}
                    {summary.length > 0 ? (
                        <div className="border-t border-border bg-muted/20 px-5 py-4">
                            {summary.map((item) => (
                                <div
                                    key={item.label}
                                    className="flex items-center justify-between gap-4 text-sm font-semibold"
                                >
                                    <span>{item.label}</span>
                                    <span className="tabular-nums">{item.value}</span>
                                </div>
                            ))}
                        </div>
                    ) : null}
                </div>

                {hasErrors ? (
                    <div role="alert" className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
                        {getFirstValidationError(errors)}
                    </div>
                ) : null}

                <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
                    <Button type="button" variant="outline" size="lg" onClick={onEdit} disabled={saving}>
                        Back to edit
                    </Button>
                    <Button type="button" size="lg" onClick={onSave} disabled={saving || hasErrors}>
                        {saving ? <Loader2Icon className="size-4 animate-spin" /> : null}
                        Save report
                    </Button>
                </div>
            </div>
        </section>
    )
}

function WorkbenchHelp({
    schema,
    onClose,
}: {
    schema: QuickEntryReportSchema | null
    onClose: () => void
}) {
    if (!schema) return null

    const examples = schema.type === "attendance"
        ? [
            getPreviewExample(schema),
            `[${getPreviewExample(schema)}] [${getPreviewExample(schema).replace("2026-06-18", "2026-06-27")}]`,
            `notes="Sunday morning service"`,
            "/remove 2",
        ]
        : ["amount=1200", "date=20-6-26", "/review", "/cancel"]

    return (
        <div className="mx-auto w-full max-w-full px-2 pt-4">
            <div className="rounded-lg border border-border bg-muted/20 p-4">
                <div className="flex items-start justify-between gap-3">
                    <div>
                        <p className="font-semibold text-foreground">
                            {schema.label} quick entry examples
                        </p>
                        <div className="mt-3 grid gap-1 font-mono text-sm text-muted-foreground">
                            {examples.map((example) => (
                                <span key={example}>{example}</span>
                            ))}
                        </div>
                    </div>
                    <Button type="button" variant="ghost" size="icon" onClick={onClose} aria-label="Close help">
                        <XIcon className="size-4" />
                    </Button>
                </div>
            </div>
        </div>
    )
}

export function WorkbenchQuickEntry({
    initialReportType = "attendance",
    currentSectionId,
    contextLabel = "Current assembly",
    periodLabel,
    sectionStatusId,
    closeHref = "/reports",
    onClose,
}: WorkbenchQuickEntryProps) {
    const queryClient = useQueryClient()
    const { data: user } = useUser()
    const activeAssembly = user?.assemblies?.find((assembly) => Number(assembly.id) === Number(user?.church))
    const assemblyLabel = contextLabel !== "Current assembly"
        ? contextLabel
        : activeAssembly?.name ?? "Current assembly"
    const firstName = user?.first_name?.trim() || "there"
    const suggestedSchema = resolveReportType(initialReportType) ?? resolveReportType("attendance")
    const [schema, setSchema] = React.useState<QuickEntryReportSchema | null>(null)
    const [draft, setDraft] = React.useState<ReportDraft | null>(null)
    const [attendanceRows, setAttendanceRows] = React.useState<AttendancePreviewRow[]>([])
    const [composer, setComposer] = React.useState("")
    const [messages, setMessages] = React.useState<string[]>([])
    const [warnings, setWarnings] = React.useState<string[]>([])
    const [errors, setErrors] = React.useState<string[]>([])
    const [savedMessage, setSavedMessage] = React.useState("")
    const [saving, setSaving] = React.useState(false)
    const [discardOpen, setDiscardOpen] = React.useState(false)
    const [attendanceConfirmOpen, setAttendanceConfirmOpen] = React.useState(false)
    const [helpOpen, setHelpOpen] = React.useState(false)
    const textareaRef = React.useRef<HTMLTextAreaElement | null>(null)

    React.useEffect(() => {
        textareaRef.current?.focus()
    }, [schema?.type, draft?.status])

    function focusComposerSoon() {
        window.setTimeout(() => textareaRef.current?.focus(), 0)
    }

    function startDraft(type: string) {
        const nextSchema = resolveReportType(type)

        if (!nextSchema) {
            setErrors([`Unknown report type: ${type}.`])
            return
        }

        setSchema(nextSchema)
        setDraft(createReportDraft(nextSchema))
        setAttendanceRows([])
        setComposer("")
        setMessages([`${nextSchema.label} draft started.`])
        setWarnings([])
        setErrors([])
        setSavedMessage("")
        setHelpOpen(false)
    }

    function resetWorkbench() {
        setSchema(null)
        setDraft(null)
        setAttendanceRows([])
        setComposer("")
        setMessages([])
        setWarnings([])
        setErrors([])
        setSavedMessage("")
        setHelpOpen(false)
        setDiscardOpen(false)
        setAttendanceConfirmOpen(false)
    }

    function applyParsedResult(result: ParsedQuickEntryResult) {
        if (!schema || !draft) return

        const updateKeys = Object.keys(result.updates)

        if (updateKeys.length > 0 || result.removedKeys.length > 0 || result.errors.length > 0) {
            setDraft((current) => {
                if (!current) return current

                const values = { ...current.values, ...result.updates }
                const draftErrors = { ...current.errors }
                const touchedFields = new Set(current.touchedFields)

                for (const key of updateKeys) {
                    delete draftErrors[key]
                    touchedFields.add(key)
                }

                for (const key of result.removedKeys) {
                    delete values[key]
                    delete draftErrors[key]
                    touchedFields.delete(key)
                }

                for (const error of result.errors) {
                    if (error.key) draftErrors[error.key] = error.message
                }

                return {
                    ...current,
                    values,
                    errors: draftErrors,
                    warnings: result.warnings,
                    touchedFields: Array.from(touchedFields),
                    status: current.status === "saved" ? "editing" : current.status,
                }
            })
        }

        setMessages(result.messages)
        setWarnings(result.warnings)
        setErrors(result.errors.map((error) => (
            error.suggestion
                ? `${error.message} Did you mean: ${error.suggestion}?`
                : error.message
        )))

        if (updateKeys.length > 0 || result.removedKeys.length > 0) {
            setComposer("")
        }
    }

    function applyAttendancePreviewInput(input: string) {
        if (!schema || schema.type !== "attendance") return

        const result = parseQuickEntryBatchInput({ input, schema })
        const nextRows = result.rows.map(createPreviewRow)

        if (nextRows.length > 0) {
            setAttendanceRows((current) => (
                validateAttendancePreviewRows(schema, [...current, ...nextRows])
            ))
            setComposer("")
            setMessages([
                `${nextRows.length} attendance ${nextRows.length === 1 ? "record" : "records"} added to preview.`,
            ])
        } else {
            setMessages([])
        }

        setWarnings(result.warnings)
        setErrors(result.errors)
    }

    function removeAttendanceRowByNumber(argument: string) {
        if (!schema || schema.type !== "attendance") return

        const rowNumber = Number(argument.trim())

        if (!Number.isInteger(rowNumber) || rowNumber < 1) {
            setErrors(["Use /remove followed by a preview row number, for example /remove 2."])
            return
        }

        setAttendanceRows((current) => {
            if (rowNumber > current.length) {
                setErrors([`Preview row ${rowNumber} does not exist.`])
                return current
            }

            const next = current.filter((_, index) => index !== rowNumber - 1)
            setErrors([])
            setMessages([`Preview row ${rowNumber} removed.`])
            return validateAttendancePreviewRows(schema, next)
        })
        setComposer("")
    }

    function updateAttendanceCell(
        rowId: string,
        field: QuickEntryFieldDefinition,
        value: string | boolean
    ) {
        if (!schema || schema.type !== "attendance") return

        setAttendanceRows((current) => {
            const next = current.map((row) => {
                if (row.clientId !== rowId) return row

                const values = { ...row.values }
                const errors = getNonDuplicateErrors(row.errors)
                const displayValues = { ...row.displayValues }

                if (field.type === "boolean") {
                    values[field.key] = value === true
                    displayValues[field.key] = value === true ? "Yes" : "No"
                    delete errors[field.key]
                } else {
                    const rawValue = String(value)

                    if (!rawValue.trim()) {
                        delete values[field.key]
                        delete displayValues[field.key]
                        delete errors[field.key]
                    } else {
                        const parsed = parseQuickEntryValue(field, rawValue)

                        if (parsed.success) {
                            values[field.key] = parsed.value
                            displayValues[field.key] = parsed.displayValue
                                ?? formatQuickEntryValue(field, parsed.value)
                            delete errors[field.key]
                        } else {
                            values[field.key] = rawValue
                            errors[field.key] = parsed.error
                        }
                    }
                }

                return {
                    ...row,
                    values,
                    displayValues,
                    errors,
                }
            })

            return validateAttendancePreviewRows(schema, next)
        })
    }

    function removeAttendanceRow(rowId: string) {
        if (!schema || schema.type !== "attendance") return

        setAttendanceRows((current) => (
            validateAttendancePreviewRows(
                schema,
                current.filter((row) => row.clientId !== rowId)
            )
        ))
    }

    function prepareReview() {
        if (!schema || !draft) return

        const nextErrors = validateReportDraft(draft, schema)

        if (Object.keys(nextErrors).length > 0) {
            setDraft((current) => current ? { ...current, errors: nextErrors, status: "editing" } : current)
            setErrors(Object.values(nextErrors))
            setMessages([])
            return
        }

        setDraft({ ...draft, errors: {}, status: "reviewing" })
        setErrors([])
        setMessages(["Review the final values before saving."])
    }

    async function handleSave() {
        if (!schema || !draft || !schema.backend) return

        const nextErrors = validateReportDraft(draft, schema)

        if (Object.keys(nextErrors).length > 0) {
            setDraft({ ...draft, errors: nextErrors, status: "editing" })
            setErrors(Object.values(nextErrors))
            return
        }

        if (draft.status !== "reviewing") {
            prepareReview()
            return
        }

        setSaving(true)
        setDraft({ ...draft, status: "saving" })

        try {
            const response = await fetch(schema.backend.endpoint, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(serializeQuickEntryBackendPayload(draft, schema)),
            })

            if (!response.ok) {
                throw new Error(await getResponseError(response))
            }

            if (sectionStatusId && schema.backend.sectionId === currentSectionId) {
                const sectionResponse = await fetch(apiRoutes.reports.sections.submit(sectionStatusId), {
                    method: "POST",
                    credentials: "include",
                })

                if (!sectionResponse.ok) {
                    throw new Error(await getResponseError(sectionResponse))
                }
            }

            await queryClient.invalidateQueries({ queryKey: ["reports"] })
            setDraft({ ...draft, status: "saved" })
            setMessages([`${schema.label} report saved successfully.`])
            setWarnings([])
            setErrors([])
            toast.success(`${schema.label} report saved`)
        } catch (error) {
            const message = error instanceof Error ? error.message : "Could not save report."
            setDraft({ ...draft, status: "error" })
            setErrors([message])
            toast.error(message)
        } finally {
            setSaving(false)
        }
    }

    async function handleAttendanceSave() {
        if (!schema || schema.type !== "attendance" || !schema.backend) return

        const validatedRows = validateAttendancePreviewRows(schema, attendanceRows)
        const hasErrors = validatedRows.some((row) => Object.keys(row.errors).length > 0)

        setAttendanceRows(validatedRows)

        if (validatedRows.length === 0) {
            setErrors(["Add at least one attendance record to the preview before saving."])
            return
        }

        if (hasErrors) {
            setErrors(["Nothing was saved. Fix the highlighted records and try again."])
            return
        }

        setSaving(true)
        setMessages([`Saving ${validatedRows.length} attendance ${validatedRows.length === 1 ? "record" : "records"}...`])
        setErrors([])

        try {
            const idempotencyKey = typeof crypto !== "undefined" && "randomUUID" in crypto
                ? crypto.randomUUID()
                : `${Date.now()}-${Math.random().toString(36).slice(2)}`
            const response = await fetch(schema.backend.endpoint, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    records: getSerializableAttendanceRecords(schema, validatedRows),
                    idempotency_key: idempotencyKey,
                }),
            })

            if (!response.ok) {
                let body: ApiErrorBody | null = null

                try {
                    body = await response.json() as ApiErrorBody
                } catch {
                    body = null
                }

                if (body?.errors?.length) {
                    setAttendanceRows((current) => {
                        const next = current.map((row) => ({ ...row }))

                        for (const rowError of body.errors ?? []) {
                            const target = next[rowError.index]
                            if (!target) continue

                            const backendErrors = flattenBackendError(rowError.errors)
                            target.errors = {
                                ...target.errors,
                                ...backendErrors,
                            }
                            target.state = "needs_attention"
                        }

                        return next
                    })
                }

                throw new Error(
                    body?.detail
                    ?? body?.message
                    ?? body?.error
                    ?? "Nothing was saved. Fix the highlighted records and try again."
                )
            }

            const result = await response.json() as AttendanceBulkCreateResponse

            await Promise.all([
                queryClient.invalidateQueries({ queryKey: ["reports"] }),
                queryClient.invalidateQueries({ queryKey: ["reportAttendance"] }),
                queryClient.invalidateQueries({ queryKey: ["attendance"] }),
                queryClient.invalidateQueries({ queryKey: ["attendanceAnalytics"] }),
            ])

            const count = result.count || validatedRows.length
            const message = `${count} attendance ${count === 1 ? "record" : "records"} saved successfully.`

            setAttendanceRows([])
            setSavedMessage(message)
            setDraft((current) => current ? { ...current, status: "saved" } : current)
            setMessages([message])
            setWarnings([])
            setErrors([])
            setComposer("")
            toast.success(message)
        } catch (error) {
            const message = error instanceof Error
                ? error.message
                : "Nothing was saved. Fix the highlighted records and try again."
            setErrors([message])
            toast.error(message)
        } finally {
            setSaving(false)
        }
    }

    function requestAttendanceSave() {
        if (!schema || schema.type !== "attendance") return

        const validatedRows = validateAttendancePreviewRows(schema, attendanceRows)
        const hasErrors = validatedRows.some((row) => Object.keys(row.errors).length > 0)

        setAttendanceRows(validatedRows)

        if (validatedRows.length === 0) {
            setErrors(["Add at least one attendance record to the preview before saving."])
            return
        }

        if (hasErrors) {
            setErrors(["Nothing was saved. Fix the highlighted records and try again."])
            return
        }

        setErrors([])
        setAttendanceConfirmOpen(true)
    }

    function handleCommandSubmit(command: string) {
        const createResult = parseCreateReportCommand(command)

        if (createResult.success) {
            startDraft(createResult.schema.type)
            return
        }

        setErrors([
            createResult.suggestion
                ? `${createResult.error}. Did you mean: ${createResult.suggestion}?`
                : `${createResult.error} Available: ${createResult.validTypes.join(", ")}.`,
        ])
    }

    function handleSubmit() {
        const input = composer.trim()
        if (!input || saving) return

        if (input.startsWith("/create")) {
            handleCommandSubmit(input)
            setComposer("")
            return
        }

        if (!schema || !draft) {
            if (input === "/help" || input === "/") {
                setErrors([`Start with ${suggestedSchema ? `/create ${suggestedSchema.type}` : "/create attendance"} or choose a quick action.`])
            } else {
                setErrors(["Choose a report type before entering values."])
            }
            focusComposerSoon()
            return
        }

        if (schema.type === "attendance") {
            const commandMatch = input.match(/^\/([a-z]+)(?:\s+(.+))?$/i)

            if (commandMatch) {
                const [, commandName, commandArgument = ""] = commandMatch
                const command = commandName.toLowerCase()

                if (command === "remove") {
                    removeAttendanceRowByNumber(commandArgument)
                    focusComposerSoon()
                    return
                }

                if (command === "save") {
                    setComposer("")
                    requestAttendanceSave()
                    return
                }

                if (command === "cancel") {
                    setComposer("")
                    if (hasWorkbenchValues(draft, attendanceRows)) {
                        setDiscardOpen(true)
                    } else {
                        resetWorkbench()
                    }
                    return
                }

                if (command === "help") {
                    setComposer("")
                    setHelpOpen(true)
                    return
                }

                setErrors([`Unknown command: /${commandName}.`])
                return
            }

            applyAttendancePreviewInput(input)
            focusComposerSoon()
            return
        }

        const result = parseQuickEntryInput({
            input,
            schema,
            currentValues: draft.values,
        })

        if (result.command?.name === "review") {
            setComposer("")
            prepareReview()
            return
        }

        if (result.command?.name === "save") {
            setComposer("")
            void handleSave()
            return
        }

        if (result.command?.name === "cancel") {
            setComposer("")
            if (hasDraftValues(draft)) {
                setDiscardOpen(true)
            } else {
                resetWorkbench()
            }
            return
        }

        if (result.command?.name === "help") {
            setComposer("")
            setHelpOpen(true)
            return
        }

        applyParsedResult(result)
        focusComposerSoon()
    }

    function handleComposerKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
        if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
            event.preventDefault()
            handleSubmit()
            return
        }

        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault()
            handleSubmit()
        }
    }

    const activeDraft = schema && draft
    const isAttendanceWorkbench = schema?.type === "attendance"
    const isReviewing = !isAttendanceWorkbench && (draft?.status === "reviewing" || draft?.status === "saving")
    const isSaved = draft?.status === "saved"
    const canSubmit = composer.trim().length > 0 && !saving

    return (
        <div className="flex h-full min-h-0 overflow-hidden">
            <section className="flex min-h-0 w-full flex-col overflow-hidden rounded-2xl border border-border-subtle bg-background">
                <header className="flex shrink-0 items-center justify-between p-4">
                    <h5 className="text-base font-medium text-foreground">
                        New workbench
                    </h5>
                    {onClose ? (
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="size-8 rounded-full"
                            aria-label="Close Workbench"
                            onClick={onClose}
                        >
                            <XIcon className="size-5" />
                        </Button>
                    ) : (
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="size-8 rounded-full"
                            aria-label="Close Workbench"
                            asChild
                        >
                            <Link href={closeHref}>
                                <XIcon className="size-5" />
                            </Link>
                        </Button>
                    )}
                </header>

                <main className="min-h-0 flex-1 overflow-y-auto px-4 pb-4">
                    {!activeDraft ? (
                        <WorkbenchWelcome firstName={firstName} onCreate={startDraft} />
                    ) : isSaved ? (
                        <div className="flex min-h-80 flex-col items-center justify-center text-center">
                            <CheckCircle2Icon className="size-12 text-emerald-600" />
                            <h2 className="mt-4 text-xl font-semibold text-foreground">
                                {savedMessage || `${schema.label} report saved successfully.`}
                            </h2>
                            <div className="mt-6 flex flex-wrap justify-center gap-3">
                                <Button type="button" onClick={() => startDraft(schema.type)}>
                                    <PlusIcon className="size-4" />
                                    {schema.type === "attendance" ? "Start new entry" : "Create another report"}
                                </Button>
                                <Button type="button" variant="outline" asChild>
                                    <Link href={schema.type === "attendance" ? "/reports/ministry/attendance" : "/reports"}>
                                        View report
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    ) : isReviewing ? (
                        <WorkbenchReview
                            schema={schema}
                            draft={draft}
                            assemblyLabel={assemblyLabel}
                            periodLabel={periodLabel}
                            saving={saving}
                            onEdit={() => setDraft((current) => current ? { ...current, status: "editing" } : current)}
                            onSave={() => void handleSave()}
                        />
                    ) : (
                        <div className="grid gap-5 pb-6">
                            <section className="mx-auto w-full max-w-5xl px-2">
                                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                    <div>
                                        <div className="flex flex-wrap items-center gap-2">
                                            <Badge>{schema.label} {schema.type === "member" ? "draft" : "report"}</Badge>
                                            <span className="text-sm text-muted-foreground">
                                                {getContextLine(schema, draft, assemblyLabel, periodLabel)}
                                            </span>
                                        </div>
                                        <p className="mt-2 text-sm text-muted-foreground">
                                            {isAttendanceWorkbench
                                                ? "Add one or more key=value records to the preview, then save explicitly."
                                                : "Make corrections by typing another key=value assignment or use /remove."}
                                        </p>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button type="button" variant="outline" size="sm" onClick={() => setHelpOpen(true)}>
                                            <HelpCircleIcon className="size-4" />
                                            Help
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => {
                                                if (hasWorkbenchValues(draft, attendanceRows)) setDiscardOpen(true)
                                                else resetWorkbench()
                                            }}
                                        >
                                            <RotateCcwIcon className="size-4" />
                                            Cancel
                                        </Button>
                                    </div>
                                </div>
                            </section>

                            {helpOpen ? (
                                <WorkbenchHelp schema={schema} onClose={() => setHelpOpen(false)} />
                            ) : null}

                            {isAttendanceWorkbench ? (
                                <WorkbenchAttendanceBatchPreview
                                    schema={schema}
                                    rows={attendanceRows}
                                    saving={saving}
                                    onEditCell={updateAttendanceCell}
                                    onRemoveRow={removeAttendanceRow}
                                    onSave={requestAttendanceSave}
                                />
                            ) : (
                                <WorkbenchPreview
                                    schema={schema}
                                    draft={draft}
                                    assemblyLabel={assemblyLabel}
                                    periodLabel={periodLabel}
                                    onReview={prepareReview}
                                />
                            )}
                        </div>
                    )}
                </main>

                <footer className="shrink-0 px-2 pb-2">
                    <div className="mx-auto grid max-w-6xl gap-2">
                        {shouldShowDateHint(composer) ? (
                            <p className="px-4 text-sm text-muted-foreground">
                                Date examples: date=20-06-26, date=20/06/2026, date=2026-06-20
                            </p>
                        ) : null}

                        <WorkbenchStatus messages={messages} warnings={warnings} errors={errors} />

                        <div className={cn(
                            "flex flex-col items-end gap-3 rounded-2xl border bg-surface px-0.5 pb-2 transition-colors",
                            composer.trim()
                                ? "border-2 border-primary"
                                : "border-border-subtle"
                        )}>
                            <Textarea
                                ref={textareaRef}
                                value={composer}
                                rows={2}
                                disabled={saving}
                                placeholder={getPlaceholder(schema)}
                                aria-label="Workbench command or quick entry"
                                className="w-full max-h-60 min-h-16 flex-1 resize-none border-0 bg-transparent p-3 font-medium shadow-none focus-visible:ring-0 outline-none overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent"
                                onChange={(event) => setComposer(event.target.value)}
                                onKeyDown={handleComposerKeyDown}
                            />

                            <div className="px-1.5 flex h-fit w-full items-center justify-between">
                                <WorkbenchUploadMenu sectionId={currentSectionId} />

                                <div className="flex items-center gap-2">
                                    {isAttendanceWorkbench ? (
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            disabled={!canSubmit}
                                            onClick={handleSubmit}
                                        >
                                            Add to preview
                                        </Button>
                                    ) : null}

                                    <Button
                                        type="button"
                                        size="icon"
                                        className="size-8 rounded-full"
                                        disabled={!canSubmit}
                                        aria-label={isAttendanceWorkbench ? "Add attendance to preview" : "Submit Workbench entry"}
                                        onClick={handleSubmit}
                                    >
                                        {saving ? (
                                            <Loader2Icon className="size-5 animate-spin" />
                                        ) : (
                                            <ArrowUpIcon className="size-5" />
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </footer>
            </section>

            <AlertDialog open={discardOpen} onOpenChange={setDiscardOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Discard this unfinished report?</AlertDialogTitle>
                        <AlertDialogDescription>
                            The current Workbench draft will be cleared.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Keep editing</AlertDialogCancel>
                        <AlertDialogAction onClick={resetWorkbench}>
                            Discard draft
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <AlertDialog open={attendanceConfirmOpen} onOpenChange={setAttendanceConfirmOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Save {attendanceRows.length} attendance {attendanceRows.length === 1 ? "record" : "records"}?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            The preview will be saved as one atomic batch. If any record fails server validation, none will be created.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={saving}>Keep editing</AlertDialogCancel>
                        <AlertDialogAction
                            disabled={saving}
                            onClick={() => {
                                setAttendanceConfirmOpen(false)
                                void handleAttendanceSave()
                            }}
                        >
                            Save {attendanceRows.length} attendance {attendanceRows.length === 1 ? "record" : "records"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
