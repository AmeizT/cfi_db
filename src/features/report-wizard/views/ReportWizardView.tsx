"use client"

import * as React from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import {
    CheckIcon,
    CircleIcon,
    FileSpreadsheetIcon,
    ImageIcon,
    Loader2Icon,
    SkipForwardIcon,
} from "lucide-react"
import { toast } from "sonner"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
    NativeSelect,
    NativeSelectOption,
} from "@/components/ui/native-select"
import { Textarea } from "@/components/ui/textarea"
import { apiRoutes } from "@/config/urls"
import { UploadEngine } from "@/features/uploads/components/UploadEngine"
import AttendanceFormView from "@/features/reports/core/forms/attendance/views/AttendanceFormView"
import { useReports } from "@/features/reports/core/hooks/use-reports"
import {
    REPORT_WIZARD_SECTIONS as WIZARD_SECTIONS,
    createReportWizardHref as createWizardHref,
    getReportWizardResumeSection as getResumeSection,
    getReportWizardSectionByBackend as getSectionByBackend,
    getReportWizardSectionByRoute as getSectionByRoute,
    getReportWizardSections as getReportSections,
    getReportWizardTitle as getReportTitle,
    isPartialReportWizardReport as isPartialReport,
    toReportWizardList as toReportList,
    type ReportWizardMethod as WizardMethod,
    type ReportWizardReport as WizardReport,
    type ReportWizardSection as WizardSection,
    type ReportWizardSectionStatus as SectionStatus,
    type ReportWizardUploadType as UploadType,
} from "@/features/report-wizard/config/report-types"
import { cn } from "@/lib/utils"

const SKIP_REASONS = [
    { value: "no_data", label: "No data available" },
    { value: "not_collected", label: "Statistics were not collected" },
    { value: "not_applicable", label: "Not applicable" },
    { value: "technical_issue", label: "Technical issue" },
    { value: "other", label: "Other" },
]

function normalizeMethod(value: string | null): WizardMethod {
    if (value === "upload") return "upload"
    if (value === "web-form") return "web-form"
    if (value === "quick-entry") return "quick-entry"
    return "manual-entry"
}

function normalizeUploadType(value: string | null): UploadType {
    if (value === "csv") return "csv"
    if (value === "ocr") return "ocr"
    if (value === "photo") return "photo"
    return "excel"
}

function statusIcon(status: SectionStatus) {
    if (status === "submitted") {
        return <CheckIcon className="size-3 text-emerald-700" />
    }

    if (status === "skipped") {
        return <SkipForwardIcon className="size-3 text-amber-700" />
    }

    return <CircleIcon className="size-3 text-muted-foreground" />
}

function statusText(status: SectionStatus) {
    if (status === "submitted") return "done"
    if (status === "skipped") return "skipped"
    return "pending"
}

function StepRail({
    current,
    report,
}: {
    current: WizardSection
    report: WizardReport | null
}) {
    const sections = report ? getReportSections(report) : []

    return (
        <div className="flex min-w-0 items-center gap-2 overflow-x-auto pb-1">
            {WIZARD_SECTIONS.map((section, index) => {
                const snapshot = sections.find((item) => item.name === section.backendId)
                const active = section.id === current.id
                const completed = snapshot?.status === "submitted"
                const skipped = snapshot?.status === "skipped"

                return (
                    <React.Fragment key={section.id}>
                        <Link
                            href={createWizardHref(section.id, {
                                method: "manual-entry",
                                report_id: report?.id,
                            })}
                            className="flex shrink-0 items-center gap-2 rounded-md px-1 py-1 outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                            <span
                                className={cn(
                                    "flex size-6 items-center justify-center rounded-full border text-xs font-semibold",
                                    active && "border-primary bg-primary text-primary-foreground",
                                    completed && !active && "border-emerald-700 bg-emerald-700 text-white",
                                    skipped && !active && "border-amber-600 bg-amber-100 text-amber-800",
                                    !active && !completed && !skipped && "border-border text-muted-foreground"
                                )}
                            >
                                {completed ? <CheckIcon className="size-3.5" /> : index + 1}
                            </span>
                            <span
                                className={cn(
                                    "text-sm",
                                    active ? "font-semibold text-foreground" : "text-muted-foreground"
                                )}
                            >
                                {section.label}
                            </span>
                        </Link>

                        {index < WIZARD_SECTIONS.length - 1 ? (
                            <span className="h-px w-8 shrink-0 bg-border" />
                        ) : null}
                    </React.Fragment>
                )
            })}
        </div>
    )
}

