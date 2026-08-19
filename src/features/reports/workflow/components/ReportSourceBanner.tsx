"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { ArrowRight, FileCheck2, Loader2 } from "lucide-react"
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
import { Textarea } from "@/components/ui/textarea"
import {
  createReportSectionWizardHref,
  type WorkflowReportSectionKey,
} from "@/features/report-wizard/config/report-routing"
import { getReportContextActionVisibility } from "@/features/workspace/config/report-context"
import { amendReport, getReportDetail, requestReportReopening } from "../api"
import { formatReportPeriod, reportPeriodHref } from "../format"
import { REPORT_SECTIONS } from "../types"
import { ReportStatusBadge } from "./ReportStatusBadge"

function isWorkflowSectionKey(value: string | null): value is WorkflowReportSectionKey {
  return Boolean(value && REPORT_SECTIONS.some((section) => section.key === value))
}

function inferWorkflowSection(pathname: string, expenseType: string | null): WorkflowReportSectionKey | null {
  if (pathname.startsWith("/finance/tithes")) return "tithes"
  if (pathname.startsWith("/finance/revenue")) return "revenue"
  if (pathname.startsWith("/finance/expenses")) {
    return expenseType === "operating" ? "operating_expenses" : "activity_other_expenses"
  }
  if (pathname.startsWith("/engagement/attendance/sunday-school")) return "sunday_school_attendance"
  if (pathname.startsWith("/engagement/attendance")) return "general_attendance"
  return null
}

export function ReportSourceBanner() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const queryClient = useQueryClient()
  const reportId = Number(
    searchParams.get("report_id")
      ?? searchParams.get("reportId")
      ?? searchParams.get("reportid")
      ?? searchParams.get("id"),
  )
  const requestedSection = searchParams.get("section")
  const section = isWorkflowSectionKey(requestedSection)
    ? requestedSection
    : inferWorkflowSection(pathname, searchParams.get("type"))
  const [dialog, setDialog] = React.useState<"amend" | "reopen" | null>(null)
  const [reason, setReason] = React.useState("")
  const query = useQuery({
    queryKey: ["reports-workflow", "source-banner", reportId],
    queryFn: () => getReportDetail(reportId),
    enabled: Number.isFinite(reportId) && reportId > 0,
  })
  const mutation = useMutation({
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
        router.push(createReportSectionWizardHref(isWorkflowSectionKey(section) ? section : "review", {
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

  if (!query.data) return null

  const report = query.data
  const visibility = getReportContextActionVisibility(report.status, report.capabilities)
  const reportHref = reportPeriodHref(report.period_start)
  const submittedSectionHref = isWorkflowSectionKey(section)
    ? `/reports/submitted/${reportId}/${section}?return_to=${encodeURIComponent(reportHref)}`
    : reportHref
  const wizardHref = isWorkflowSectionKey(section)
    ? createReportSectionWizardHref(section, {
        report_id: reportId,
        amendment_context: report.status === "reopened" ? "reopened" : null,
      })
    : null

  return (
    <>
      <Alert className="mb-4 rounded-xl border-primary/20 bg-primary/5">
        <FileCheck2 className="size-4" />
        <AlertTitle className="flex flex-wrap items-center gap-2">
          Source records for the {formatReportPeriod(report.period_start)} Monthly Report
          <ReportStatusBadge status={report.status} />
        </AlertTitle>
        <AlertDescription className="mt-2 flex flex-wrap items-center justify-between gap-3">
          <span>
            {visibility.editInWizard
              ? "Review these operational records here; make report-period changes in the Report Wizard."
              : "These are live operational records. The submitted report remains an immutable snapshot."}
          </span>
          <span className="flex flex-wrap gap-2">
            {visibility.editInWizard && wizardHref ? (
              <Button asChild size="sm"><Link href={wizardHref}>Edit in Report Wizard <ArrowRight className="size-4" /></Link></Button>
            ) : null}
            {visibility.viewSubmittedSection ? (
              <Button asChild variant="outline" size="sm"><Link href={submittedSectionHref}>View submitted section</Link></Button>
            ) : null}
            <Button asChild variant="outline" size="sm"><Link href={reportHref}>View report</Link></Button>
            {visibility.amendReport ? (
              <Button variant="outline" size="sm" onClick={() => setDialog("amend")}>Amend report</Button>
            ) : null}
            {visibility.requestReopening ? (
              <Button variant="outline" size="sm" onClick={() => setDialog("reopen")}>Request reopening</Button>
            ) : null}
          </span>
        </AlertDescription>
      </Alert>

      <Dialog open={dialog !== null} onOpenChange={(open) => !open && setDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{dialog === "amend" ? "Amend monthly report" : "Request report reopening"}</DialogTitle>
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
              disabled={!reason.trim() || mutation.isPending}
              onClick={() => mutation.mutate()}
            >
              {mutation.isPending ? <Loader2 className="size-4 animate-spin" /> : null}
              {dialog === "amend" ? "Start amendment" : "Send request"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
