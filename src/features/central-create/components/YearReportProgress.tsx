"use client"

import Link from "next/link"
import { CalendarRangeIcon, Loader2Icon } from "lucide-react"

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import {
    REPORT_WIZARD_SECTIONS,
    createReportWizardHref,
    type ReportWizardMethod,
    type ReportWizardUploadType,
} from "@/features/report-wizard/config/report-types"
import { ReportStatusBadge, reportStatusLabel } from "@/features/reports/workflow/components/ReportStatusBadge"
import { formatReportPeriod } from "@/features/reports/workflow/format"
import { useReportsOverview } from "@/features/reports/workflow/hooks"
import type { ReportSectionStatus, WorkflowReport } from "@/features/reports/workflow/types"
import { cn } from "@/lib/utils"

type YearReportProgressProps = {
    year: number
    activeReportId?: string | number | null
    activePeriodStart?: string | null
    method: ReportWizardMethod
    uploadType: ReportWizardUploadType
    amendmentContext?: string | null
}

type VisualSectionStatus = ReportSectionStatus | "submitted"

const SEGMENT_STYLES: Record<VisualSectionStatus, string> = {
    completed: "bg-emerald-500",
    submitted: "bg-emerald-500",
    no_activity: "bg-cyan-500",
    skipped: "bg-amber-500",
    in_progress: "bg-primary",
    not_required: "bg-muted-foreground/40",
    not_started: "bg-muted",
}

function isSubmitted(report: WorkflowReport) {
    return report.status === "submitted" || report.status === "locked"
}

function reviewStatus(report: WorkflowReport): VisualSectionStatus {
    if (isSubmitted(report)) return "submitted"
    if (report.status === "ready_to_submit" || report.capabilities.can_submit) {
        return "in_progress"
    }
    return "not_started"
}

function configuredSections(report: WorkflowReport) {
    return REPORT_WIZARD_SECTIONS.map((section) => {
        if (section.id === "review") {
            return {
                meta: section,
                status: reviewStatus(report),
            }
        }

        const workflowSection = report.sections.find(
            (item) => item.key === section.backendId || item.name === section.backendId,
        )
        return {
            meta: section,
            status: workflowSection?.status ?? "not_started",
        }
    })
}

function reportSummary(report: WorkflowReport) {
    const sections = configuredSections(report)
    const completed = sections.filter((item) =>
        item.status === "completed" ||
        item.status === "submitted" ||
        item.status === "no_activity",
    ).length
    const skipped = sections.filter((item) =>
        item.status === "skipped" || item.status === "not_required",
    ).length
    const inProgress = sections.filter((item) => item.status === "in_progress").length

    if (isSubmitted(report)) return "Submitted"
    if (!completed && !skipped && !inProgress) return "Not started"

    return [
        completed ? `${completed} completed` : null,
        skipped ? `${skipped} skipped` : null,
        inProgress ? `${inProgress} in progress` : null,
    ].filter(Boolean).join(" · ")
}

function reportResumeSection(report: WorkflowReport) {
    if (isSubmitted(report)) return "review"

    const unresolved = REPORT_WIZARD_SECTIONS.find((section) => {
        if (section.id === "review") return false
        const item = report.sections.find(
            (candidate) => candidate.key === section.backendId || candidate.name === section.backendId,
        )
        return !item?.resolved
    })

    return unresolved?.id ?? "review"
}

function ReportSegments({ report }: { report: WorkflowReport }) {
    const sections = configuredSections(report)
    return (
        <div
            className="mt-2 grid grid-cols-7 gap-1"
            role="img"
            aria-label={sections.map((item) =>
                `${item.meta.navigationLabel ?? item.meta.label}: ${reportStatusLabel(item.status)}`,
            ).join(", ")}
        >
            {sections.map((item) => (
                <span
                    key={item.meta.id}
                    className={cn("h-1.5 rounded-full", SEGMENT_STYLES[item.status])}
                    aria-hidden="true"
                />
            ))}
        </div>
    )
}

