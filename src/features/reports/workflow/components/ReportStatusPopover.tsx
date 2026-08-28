"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  ArrowRight,
  Check,
  Circle,
  ClockAlert,
  Loader2,
} from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Textarea } from "@/components/ui/textarea"
import {
  createReportSectionWizardHref,
  type WorkflowReportSectionKey,
} from "@/features/report-wizard/config/report-routing"
import { getReportContextActionVisibility } from "@/features/workspace/config/report-context"
import { cn } from "@/lib/utils"
import {
  amendReport,
  getReportDetail,
  getSubmittedReport,
  requestReportReopening,
  startCurrentReport,
} from "../api"
import { formatReportDate, formatReportPeriod, reportPeriodHref } from "../format"
import { REPORT_SECTIONS, type ReportStatus, type WorkflowReport } from "../types"

type VisualStatus = "completed" | "overdue" | "not_started" | "in_progress"

const STATUS_META = {
  completed: {
    label: "Completed",
    icon: Check,
    textClassName: "text-emerald-700 dark:text-emerald-300",
    className:
      "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300",
  },
  overdue: {
    label: "Overdue",
    icon: ClockAlert,
    textClassName: "text-red-700 dark:text-red-300",
    className:
      "border-red-200 bg-red-50 text-red-700 hover:bg-red-100 dark:border-red-900 dark:bg-red-950 dark:text-red-300",
  },
  not_started: {
    label: "Not started",
    icon: Circle,
    textClassName: "text-muted-foreground",
    className:
      "border-border bg-background text-muted-foreground hover:bg-muted/60",
  },
  in_progress: {
    label: "In progress",
    icon: Circle,
    textClassName: "text-blue-700 dark:text-blue-300",
    className:
      "border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-300",
  },
} as const

function getReportId(searchParams: Readonly<URLSearchParams>) {
  return Number(
    searchParams.get("report_id")
      ?? searchParams.get("reportId")
      ?? searchParams.get("reportid")
      ?? searchParams.get("id"),
  )
}

function isWorkflowSectionKey(value: string | null): value is WorkflowReportSectionKey {
  return Boolean(value && REPORT_SECTIONS.some((section) => section.key === value))
}

function inferWorkflowSection(
  pathname: string,
  expenseType: string | null,
): WorkflowReportSectionKey | null {
  if (pathname.startsWith("/finance/tithes")) return "tithes"
  if (pathname.startsWith("/finance/revenue")) return "revenue"
  if (pathname.startsWith("/finance/expenses")) {
    return expenseType === "operating"
      ? "operating_expenses"
      : "activity_other_expenses"
  }
  if (pathname.startsWith("/engagement/attendance/sunday-school")) {
    return "sunday_school_attendance"
  }
  if (pathname.startsWith("/engagement/attendance")) return "general_attendance"
  return null
}

function getVisualStatus(status: ReportStatus): VisualStatus {
  if (status === "submitted" || status === "locked") return "completed"
  if (status === "overdue") return "overdue"
  if (status === "not_started") return "not_started"
  return "in_progress"
}

function getPeriodParts(periodStart: string) {
  const match = /^(\d{4})-(\d{2})/.exec(periodStart)
  if (!match) return {}
  return { year: Number(match[1]), month: Number(match[2]) }
}

function firstWizardSection(
  report: WorkflowReport,
  fallback: WorkflowReportSectionKey,
): WorkflowReportSectionKey {
  const unresolved = report.sections.find((section) => !section.resolved)?.key
  if (isWorkflowSectionKey(unresolved ?? null)) return unresolved as WorkflowReportSectionKey
  return fallback
}