function PartialReportsSidebar({
    reports,
    activeReportId,
}: {
    reports: WizardReport[]
    activeReportId: string | null
}) {
    const partialReports = reports.filter(isPartialReport).slice(0, 6)

    return (
        <aside className="w-full shrink-0 p-4 lg:w-72 h-auto flex flex-col order-2 lg:border-b-0 lg:border-l overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
            <p className="text-xs font-semibold uppercase text-muted-foreground">
                In progress
            </p>

            <div className="mt-3 grid gap-2">
                {partialReports.length === 0 ? (
                    <p className="rounded-lg border border-dashed border-border p-3 text-sm text-muted-foreground">
                        No partial reports.
                    </p>
                ) : partialReports.map((report) => {
                    const active = String(report.id) === activeReportId
                    const resumeSection = getResumeSection(report)

                    return (
                        <Link
                            key={report.id}
                            href={createWizardHref(resumeSection, {
                                method: "manual-entry",
                                report_id: report.id,
                            })}
                            className={cn(
                                "rounded-lg border bg-background p-3 outline-none transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring",
                                active && "border-primary"
                            )}
                        >
                            <p className="truncate text-sm font-semibold text-foreground">
                                {getReportTitle(report)}
                            </p>

                            <div className="mt-2 grid gap-1.5">
                                {getReportSections(report).slice(0, 5).map((section) => {
                                    const sectionMeta = getSectionByBackend(section.name)

                                    return (
                                        <div
                                            key={`${report.id}-${section.name}`}
                                            className="flex items-center gap-2 text-xs"
                                        >
                                            {statusIcon(section.status)}
                                            <span
                                                className={cn(
                                                    "truncate",
                                                    section.status === "pending"
                                                        ? "text-muted-foreground"
                                                        : "text-foreground"
                                                )}
                                            >
                                                {sectionMeta.label}
                                                {section.status !== "pending" ? ` - ${statusText(section.status)}` : ""}
                                            </span>
                                        </div>
                                    )
                                })}
                            </div>
                        </Link>
                    )
                })}
            </div>
        </aside>
    )
}

function MethodTabs({
    section,
    method,
    uploadType,
    reportId,
}: {
    section: WizardSection
    method: WizardMethod
    uploadType: UploadType
    reportId: string | null
}) {
    const manualActive = method === "manual-entry" || method === "web-form" || method === "quick-entry"
    const uploadActive = method === "upload"

    return (
        <div className="flex flex-col gap-3 border-b border-border">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex gap-1">
                    <Link
                        href={createWizardHref(section.id, {
                            method: method === "quick-entry" ? "quick-entry" : "manual-entry",
                            report_id: reportId,
                        })}
                        className={cn(
                            "border-b-2 px-3 py-2 text-sm font-semibold",
                            manualActive
                                ? "border-primary text-primary"
                                : "border-transparent text-muted-foreground hover:text-foreground"
                        )}
                    >
                        Manual entry
                    </Link>
                    <Link
                        href={createWizardHref(section.id, {
                            method: "upload",
                            upload_type: uploadType,
                            report_id: reportId,
                        })}
                        className={cn(
                            "border-b-2 px-3 py-2 text-sm font-semibold",
                            uploadActive
                                ? "border-primary text-primary"
                                : "border-transparent text-muted-foreground hover:text-foreground"
                        )}
                    >
                        Upload file
                    </Link>
                </div>
            </div>

            {manualActive ? (
                <div className="flex flex-wrap gap-1 pb-2">
                    <Link
                        href={createWizardHref(section.id, {
                            method: "quick-entry",
                            report_id: reportId,
                        })}
                        className={cn(
                            "inline-flex h-8 items-center gap-1.5 rounded-md border px-2.5 text-xs font-semibold",
                            method === "quick-entry"
                                ? "border-primary bg-primary text-primary-foreground"
                                : "border-border text-muted-foreground hover:bg-accent hover:text-foreground"
                        )}
                    >
                        Quick Entry
                    </Link>
                    <Link
                        href={createWizardHref(section.id, {
                            method: "manual-entry",
                            report_id: reportId,
                        })}
                        className={cn(
                            "inline-flex h-8 items-center gap-1.5 rounded-md border px-2.5 text-xs font-semibold",
                            method !== "quick-entry"
                                ? "border-primary bg-primary text-primary-foreground"
                                : "border-border text-muted-foreground hover:bg-accent hover:text-foreground"
                        )}
                    >
                        Guided Form
                    </Link>
                </div>
            ) : null}

            {uploadActive ? (
                <div className="flex flex-wrap gap-1 pb-2">
                    {([
                        ["excel", "Excel", FileSpreadsheetIcon],
                        ["csv", "CSV", FileSpreadsheetIcon],
                        ["ocr", "OCR", ImageIcon],
                        ["photo", "Photo", ImageIcon],
                    ] as const).map(([value, label, Icon]) => (
                        <Link
                            key={value}
                            href={createWizardHref(section.id, {
                                method: "upload",
                                upload_type: value,
                                report_id: reportId,
                            })}
                            className={cn(
                                "inline-flex h-8 items-center gap-1.5 rounded-md border px-2.5 text-xs font-semibold",
                                uploadType === value
                                    ? "border-primary bg-primary text-primary-foreground"
                                    : "border-border text-muted-foreground hover:bg-accent hover:text-foreground"
                            )}
                        >
                            <Icon className="size-3.5" />
                            {label}
                        </Link>
                    ))}
                </div>
            ) : null}
        </div>
    )
}

