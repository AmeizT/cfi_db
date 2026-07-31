"use client"

import * as React from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import {
    CheckIcon,
    ChevronRight,
    CircleIcon,
    FileSpreadsheetIcon,
    ImageIcon,
    Loader2Icon,
    SkipForward,
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
import { FinancialEntriesForm } from "@/features/manual-entry/components/FinancialEntriesForm"
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
import ReportWizardStepper from "./ReportCreateStepper"
import View from "@/components/ui/view"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

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

    return <CircleIcon className="size-3 text-border fill-background" />
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
    return (
        <div className="flex min-w-0 items-center gap-2 overflow-x-auto pb-1">
            <ReportWizardStepper
                steps={WIZARD_SECTIONS}
                current={current}
                sections={report ? getReportSections(report) : []}
                report={report}
            />

            {/* {WIZARD_SECTIONS.map((section, index) => {
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
            })} */}
        </div>
    )
}



import { useCallback, useEffect, useRef, useState } from "react"

// Adjust these to your actual status values / design tokens if they differ.
// Assumed values, based on this conversation: "pending" | "in_progress" | "completed" | "skipped"
const SECTION_BAR_COLOR: Record<string, string> = {
    completed: "bg-emerald-500",
    in_progress: "bg-primary",
    skipped: "bg-amber-600",
    pending: "bg-zinc-200",
}

function getSectionSummary(sections: { status: string }[]) {
    const total = sections.length
    const completed = sections.filter((s) => s.status === "completed").length
    const skipped = sections.filter((s) => s.status === "skipped").length
    const base = `${completed} of ${total} complete`
    return skipped > 0 ? `${base} · ${skipped} skipped` : base
}