export function ReportStatusPopover() {
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()
  const queryClient = useQueryClient()
  const reportId = getReportId(searchParams)
  const requestedSection = searchParams.get("section")
  const section = isWorkflowSectionKey(requestedSection)
    ? requestedSection
    : inferWorkflowSection(pathname, searchParams.get("type"))
  const fallbackSection = section ?? "review"
  const [dialog, setDialog] = React.useState<"amend" | "reopen" | null>(null)
  const [reason, setReason] = React.useState("")

  const reportQuery = useQuery({
    queryKey: ["reports-workflow", "status-popover", reportId],
    queryFn: () => getReportDetail(reportId),
    enabled: Number.isFinite(reportId) && reportId > 0,
  })
  const report = reportQuery.data
  const submittedQuery = useQuery({
    queryKey: ["reports-workflow", "status-popover", "submitted", reportId],
    queryFn: () => getSubmittedReport(reportId),
    enabled: Boolean(
      report?.id
      && (report.status === "submitted" || report.status === "locked"),
    ),
  })

  const correctionMutation = useMutation({
    mutationFn: async () => {
      if (!dialog) throw new Error("Choose a report action first.")
      return dialog === "amend"
        ? amendReport(reportId, reason.trim())
        : requestReportReopening(reportId, reason.trim())
    },
    onSuccess: async (result) => {
      await queryClient.invalidateQueries({ queryKey: ["reports-workflow"] })
      if (dialog === "amend" && "period_start" in result) {
        toast.success("Amendment opened")
        router.push(createReportSectionWizardHref(fallbackSection, {
          report_id: reportId,
          amendment_context: "reopened",
        }))
        return
      }
      toast.success("Reopening request sent for review")
      setDialog(null)
      setReason("")
    },
    onError: (error) => toast.error(error.message),
  })

  const startMutation = useMutation({
    mutationFn: () => {
      if (!report) throw new Error("The reporting period is unavailable.")
      const { year, month } = getPeriodParts(report.period_start)
      return startCurrentReport(year, month)
    },
    onSuccess: async (created) => {
      await queryClient.invalidateQueries({ queryKey: ["reports-workflow"] })
      toast.success("Monthly report started")
      router.push(createReportSectionWizardHref(
        firstWizardSection(created, fallbackSection),
        { report_id: created.id },
      ))
    },
    onError: (error) => toast.error(error.message),
  })

  if (!report) return null

  const visualStatus = getVisualStatus(report.status)
  const meta = STATUS_META[visualStatus]
  const StatusIcon = meta.icon
  const visibility = getReportContextActionVisibility(report.status, report.capabilities)
  const periodLabel = formatReportPeriod(report.period_start)
  const reportHref = reportPeriodHref(report.period_start)
  const submittedSectionHref = isWorkflowSectionKey(section) && report.id
    ? `/reports/submitted/${report.id}/${section}?return_to=${encodeURIComponent(reportHref)}`
    : reportHref
  const viewHref = visualStatus === "completed" ? submittedSectionHref : reportHref
  const wizardHref = report.id
    ? createReportSectionWizardHref(fallbackSection, {
        report_id: report.id,
        amendment_context: report.status === "reopened" ? "reopened" : null,
      })
    : null
  const submitted = submittedQuery.data
  const submittedBy = submitted?.submitted_by_name
  const submittedAt = submitted?.submitted_at ?? report.submitted_at

  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className={cn(
              "h-8 rounded-full border-0 px-4 text-sm font-semibold shadow-none",
              meta.className,
            )}
            aria-label={`Report status: ${meta.label}. Open report actions`}
          >
            <StatusIcon className="size-4" aria-hidden="true" />
            {meta.label}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          align="end"
          sideOffset={8}
          collisionPadding={16}
          className="w-[min(25rem,calc(100vw-2rem))] rounded-2xl border-border-subtle p-5 shadow-elevation-01 bg-background/70 backdrop-blur-2xl"
        >
          <div className="flex items-start justify-between gap-4">
            <div className={cn("flex items-center gap-2 font-semibold", meta.textClassName)}>
              <StatusIcon className="size-5" aria-hidden="true" />
              <span>{meta.label}</span>
            </div>
            <span className="shrink-0 text-sm font-medium tabular-nums text-muted-foreground">
              {periodLabel}
            </span>
          </div>

          <div className="mt-4 text-sm leading-6 text-muted-foreground">
            {visualStatus === "completed" ? (
              <p>
                {submittedAt ? `Submitted on ${formatReportDate(submittedAt)}` : "This report has been submitted"}
                {submittedBy ? ` by ${submittedBy}` : ""}.
                {report.capabilities.is_locked
                  ? " This report is locked for editing."
                  : " Existing report editing rules still apply."}
              </p>
            ) : visualStatus === "not_started" ? (
              <p>No records have been added for this period yet.</p>
            ) : (
              <p>
                Review operational records here and make any report-period changes in the Report Wizard.
              </p>
            )}
          </div>

          <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:flex-nowrap">
            {visualStatus === "not_started" &&
            report.capabilities.can_start ? (
                <Button
                    type="button"
                    className="w-full sm:flex-1 sm:basis-0"
                    disabled={startMutation.isPending}
                    onClick={() => startMutation.mutate()}
                >
                    {startMutation.isPending ? (
                        <Loader2 className="size-4 animate-spin" />
                    ) : null}

                    Start report
                </Button>
            ) : null}

            {visibility.editInWizard && wizardHref ? (
                <Button
                    asChild
                    className="w-full sm:flex-1 sm:basis-0"
                >
                    <Link href={wizardHref}>
                        Edit in Report Wizard
                        <ArrowRight className="size-4" />
                    </Link>
                </Button>
            ) : null}

            {visibility.viewReport ? (
                <Button
                    asChild
                    variant="outline"
                    className="w-full shadow-elevation-sm sm:flex-1 sm:basis-0"
                >
                    <Link href={viewHref}>
                        View report
                    </Link>
                </Button>
            ) : null}

            {visibility.amendReport ? (
                <Button
                    variant="outline"
                    className="w-full sm:flex-1 sm:basis-0"
                    onClick={() => setDialog("amend")}
                >
                    Amend report
                </Button>
            ) : null}

            {visibility.requestReopening ? (
                <Button
                    variant="outline"
                    className="w-full sm:flex-1 sm:basis-0"
                    onClick={() => setDialog("reopen")}
                >
                    Request reopening
                </Button>
            ) : null}
          </div>
        </PopoverContent>
      </Popover>

      <Dialog open={dialog !== null} onOpenChange={(open) => !open && setDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {dialog === "amend" ? "Amend monthly report" : "Request report reopening"}
            </DialogTitle>
            <DialogDescription>
              {dialog === "amend"
                ? "Give a reason for the correction. The selected section will then open in the Report Wizard."
                : "Explain why this locked report needs to be reopened for correction."}
            </DialogDescription>
          </DialogHeader>
          <Textarea
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            rows={4}
            placeholder="Reason for correction…"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialog(null)}>Cancel</Button>
            <Button
              disabled={!reason.trim() || correctionMutation.isPending}
              onClick={() => correctionMutation.mutate()}
            >
              {correctionMutation.isPending ? <Loader2 className="size-4 animate-spin" /> : null}
              {dialog === "amend" ? "Start amendment" : "Send request"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