function ManualEntryPanel({
    section,
}: {
    section: WizardSection
}) {
    if (section.id === "attendance") {
        return <AttendanceFormView />
    }

    return (
        <div className="rounded-lg border border-border bg-muted/30 p-4">
            <div className="grid gap-4 md:grid-cols-2">
                <label className="grid gap-2 text-sm font-medium text-foreground">
                    Amount
                    <input
                        className="h-10 rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        placeholder="0.00"
                    />
                </label>
                <label className="grid gap-2 text-sm font-medium text-foreground">
                    Notes
                    <input
                        className="h-10 rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />
                </label>
            </div>
        </div>
    )
}

function UploadPanel({
    section,
    uploadType,
}: {
    section: WizardSection
    uploadType: UploadType
}) {
    const initialMode = uploadType === "ocr" || uploadType === "photo"
        ? "image"
        : "spreadsheet"

    if (!section.uploadUrl) {
        return (
            <Alert>
                <AlertTitle>Upload unavailable</AlertTitle>
                <AlertDescription>
                    This section does not have an upload endpoint yet.
                </AlertDescription>
            </Alert>
        )
    }

    return (
        <UploadEngine
            initialMode={initialMode}
            config={{
                type: section.uploadType ?? section.id,
                uploadUrl: section.uploadUrl,
                imageUploadUrl: section.imageUploadUrl,
                templateUrl: section.templateUrl,
                columns: [],
            }}
        />
    )
}

