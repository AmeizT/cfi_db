"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import {
    ArrowRight,
    ChevronLeft,
    ChevronRight,
    ExternalLink,
    FileLock2,
    Link2,
    Loader2,
    LockKeyhole,
} from "lucide-react"
import { toast } from "sonner"

import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { Textarea } from "@/components/ui/textarea"
import View from "@/components/ui/view"

import {
    createReportSectionWizardHref,
    type WorkflowReportSectionKey,
} from "@/features/report-wizard/config/report-types"

import {
    amendReport,
    requestReportReopening,
    startCurrentReport,
} from "../api"

import {
    adjacentReportPeriod,
    formatReportDate,
    formatReportPeriod,
    formatReportValue,
    reportPeriodHref,
} from "../format"

import {
    useCurrentReport,
    useSubmittedReport,
} from "../hooks"

import {
    REPORT_SECTIONS,
    type ReportSection,
    type WorkflowReport,
} from "../types"

import {
    ReportStatusBadge,
    reportStatusLabel,
} from "../components/ReportStatusBadge"


function isWorkflowSectionKey(
    value: string
): value is WorkflowReportSectionKey {
    return REPORT_SECTIONS.some(
        (section) => section.key === value
    )
}


function sectionWizardHref(
    report: WorkflowReport,
    sectionKey?: string
) {
    const unresolved = report.sections.find(
        (section) => !section.resolved
    )?.key

    const key =
        sectionKey ??
        unresolved ??
        "review"

    const canonicalKey = isWorkflowSectionKey(key)
        ? key
        : "review"

    return createReportSectionWizardHref(
        canonicalKey,
        {
            method: "manual-entry",
            report_id: report.id,
            amendment_context:
                report.status === "reopened"
                    ? "reopened"
                    : null,
        }
    )
}


function sourceName(sectionKey: string) {
    return (
        REPORT_SECTIONS.find(
            (section) => section.key === sectionKey
        )?.source ?? "Workspace"
    )
}


function sectionMeta(section: ReportSection) {
    if (section.status === "no_activity") {
        return "Confirmed no activity"
    }

    if (section.status === "skipped") {
        return "Submitted with an exception"
    }

    const noun = section.key.includes("attendance")
        ? "weekly records"
        : "source records"

    const status = section.resolved
        ? "completed"
        : reportStatusLabel(
              section.status
          ).toLowerCase()

    return `${section.record_count} ${noun} · ${status}`
}


function MonthNavigator({
    periodStart,
}: {
    periodStart: string
}) {
    return (
        <div className="flex h-11 min-w-64 items-center rounded-xl border border-border bg-background">
            <Button
                asChild
                variant="ghost"
                size="icon"
                className="rounded-r-none"
                aria-label="Previous month"
            >
                <Link
                    href={adjacentReportPeriod(
                        periodStart,
                        -1
                    )}
                >
                    <ChevronLeft className="size-4" />
                </Link>
            </Button>

            <span className="flex-1 text-center text-sm font-semibold">
                {formatReportPeriod(periodStart)}
            </span>

            <Button
                asChild
                variant="ghost"
                size="icon"
                className="rounded-l-none"
                aria-label="Next month"
            >
                <Link
                    href={adjacentReportPeriod(
                        periodStart,
                        1
                    )}
                >
                    <ChevronRight className="size-4" />
                </Link>
            </Button>
        </div>
    )
}