function PartialReportsSidebar({
    reports,
    activeReportId,
}: {
    reports: WizardReport[]
    activeReportId: string | null
    current: WizardSection
    report: WizardReport | null
}) {
    const partialReports = reports.filter(isPartialReport)

    // --- scroll-fade / "scroll for more" hint for the capped list ---
    const scrollRef = useRef<HTMLDivElement>(null)
    const [showFade, setShowFade] = useState(false)

    const updateFade = useCallback(() => {
        const el = scrollRef.current
        if (!el) return
        const remaining = el.scrollHeight - el.scrollTop - el.clientHeight
        setShowFade(remaining > 4)
    }, [])

    useEffect(() => {
        updateFade()
        window.addEventListener("resize", updateFade)
        return () => window.removeEventListener("resize", updateFade)
        // re-check whenever the list itself changes length
    }, [updateFade, partialReports.length])

    return (
        <aside
            className="
                order-2 flex w-full shrink-0 flex-col py-0 pr-4
                h-130
                lg:sticky lg:top-4 lg:h-[72dvh] lg:w-92
                lg:self-start
            "
        >
            <div className={cn(
                "mt-0 flex min-h-0 w-full flex-1 flex-col",
                "overflow-hidden rounded-2xl border border-black/6 hover:border-border-subtle",
                "bg-background shadow-elevation-01",
                "dark:border-white/15",
                "dark:ring-1 dark:ring-white/10",
                "dark:shadow-[inset_0_1px_0_rgb(255_255_255/0.12),0_0_16px_var(--glass-glow),0_8px_24px_rgb(0_0_0/0.35)]"
            )}>
                <div className="shrink-0 px-5">
                    <div className="py-4 border-b border-border-subtle">
                        <p className="text-sm font-semibold text-muted-foreground">
                            Progress
                        </p>
                    </div>
                </div>

                {/* wrapper is the flex-1 box that actually gets the fixed height;
                   the scroll div fills it and the fade sits on top, absolutely positioned */}
                <div className="relative min-h-0 flex-1">
                    <div
                        ref={scrollRef}
                        onScroll={updateFade}
                        className="
                            h-full overflow-y-auto px-5 py-4
                            scrollbar-thin scrollbar-track-transparent
                            scrollbar-thumb-zinc-200/80
                        "
                    >
                        {partialReports.length === 0 ? (
                            <p className="rounded-lg border border-dashed border-border p-3 text-sm text-muted-foreground">
                                No partial reports.
                            </p>
                        ) : (
                            <Accordion
                                type="single"
                                collapsible
                                defaultValue={
                                    activeReportId
                                        ? `report-${activeReportId}`
                                        : undefined
                                }
                                onValueChange={() => {
                                    // expanding/collapsing a card changes scrollHeight
                                    updateFade()
                                    setTimeout(updateFade, 250) // after the open/close animation
                                }}
                                className="grid gap-3"
                            >
                                {partialReports.map((report) => {
                                    const reportId = String(report.id)
                                    const active = reportId === activeReportId
                                    const resumeSection =
                                        getResumeSection(report)
                                    const sections = getReportSections(
                                        report
                                    ).slice(0, 5)

                                    return (
                                        <AccordionItem
                                            key={report.id}
                                            value={`report-${reportId}`}
                                            className={cn(
                                                "rounded-2xl border border-border-subtle bg-background px-3",
                                                active && "border-[1.5px] border-primary"
                                            )}
                                        >
                                            <AccordionTrigger className="items-start py-3 text-left hover:no-underline">
                                                <div className="flex w-full flex-col gap-2">
                                                    <span className="block text-sm font-semibold">
                                                        {getReportTitle(
                                                            report
                                                        )}
                                                    </span>

                                                    <div className="flex items-center gap-1">
                                                        {sections.map(
                                                            (section, i) => (
                                                                <span
                                                                    key={`${report.id}-bar-${i}`}
                                                                    className={cn(
                                                                        "h-1.5 flex-1 rounded-full",
                                                                        SECTION_BAR_COLOR[
                                                                            section
                                                                                .status
                                                                        ] ??
                                                                            "bg-zinc-200"
                                                                    )}
                                                                />
                                                            )
                                                        )}
                                                    </div>

                                                    <span className="block text-xs font-normal text-muted-foreground">
                                                        {getSectionSummary(
                                                            sections
                                                        )}
                                                    </span>
                                                </div>
                                            </AccordionTrigger>

                                            <AccordionContent className="pb-3">
                                                <Link
                                                    href={createWizardHref(
                                                        resumeSection,
                                                        {
                                                            method: "manual-entry",
                                                            report_id:
                                                                report.id,
                                                        }
                                                    )}
                                                    className="
                                                        block rounded-xl p-2 outline-none
                                                        transition-colors hover:bg-surface
                                                        focus-visible:ring-2 focus-visible:ring-ring
                                                    "
                                                >
                                                    <div className="grid gap-1.5">
                                                        {sections.map(
                                                            (section) => {
                                                                const sectionMeta =
                                                                    getSectionByBackend(
                                                                        section.name
                                                                    )

                                                                return (
                                                                    <div
                                                                        key={`${report.id}-${section.name}`}
                                                                        className="flex items-center gap-2 text-xs"
                                                                    >
                                                                        {statusIcon(
                                                                            section.status
                                                                        )}

                                                                        <span
                                                                            className={cn(
                                                                                "truncate",
                                                                                section.status ===
                                                                                    "pending"
                                                                                    ? "text-muted-foreground"
                                                                                    : "text-foreground"
                                                                            )}
                                                                        >
                                                                            {
                                                                                sectionMeta.label
                                                                            }
                                                                            {section.status !==
                                                                            "pending"
                                                                                ? ` - ${statusText(
                                                                                      section.status
                                                                                  )}`
                                                                                : ""}
                                                                        </span>
                                                                    </div>
                                                                )
                                                            }
                                                        )}
                                                    </div>

                                                    <span className="mt-3 inline-block text-xs font-semibold text-primary">
                                                        {active
                                                            ? "Continue report"
                                                            : "Switch to this report"}
                                                    </span>
                                                </Link>
                                            </AccordionContent>
                                        </AccordionItem>
                                    )
                                })}
                            </Accordion>
                        )}
                    </div>

                    {showFade && (
                        <div className="w-full flex justify-center">
                            <div
                                aria-hidden="true"
                                className="
                                    pointer-events-none absolute inset-x-0 bottom-0 h-14
                                    bg-linear-to-t from-white dark:from-neutral-950 to-transparent
                                "
                            />
                            <span
                            aria-hidden="true"
                            className={cn(
                                "pointer-events-none absolute inset-x-0 bottom-2 mx-auto w-fit",
                                "rounded-full px-2 py-0.5",
                                "text-center text-[11px] font-medium text-foreground/70",

                                // Glass surface
                                "bg-background/45",
                                "backdrop-blur-xl backdrop-saturate-150",

                                // Reflective edge
                                "border border-white/30",
                                "dark:border-white/10",

                                // Depth
                                "shadow-[0_4px_16px_rgb(0_0_0/0.08)]",
                                "ring-1 ring-black/5"
                            )}
                        >
                            ↓ Scroll for more
                        </span>
                        </div>
                    )}
                </div>
            </div>
        </aside>
    )
}