function SkipSectionDialog({
    open,
    section,
    sectionStatusId,
    onOpenChange,
}: {
    open: boolean
    section: WizardSection
    sectionStatusId?: number
    onOpenChange: (open: boolean) => void
}) {
    const queryClient = useQueryClient()
    const [reason, setReason] = React.useState(SKIP_REASONS[0].value)
    const [notes, setNotes] = React.useState("")

    const skipMutation = useMutation({
        mutationFn: async () => {
            if (!sectionStatusId) {
                throw new Error("This section is not attached to a report yet.")
            }

            const response = await fetch(apiRoutes.reports.sections.skip(sectionStatusId), {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ reason, notes: notes.trim() }),
            })

            if (!response.ok) {
                throw new Error("Could not skip this section.")
            }
        },
        onSuccess: async () => {
            toast.success(`${section.label} skipped`)
            onOpenChange(false)
            await queryClient.invalidateQueries({ queryKey: ["reports"] })
        },
        onError: (error) => {
            toast.error(error instanceof Error ? error.message : "Could not skip this section.")
        },
    })

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()

        if (!notes.trim()) {
            toast.error("Enter a reason note before skipping this section.")
            return
        }

        skipMutation.mutate()
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Skip {section.label}</DialogTitle>
                    <DialogDescription>
                        A skipped section remains part of the report and is visible in compliance review.
                    </DialogDescription>
                </DialogHeader>

                <form className="grid gap-4" onSubmit={handleSubmit}>
                    <div className="grid gap-2">
                        <Label>Reason</Label>
                        <NativeSelect
                            className="min-w-full"
                            value={reason}
                            onChange={(event) => setReason(event.target.value)}
                        >
                            {SKIP_REASONS.map((item) => (
                                <NativeSelectOption key={item.value} value={item.value}>
                                    {item.label}
                                </NativeSelectOption>
                            ))}
                        </NativeSelect>
                    </div>

                    <div className="grid gap-2">
                        <Label>Notes</Label>
                        <Textarea
                            required
                            value={notes}
                            onChange={(event) => setNotes(event.target.value)}
                        />
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={skipMutation.isPending}>
                            {skipMutation.isPending ? (
                                <Loader2Icon className="size-4 animate-spin" />
                            ) : (
                                <SkipForwardIcon className="size-4" />
                            )}
                            Skip section
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export function ReportWizardView({ section: sectionParam }: { section: string }) {
    const searchParams = useSearchParams()
    const [skipOpen, setSkipOpen] = React.useState(false)
    const section = getSectionByRoute(sectionParam)
    const method = normalizeMethod(searchParams.get("method"))
    const uploadType = normalizeUploadType(searchParams.get("upload_type"))
    const reportId = searchParams.get("report_id")
    const year = String(new Date().getFullYear())
    const reportsQuery = useReports({ year })
    const reports = React.useMemo(
        () => toReportList(reportsQuery.data),
        [reportsQuery.data]
    )
    const activeReport = React.useMemo(() => {
        if (reportId) {
            return reports.find((report) => String(report.id) === reportId) ?? null
        }

        return reports.find(isPartialReport) ?? null
    }, [reportId, reports])
    const activeSectionStatus = activeReport
        ? getReportSections(activeReport).find((item) => item.name === section.backendId)
        : undefined
    const activeReportLabel = activeReport
        ? getReportTitle(activeReport)
        : "New report"
    const sectionIndex = WIZARD_SECTIONS.findIndex((item) => item.id === section.id)
    const nextSection = WIZARD_SECTIONS[Math.min(sectionIndex + 1, WIZARD_SECTIONS.length - 1)]
    const backSection = WIZARD_SECTIONS[Math.max(sectionIndex - 1, 0)]

    return (
        <div className="flex flex-col h-full min-h-0 overflow-hidden">
            <header className="shrink-0 border-b border-border px-5 py-4">
                <div className="flex flex-col gap-1">
                    <h1 className="text-xl font-semibold text-foreground">
                        Report Wizard
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        {activeReportLabel}
                    </p>
                </div>

                <div className="mt-5">
                    <StepRail current={section} report={activeReport} />
                </div>
            </header>

            <div className="flex min-w-0 flex-1 flex-col lg:flex-row">
                <PartialReportsSidebar
                    reports={reports}
                    activeReportId={reportId}
                />

                <main className="flex min-w-0 flex-1 flex-col order-1">
                    

                    <div className="min-h-0 flex-1 overflow-y-auto p-5">
                        <div className="mx-auto flex max-w-5xl flex-col gap-5">
                            <MethodTabs
                                section={section}
                                method={method}
                                uploadType={uploadType}
                                reportId={reportId}
                            />

                            {method === "upload" ? (
                                <UploadPanel section={section} uploadType={uploadType} />
                            ) : (
                                <ManualEntryPanel
                                    section={section}
                                />
                            )}
                        </div>
                    </div>

                    <footer className="shrink-0 border-t border-border px-5 py-4">
                        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3">
                            <Button
                                type="button"
                                variant="outline"
                                disabled={!activeSectionStatus?.id}
                                onClick={() => setSkipOpen(true)}
                                className="text-amber-700"
                            >
                                <SkipForwardIcon className="size-4" />
                                Skip this section
                            </Button>

                            <div className="flex items-center gap-2">
                                <Button variant="outline" asChild>
                                    <Link
                                        href={createWizardHref(backSection.id, {
                                            method,
                                            upload_type: method === "upload" ? uploadType : null,
                                            report_id: reportId,
                                        })}
                                    >
                                        Back
                                    </Link>
                                </Button>
                                <Button asChild>
                                    <Link
                                        href={createWizardHref(nextSection.id, {
                                            method,
                                            upload_type: method === "upload" ? uploadType : null,
                                            report_id: reportId,
                                        })}
                                    >
                                        Next: {nextSection.label}
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </footer>
                </main>
            </div>

            <SkipSectionDialog
                key={skipOpen ? "skip-open" : "skip-closed"}
                open={skipOpen}
                section={section}
                sectionStatusId={activeSectionStatus?.id}
                onOpenChange={setSkipOpen}
            />
        </div>
    )
}