export function YearReportProgress({
    year,
    activeReportId,
    activePeriodStart,
    method,
    uploadType,
    amendmentContext,
}: YearReportProgressProps) {
    const query = useReportsOverview(year)
    const reports = query.data?.months ?? []
    const submittedCount = reports.filter(isSubmitted).length
    const activeReport = reports.find((report) =>
        (activeReportId && String(report.id) === String(activeReportId)) ||
        (activePeriodStart && report.period_start === activePeriodStart),
    )
    const defaultMonth = activeReport?.period_start

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button
                    type="button"
                    variant="outline"
                    className="h-11 gap-2 rounded-xl border-border-subtle bg-background px-3 text-left shadow-none"
                    aria-label={`Open ${year} report progress`}
                >
                    <CalendarRangeIcon className="size-4 text-primary" aria-hidden="true" />
                    <span className="leading-tight">
                        <span className="block text-xs font-bold text-foreground">
                            {year} Progress
                        </span>
                        <span className="hidden text-[0.6875rem] font-medium text-muted-foreground sm:block">
                            {query.isLoading
                                ? "Loading reports"
                                : `${submittedCount} of ${reports.length || 12} submitted`}
                        </span>
                    </span>
                </Button>
            </SheetTrigger>

            <SheetContent side="right" className="w-[min(32rem,96vw)] gap-0 p-0 sm:max-w-none">
                <SheetHeader className="border-b border-border-subtle px-5 py-5 pr-12">
                    <SheetTitle className="text-xl">{year} Report Progress</SheetTitle>
                    <SheetDescription>
                        {query.data?.assembly.name
                            ? `${query.data.assembly.name} · ${submittedCount} of ${reports.length} reports submitted`
                            : "Monthly reporting status for the selected year."}
                    </SheetDescription>
                </SheetHeader>

                <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-zinc-300">
                    {query.isLoading ? (
                        <div className="flex min-h-56 items-center justify-center text-sm text-muted-foreground">
                            <Loader2Icon className="mr-2 size-4 animate-spin" aria-hidden="true" />
                            Loading yearly report progress…
                        </div>
                    ) : query.isError || !query.data ? (
                        <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive">
                            {query.error?.message ?? "Year progress could not be loaded."}
                        </div>
                    ) : (
                        <Accordion
                            type="single"
                            collapsible
                            defaultValue={defaultMonth}
                            className="grid gap-2"
                        >
                            {reports.map((report) => {
                                const current = Boolean(
                                    (activeReportId && String(report.id) === String(activeReportId)) ||
                                    (activePeriodStart && report.period_start === activePeriodStart),
                                )
                                const reportHref = report.id
                                    ? createReportWizardHref(reportResumeSection(report), {
                                        method,
                                        upload_type: method === "upload" ? uploadType : null,
                                        report_id: report.id,
                                        amendment_context: current ? amendmentContext : null,
                                    })
                                    : null

                                return (
                                    <AccordionItem
                                        key={report.period_start}
                                        value={report.period_start}
                                        className={cn(
                                            "rounded-xl border border-border-subtle bg-card px-3",
                                            current && "border-primary/30 bg-primary/5",
                                        )}
                                    >
                                        <AccordionTrigger className="py-3 hover:no-underline">
                                            <span className="min-w-0 flex-1">
                                                <span className="flex items-center gap-2">
                                                    <span className="truncate font-semibold text-foreground">
                                                        {formatReportPeriod(report.period_start)}
                                                    </span>
                                                    {current ? (
                                                        <Badge variant="secondary" className="bg-primary/10 text-[0.625rem] text-primary">
                                                            Current
                                                        </Badge>
                                                    ) : null}
                                                </span>
                                                <ReportSegments report={report} />
                                                <span className="mt-2 flex items-center justify-between gap-3 text-xs text-muted-foreground">
                                                    <span>{reportSummary(report)}</span>
                                                    <ReportStatusBadge status={report.status} className="shrink-0 text-[0.625rem]" />
                                                </span>
                                            </span>
                                        </AccordionTrigger>

                                        <AccordionContent className="pb-3">
                                            <div className="grid gap-1 border-t border-border-subtle pt-3">
                                                {configuredSections(report).map((item) => {
                                                    const href = report.id
                                                        ? createReportWizardHref(item.meta.id, {
                                                            method,
                                                            upload_type: method === "upload" ? uploadType : null,
                                                            report_id: report.id,
                                                            amendment_context: current ? amendmentContext : null,
                                                        })
                                                        : null
                                                    const content = (
                                                        <span className="flex items-center justify-between gap-3 rounded-lg px-2 py-2 text-xs">
                                                            <span className="min-w-0 truncate font-medium text-foreground">
                                                                {item.meta.navigationLabel ?? item.meta.label}
                                                            </span>
                                                            <span className={cn(
                                                                "shrink-0 font-semibold",
                                                                item.status === "completed" || item.status === "submitted"
                                                                    ? "text-emerald-700 dark:text-emerald-300"
                                                                    : item.status === "in_progress"
                                                                        ? "text-primary"
                                                                        : item.status === "skipped"
                                                                            ? "text-amber-700 dark:text-amber-300"
                                                                            : "text-muted-foreground",
                                                            )}>
                                                                {reportStatusLabel(item.status)}
                                                            </span>
                                                        </span>
                                                    )

                                                    return href ? (
                                                        <SheetClose asChild key={item.meta.id}>
                                                            <Link
                                                                href={href}
                                                                className="rounded-lg outline-none hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring"
                                                            >
                                                                {content}
                                                            </Link>
                                                        </SheetClose>
                                                    ) : (
                                                        <div key={item.meta.id}>{content}</div>
                                                    )
                                                })}
                                            </div>

                                            {reportHref ? (
                                                <SheetClose asChild>
                                                    <Button asChild size="sm" className="mt-3 w-full">
                                                        <Link href={reportHref}>Open report</Link>
                                                    </Button>
                                                </SheetClose>
                                            ) : (
                                                <p className="mt-3 rounded-lg bg-muted/50 px-3 py-2 text-xs text-muted-foreground">
                                                    This reporting period has not been started.
                                                </p>
                                            )}
                                        </AccordionContent>
                                    </AccordionItem>
                                )
                            })}
                        </Accordion>
                    )}
                </div>
            </SheetContent>
        </Sheet>
    )
}