function getReportWizardTabs(
    {
        section,
        method,
        uploadType,
        reportId,
    }: {
        section: WizardSection
        method: WizardMethod
        uploadType: UploadType
        reportId: string | null
    }
){
    const isQuickEntry = method === "quick-entry"

    const tabs = [
        {
            label: isQuickEntry ? "Quick Entry" : "Manual Entry",
            key: "manual",
            description: isQuickEntry
                ? "Complete the report using a simplified entry workflow."
                : "Enter the report details manually, section by section.",
            href: createWizardHref(section.id, {
                method: isQuickEntry ? "quick-entry" : "manual-entry",
                report_id: reportId,
            }),
        },
        {
            label: "Upload File",
            key: "upload",
            description:
                "Upload a completed file to populate this report section.",
            href: createWizardHref(section.id, {
                method: "upload",
                upload_type: uploadType,
                report_id: reportId,
            }),
        },
    ]

    return tabs
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
                        // ["csv", "CSV", FileSpreadsheetIcon],
                        // ["ocr", "OCR", ImageIcon],
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
    report,
}: {
    section: WizardSection
    report: WizardReport | null
}) {
    const period = report?.period_start?.slice(0, 7)
        ?? new Date().toISOString().slice(0, 7)

    if (section.id === "attendance") {
        return <AttendanceFormView period={period} reportId={report?.id} />
    }

    const kind = section.id === "tithes"
        ? "tithes"
        : section.id === "revenue"
            ? "revenue"
            : section.id === "overhead"
                ? "overhead"
                : "expenses"

    return <FinancialEntriesForm kind={kind} period={period} reportId={report?.id} />
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
    const sectionIndex = WIZARD_SECTIONS.findIndex((item) => item.id === section.id)
    const nextSection = WIZARD_SECTIONS[Math.min(sectionIndex + 1, WIZARD_SECTIONS.length - 1)]
    const backSection = WIZARD_SECTIONS[Math.max(sectionIndex - 1, 0)]
    const tabs = getReportWizardTabs({
        section,
        method,
        uploadType,
        reportId
    })

    return (
        <View className="flex flex-col h-full min-h-0">
            <View.Header pagename="Report Wizard" />
            <View.Tabs items={tabs} activeKey={method} />

            <div className="px-5 pt-4 h-fit">
                <StepRail current={section} report={activeReport} />
            </div>

            <div className="flex min-w-0 flex-1 flex-col lg:flex-row gap-3">
                <PartialReportsSidebar
                    reports={reports}
                    activeReportId={reportId}
                    current={section} 
                    report={activeReport}
                />

                <main className="flex min-w-0 flex-1 flex-col order-1 pl-5">
                    <div className="min-h-0 flex-1 overflow-y-auto">
                        <div className="mx-auto flex max-w-5xl flex-col gap-5">
                            {/* <MethodTabs
                                section={section}
                                method={method}
                                uploadType={uploadType}
                                reportId={reportId}
                            /> */}

                            {method === "upload" ? (
                                <UploadPanel section={section} uploadType={uploadType} />
                            ) : (
                                <ManualEntryPanel
                                    section={section}
                                    report={activeReport}
                                />
                            )}
                        </div>
                    </div>

                    <footer className="shrink-0 border-t border-border-subtle px-0 py-4">
                        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3">
                            <div className="flex items-center gap-2">
                                <Button variant="outline" asChild className="border-0 border-border-subtle shadow-elevation-sm">
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

                                <Button
                                    type="button"
                                    variant="outline"
                                    disabled={!activeSectionStatus?.id}
                                    onClick={() => setSkipOpen(true)}
                                    className="text-amber-700 shadow-elevation-sm"
                                >
                                    <SkipForwardIcon className="size-4" />
                                    Skip this section
                                </Button>
                            </div>

                            <div className="flex items-center gap-2">
                                
                                <Button asChild>
                                    <Link
                                        href={createWizardHref(nextSection.id, {
                                            method,
                                            upload_type: method === "upload" ? uploadType : null,
                                            report_id: reportId,
                                        })}
                                    >
                                        <SkipForward /> Continue to {nextSection.label}
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
        </View>
    )
}