export function MonthlyReportDetailView({
    year,
    month,
}: {
    year: number
    month: number
}) {
    const router = useRouter()
    const queryClient = useQueryClient()

    const reportQuery = useCurrentReport(
        year,
        month
    )

    const report = reportQuery.data

    const officialQuery = useSubmittedReport(
        report?.id ?? 0,
        undefined,
        Boolean(
            report?.id &&
                ["submitted", "locked"].includes(
                    report.status
                )
        )
    )

    const [dialog, setDialog] = React.useState<
        "amend" | "reopen" | null
    >(null)

    const [reason, setReason] =
        React.useState("")


    const invalidate = () => {
        return queryClient.invalidateQueries({
            queryKey: ["reports-workflow"],
        })
    }


    const startMutation = useMutation({
        mutationFn: () =>
            startCurrentReport(
                year,
                month
            ),

        onSuccess: (created) => {
            invalidate()

            toast.success(
                "Monthly report started"
            )

            router.push(
                sectionWizardHref(created)
            )
        },

        onError: (error) => {
            toast.error(error.message)
        },
    })


    const statusMutation = useMutation({
        mutationFn: async () => {
            if (!report?.id || !dialog) {
                throw new Error(
                    "This report is not available."
                )
            }

            if (dialog === "amend") {
                return amendReport(
                    report.id,
                    reason.trim()
                )
            }

            return requestReportReopening(
                report.id,
                reason.trim()
            )
        },

        onSuccess: (result) => {
            invalidate()

            if (
                dialog === "amend" &&
                "period_start" in result
            ) {
                toast.success(
                    "Amendment opened"
                )

                router.push(
                    sectionWizardHref(result)
                )

                return
            }

            toast.success(
                "Reopening request sent for review"
            )

            setDialog(null)
            setReason("")
        },

        onError: (error) => {
            toast.error(error.message)
        },
    })


    if (reportQuery.isLoading) {
        return (
            <View>
                <View.Body className="gap-4 py-6 lg:px-6">
                    <Skeleton className="h-32 rounded-xl" />

                    <Skeleton className="h-[34rem] rounded-xl" />
                </View.Body>
            </View>
        )
    }


    if (
        reportQuery.isError ||
        !report
    ) {
        return (
            <View>
                <View.Body className="py-6 lg:px-6">
                    <Alert variant="destructive">
                        <AlertTitle>
                            Monthly report could not
                            be loaded
                        </AlertTitle>

                        <AlertDescription>
                            {reportQuery.error
                                ?.message ??
                                "Try again shortly."}
                        </AlertDescription>
                    </Alert>
                </View.Body>
            </View>
        )
    }


    const official =
        officialQuery.data

    const isOfficial = [
        "submitted",
        "locked",
    ].includes(report.status)

    const currency =
        report.assembly.currency

    const primaryAction = report.id
        ? sectionWizardHref(
              report,
              report.status ===
                  "ready_to_submit"
                  ? "review"
                  : undefined
          )
        : null

    const actionLabel =
        report.status ===
        "ready_to_submit"
            ? "Review & submit"
            : report.status ===
                "reopened"
              ? "Continue amendment"
              : "Continue report"


    return (
        <View>
            <View.Body className="gap-5 py-3 pb-8 lg:px-6">
                {/* Breadcrumb */}

                <div className="hidden text-sm text-muted-foreground">
                    <Link
                        href="/reports/activity"
                        className="hover:text-foreground"
                    >
                        Report Activity
                    </Link>

                    <span className="px-2">
                        /
                    </span>

                    <span className="font-medium text-foreground">
                        {formatReportPeriod(
                            report.period_start
                        )}
                    </span>
                </div>

                <header className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                        <p className="hidden text-sm font-semibold uppercase tracking-wide text-primary">
                            Reports ·{" "}
                            {reportStatusLabel(
                                report.status
                            )}
                        </p>

                        <h1 className="mt-3 text-3xl font-bold tracking-tight text-foreground">
                            {formatReportPeriod(
                                report.period_start
                            )}{" "}
                            Monthly Report
                        </h1>

                        <p className="mt-2 text-base text-muted-foreground">
                            {
                                report.assembly
                                    .name
                            }{" "}
                            ·{" "}
                            {isOfficial
                                ? "Official submitted snapshot"
                                : `Due ${formatReportDate(
                                      report.due_at,
                                      true
                                  )}`}
                        </p>
                    </div>


                    <div className="flex flex-col gap-2 sm:items-end">
                        <MonthNavigator
                            periodStart={
                                report.period_start
                            }
                        />

                        <div className="flex flex-wrap gap-2">
                            <ReportStatusBadge
                                status={
                                    report.status
                                }
                                className="h-9 rounded-full px-4"
                            />

                            {report.current_version ? (
                                <Badge
                                    variant="secondary"
                                    className="h-9 rounded-full px-4"
                                >
                                    <LockKeyhole className="mr-1 size-3.5" />

                                    v
                                    {
                                        report.current_version
                                    }
                                </Badge>
                            ) : null}
                        </div>
                    </div>
                </header>


                {/* Report notice */}

                {isOfficial ? (
                    <Alert className="border-amber-200 bg-amber-50/70 text-amber-950 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-100">
                        <Link2 className="size-4 text-primary" />

                        <AlertDescription>
                            This page is the
                            official locked report.
                            Each section can be
                            opened here, then linked
                            directly to its live
                            source records in Finance
                            or Engagement.
                        </AlertDescription>
                    </Alert>
                ) : (
                    <Alert>
                        <AlertTitle>
                            {report.id
                                ? `${report.completion_percentage}% of this report is resolved`
                                : "This monthly report has not been started"}
                        </AlertTitle>

                        <AlertDescription>
                            {report.id
                                ? "Open a section in the Report Wizard to add or review its reporting-period records."
                                : "Start the report to create its six required sections and begin in the Report Wizard."}
                        </AlertDescription>
                    </Alert>
                )}


                {/* Official report loading */}

                {isOfficial &&
                officialQuery.isLoading ? (
                    <Skeleton className="h-136 rounded-xl" />
                ) : null}


                {/* Official report error */}

                {isOfficial &&
                officialQuery.isError ? (
                    <Alert variant="destructive">
                        <AlertTitle>
                            The official snapshot
                            could not be loaded
                        </AlertTitle>

                        <AlertDescription>
                            {
                                officialQuery.error
                                    .message
                            }
                        </AlertDescription>
                    </Alert>
                ) : null}


                {/* Official submitted report */}

                {isOfficial && official ? (
                    <>
                        <Card className="rounded-2xl">
                            <CardHeader>
                                <CardTitle>
                                    Submitted
                                    sections
                                </CardTitle>

                                <p className="text-sm text-muted-foreground">
                                    Every value shown
                                    here is the
                                    immutable figure
                                    that was officially
                                    submitted. Select a
                                    section to see its
                                    full breakdown.
                                </p>
                            </CardHeader>


                            <CardContent className="grid gap-3 md:grid-cols-2">
                                {official.sections.map(
                                    (section) => {
                                        const detailHref = `/reports/submitted/${official.report}/${section.key}?return_to=${encodeURIComponent(
                                            reportPeriodHref(
                                                report.period_start
                                            )
                                        )}`

                                        const isAttendance =
                                            section.key.includes(
                                                "attendance"
                                            )

                                        const source =
                                            sourceName(
                                                section.key
                                            )

                                        return (
                                            <Link
                                                key={
                                                    section.key
                                                }
                                                href={
                                                    detailHref
                                                }
                                                className="group rounded-xl border border-border p-5 transition-colors hover:border-primary/40 hover:bg-accent/30"
                                            >
                                                <div className="flex items-start justify-between gap-4">
                                                    <div className="min-w-0">
                                                        <div className="flex flex-wrap items-center gap-2">
                                                            <h3 className="font-semibold">
                                                                {
                                                                    section.label
                                                                }
                                                            </h3>

                                                            <Badge
                                                                variant="secondary"
                                                                className={
                                                                    source ===
                                                                    "Finance"
                                                                        ? "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                                                                        : "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                                                                }
                                                            >
                                                                {source.toUpperCase()}
                                                            </Badge>

                                                            {section.status ===
                                                            "no_activity" ? (
                                                                <Badge variant="secondary">
                                                                    No
                                                                    activity
                                                                </Badge>
                                                            ) : null}
                                                        </div>


                                                        <p className="mt-3 text-2xl font-bold">
                                                            {formatReportValue(
                                                                section.total,
                                                                isAttendance
                                                                    ? undefined
                                                                    : currency
                                                            )}
                                                        </p>


                                                        <p className="mt-2 text-sm text-muted-foreground">
                                                            {sectionMeta(
                                                                {
                                                                    ...section,
                                                                    resolved:
                                                                        true,
                                                                    name: section.label,
                                                                }
                                                            )}
                                                        </p>
                                                    </div>


                                                    <ChevronRight className="mt-8 size-5 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                                                </div>
                                            </Link>
                                        )
                                    }
                                )}
                            </CardContent>
                        </Card>


                        {/* Submission and audit details */}

                        <div className="grid gap-4 lg:grid-cols-2">
                            <Card className="rounded-2xl">
                                <CardHeader>
                                    <CardTitle>
                                        Submission
                                        details
                                    </CardTitle>
                                </CardHeader>

                                <CardContent className="space-y-4 text-sm">
                                    {[
                                        [
                                            "Submitted by",
                                            official.submitted_by_name ??
                                                "System user",
                                        ],
                                        [
                                            "Submitted on",
                                            formatReportDate(
                                                official.submitted_at,
                                                true
                                            ),
                                        ],
                                        [
                                            "Version",
                                            String(
                                                official.version_number
                                            ),
                                        ],
                                        [
                                            "Grace period",
                                            `${
                                                official
                                                    .capabilities
                                                    .is_locked
                                                    ? "Ended"
                                                    : "Ends"
                                            } ${formatReportDate(
                                                official.editable_until
                                            )}`,
                                        ],
                                        [
                                            "Declaration",
                                            official.declaration_confirmed
                                                ? "Confirmed complete and accurate"
                                                : "Not confirmed",
                                        ],
                                    ].map(
                                        ([
                                            label,
                                            value,
                                        ]) => (
                                            <div
                                                key={
                                                    label
                                                }
                                                className="flex justify-between gap-5"
                                            >
                                                <span className="text-muted-foreground">
                                                    {
                                                        label
                                                    }
                                                </span>

                                                <span className="text-right font-semibold">
                                                    {
                                                        value
                                                    }
                                                </span>
                                            </div>
                                        )
                                    )}
                                </CardContent>
                            </Card>


                            <Card className="rounded-2xl">
                                <CardHeader>
                                    <CardTitle>
                                        Audit history
                                    </CardTitle>
                                </CardHeader>

                                <CardContent className="space-y-5 text-sm">
                                    {official.audit_history
                                        .slice(0, 8)
                                        .map(
                                            (
                                                event
                                            ) => (
                                                <div
                                                    key={
                                                        event.id
                                                    }
                                                >
                                                    <p className="font-medium">
                                                        {event.description ??
                                                            reportStatusLabel(
                                                                event.action
                                                            )}
                                                    </p>

                                                    <p className="mt-1 text-muted-foreground">
                                                        {formatReportDate(
                                                            event.timestamp,
                                                            true
                                                        )}

                                                        {event.actor
                                                            ? ` · ${event.actor}`
                                                            : ""}
                                                    </p>
                                                </div>
                                            )
                                        )}


                                    {!official
                                        .audit_history
                                        .length ? (
                                        <p className="text-muted-foreground">
                                            No audit
                                            events are
                                            available.
                                        </p>
                                    ) : null}
                                </CardContent>
                            </Card>
                        </div>
                    </>
                ) : !isOfficial ? (
                    /* Active / draft report */

                    <Card className="rounded-none">
                        <CardHeader className="px-0 flex-row items-start justify-between gap-4">
                            <div>
                                <CardTitle>
                                    Monthly report
                                    sections
                                </CardTitle>

                                <p className="mt-1 text-sm text-muted-foreground">
                                    All edits open in
                                    the guided Report
                                    Wizard with this
                                    report and period
                                    preserved.
                                </p>
                            </div>


                            {!report.id ? (
                                <Button
                                    disabled={
                                        !report
                                            .capabilities
                                            .can_start ||
                                        startMutation.isPending
                                    }
                                    onClick={() =>
                                        startMutation.mutate()
                                    }
                                >
                                    {startMutation.isPending ? (
                                        <Loader2 className="size-4 animate-spin" />
                                    ) : null}

                                    Start report
                                </Button>
                            ) : primaryAction ? (
                                <Button asChild>
                                    <Link
                                        href={
                                            primaryAction
                                        }
                                    >
                                        {
                                            actionLabel
                                        }

                                        <ArrowRight className="size-4" />
                                    </Link>
                                </Button>
                            ) : null}
                        </CardHeader>


                        <CardContent className="px-0 grid gap-3 md:grid-cols-2">
                            {(
                                report.sections
                                    .length
                                    ? report.sections
                                    : REPORT_SECTIONS.map(
                                          (
                                              section
                                          ) => ({
                                              id: null,
                                              key: section.key,
                                              name: section.label,
                                              label: section.label,
                                              status: "not_started" as const,
                                              resolved:
                                                  false,
                                              total: 0,
                                              record_count: 0,
                                          })
                                      )
                            ).map(
                                (section) => {
                                    const isAttendance =
                                        section.key.includes(
                                            "attendance"
                                        )

                                    const canOpenWizard =
                                        report.id &&
                                        isWorkflowSectionKey(
                                            section.key
                                        )

                                    return (
                                        <div
                                            key={
                                                section.key
                                            }
                                            className="rounded-2xl border border-border-subtle p-4"
                                        >
                                            <div className="flex items-start justify-between gap-3">
                                                <div>
                                                    <h3 className="font-semibold">
                                                        {
                                                            section.label
                                                        }
                                                    </h3>

                                                    <p className="mt-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                                        {sourceName(
                                                            section.key
                                                        )}
                                                    </p>
                                                </div>

                                                <ReportStatusBadge
                                                    status={
                                                        section.status
                                                    }
                                                />
                                            </div>


                                            <p className="mt-4 text-2xl font-bold">
                                                {formatReportValue(
                                                    section.total,
                                                    isAttendance
                                                        ? undefined
                                                        : currency
                                                )}
                                            </p>


                                            <p className="mt-1 text-sm text-muted-foreground">
                                                {sectionMeta(
                                                    section
                                                )}
                                            </p>


                                            {canOpenWizard ? (
                                                <Button
                                                    asChild
                                                    variant="outline"
                                                    
                                                    className="mt-4 shadow-elevation-sm"
                                                >
                                                    <Link
                                                        href={sectionWizardHref(
                                                            report,
                                                            section.key
                                                        )}
                                                    >
                                                        Open
                                                        in
                                                        Report
                                                        Wizard

                                                        <ExternalLink className="size-3.5" />
                                                    </Link>
                                                </Button>
                                            ) : null}
                                        </div>
                                    )
                                }
                            )}


                            {report.status ===
                            "not_required" ? (
                                <p className="col-span-full text-sm text-muted-foreground">
                                    No report is
                                    required for this
                                    assembly and period.
                                </p>
                            ) : null}
                        </CardContent>
                    </Card>
                ) : null}


                {/* Official report actions */}

                {report.id &&
                isOfficial ? (
                    <div className="flex justify-end gap-2">
                        {report.capabilities
                            .can_amend ? (
                            <Button
                                variant="outline"
                                onClick={() =>
                                    setDialog(
                                        "amend"
                                    )
                                }
                            >
                                Amend report
                            </Button>
                        ) : null}


                        {report.capabilities
                            .can_request_reopen ? (
                            <Button
                                variant="outline"
                                onClick={() =>
                                    setDialog(
                                        "reopen"
                                    )
                                }
                            >
                                <FileLock2 className="size-4" />

                                Request reopening
                            </Button>
                        ) : null}
                    </div>
                ) : null}
            </View.Body>


            {/* Amendment / reopening dialog */}

            <Dialog
                open={dialog !== null}
                onOpenChange={(open) => {
                    if (!open) {
                        setDialog(null)
                    }
                }}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {dialog === "amend"
                                ? "Amend submitted report"
                                : "Request report reopening"}
                        </DialogTitle>

                        <DialogDescription>
                            {dialog === "amend"
                                ? "The submitted version stays immutable while you prepare a new version in the Report Wizard."
                                : "Explain why this locked report needs to be reopened for correction."}
                        </DialogDescription>
                    </DialogHeader>


                    <Textarea
                        value={reason}
                        onChange={(event) =>
                            setReason(
                                event.target.value
                            )
                        }
                        rows={4}
                        placeholder="Reason for correction…"
                    />


                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() =>
                                setDialog(null)
                            }
                        >
                            Cancel
                        </Button>

                        <Button
                            disabled={
                                !reason.trim() ||
                                statusMutation.isPending
                            }
                            onClick={() =>
                                statusMutation.mutate()
                            }
                        >
                            {statusMutation.isPending ? (
                                <Loader2 className="size-4 animate-spin" />
                            ) : null}

                            {dialog === "amend"
                                ? "Start amendment"
                                : "Send request"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </View>
    )
}