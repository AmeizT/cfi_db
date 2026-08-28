"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CheckCircle2Icon,
  DatabaseIcon,
  DownloadIcon,
  Loader2Icon,
  SkipForwardIcon,
} from "lucide-react";
import { toast } from "sonner";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { Textarea } from "@/components/ui/textarea";
import { CentralCreateWorkspace } from "@/features/central-create/components/CentralCreateWorkspace";
import { YearReportProgress } from "@/features/central-create/components/YearReportProgress";
import { FinancialEntriesForm } from "@/features/manual-entry/components/FinancialEntriesForm";
import { SundaySchoolAttendanceForm } from "@/features/people/sunday-school/views/SundaySchoolAttendanceView";
import { ReportWizardFooter } from "@/features/report-wizard/components/ReportWizardFooter";
import { ReportWizardHeader } from "@/features/report-wizard/components/ReportWizardHeader";
import { ReportWizardSectionCard } from "@/features/report-wizard/components/ReportWizardSectionCard";
import { ReportWizardSidebar } from "@/features/report-wizard/components/ReportWizardSidebar";
import {
  REPORT_WIZARD_SECTIONS,
  createCentralTemplatesHref,
  createReportWizardHref,
  formatReportWizardPeriod,
  getReportWizardSectionByRoute,
  getReportWizardSectionDisplayLabel,
  getReportWizardSections,
  isPartialReportWizardReport,
  toReportWizardList,
  type ReportWizardMethod,
  type ReportWizardReport,
  type ReportWizardSection,
  type ReportWizardSectionSnapshot,
  type ReportWizardUploadType,
} from "@/features/report-wizard/config/report-types";
import AttendanceFormView from "@/features/reports/core/forms/attendance/views/AttendanceFormView";
import { useReports } from "@/features/reports/core/hooks/use-reports";
import {
  getReportDetail,
  submitReport,
  updateReportSection,
} from "@/features/reports/workflow/api"
import {
  formatReportPeriod,
  reportPeriodHref,
} from "@/features/reports/workflow/format";
import { UploadEngine } from "@/features/uploads/components/UploadEngine";

const SKIP_REASONS = [
  { value: "records_unavailable", label: "Records unavailable" },
  {
    value: "responsible_person_unavailable",
    label: "Responsible person unavailable",
  },
  { value: "technical_problem", label: "Technical problem" },
  {
    value: "activity_did_not_take_place",
    label: "Activity did not take place",
  },
  { value: "information_pending", label: "Information pending" },
  { value: "other", label: "Other" },
];

const SECTION_DESCRIPTIONS: Record<string, string> = {
  attendance: "Record weekly service attendance for this reporting period.",
  "sunday-school":
    "Record Sunday School classes, children, visitors, first timers, and offerings.",
  tithes: "Record individual gifts received during this reporting period.",
  revenue: "Record income received outside regular tithe entries.",
  expenses: "Record activity costs and other non-operating expenses.",
  overhead: "Record the assembly's regular operating expenses.",
  review:
    "Check every report section, resolve any findings, and submit the official report.",
};

function normalizeMethod(value: string | null): ReportWizardMethod {
  if (value === "upload") return "upload";
  if (value === "web-form") return "web-form";
  if (value === "quick-entry") return "quick-entry";
  return "manual-entry";
}

function normalizeUploadType(value: string | null): ReportWizardUploadType {
  if (value === "csv") return "csv";
  if (value === "ocr") return "ocr";
  if (value === "photo") return "photo";
  return "excel";
}

function workflowSnapshots(
  report: Awaited<ReturnType<typeof getReportDetail>> | undefined,
): ReportWizardSectionSnapshot[] {
  if (!report) return [];
  return report.sections.map((section) => ({
    id: section.id ?? undefined,
    name: section.key,
    status: section.status,
    reason: section.skip_reason_detail,
  }));
}

function ManualEntryPanel({
  section,
  report,
  reportId,
  period: requestedPeriod,
}: {
  section: ReportWizardSection;
  report: ReportWizardReport | null;
  reportId: string | null;
  period?: string;
}) {
  const period =
    requestedPeriod ??
    report?.period_start?.slice(0, 7) ??
    new Date().toISOString().slice(0, 7);
  const effectiveReportId = report?.id ?? reportId ?? undefined;

  if (section.id === "review") {
    return <ReviewSubmitPanel reportId={reportId} />;
  }
  if (section.id === "sunday-school") {
    return (
      <SundaySchoolAttendanceForm
        period={period}
        reportId={effectiveReportId}
      />
    );
  }
  if (section.id === "attendance") {
    return <AttendanceFormView period={period} reportId={effectiveReportId} />;
  }

  const kind =
    section.id === "tithes"
      ? "tithes"
      : section.id === "revenue"
        ? "revenue"
        : section.id === "overhead"
          ? "overhead"
          : "expenses";

  return (
    <FinancialEntriesForm
      kind={kind}
      period={period}
      reportId={effectiveReportId}
    />
  );
}

function ReviewSubmitPanel({ reportId }: { reportId: string | null }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [declaration, setDeclaration] = React.useState(false);
  const numericReportId = Number(reportId);
  const reportQuery = useQuery({
    queryKey: ["reports-workflow", "wizard-review", numericReportId],
    queryFn: () => getReportDetail(numericReportId),
    enabled: Number.isFinite(numericReportId) && numericReportId > 0,
  });
  const mutation = useMutation({
    mutationFn: () => submitReport(numericReportId, declaration),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reports-workflow"] });
      toast.success("Official report submitted");
      if (reportQuery.data) {
        router.push(reportPeriodHref(reportQuery.data.period_start));
      }
    },
    onError: (error) => toast.error(error.message),
  });

  if (!reportId) {
    return (
      <Alert>
        <AlertTitle>Select a report to review</AlertTitle>
        <AlertDescription>
          Open this step from a monthly report so its report ID is preserved.
        </AlertDescription>
      </Alert>
    );
  }
  if (reportQuery.isLoading) {
    return <div className="h-64 animate-pulse rounded-xl bg-muted" />;
  }
  if (reportQuery.isError || !reportQuery.data) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Report review could not be loaded</AlertTitle>
        <AlertDescription>{reportQuery.error?.message}</AlertDescription>
      </Alert>
    );
  }

  const report = reportQuery.data;
  return (
    <div className="space-y-5">
      <p className="text-sm font-medium text-muted-foreground">
        {formatReportPeriod(report.period_start)} · {report.assembly.name}
      </p>
      <div className="divide-y divide-border overflow-hidden rounded-xl border border-border">
        {report.sections.map((item) => (
          <div
            key={item.key}
            className="flex items-center justify-between gap-4 px-4 py-3 text-sm"
          >
            <span className="font-medium">
              {getReportWizardSectionDisplayLabel(item.key, item.label)}
            </span>
            <span
              className={
                item.status === "not_required"
                  ? "text-muted-foreground"
                  : item.status === "no_activity"
                    ? "text-cyan-700 dark:text-cyan-300"
                    : item.resolved
                      ? "text-emerald-700 dark:text-emerald-400"
                      : "text-amber-700 dark:text-amber-400"
              }
            >
              {item.status === "not_required"
                ? "Not required"
                : item.status === "no_activity"
                  ? "No activity"
                  : item.resolved
                    ? "Resolved"
                    : "Needs attention"}
            </span>
          </div>
        ))}
      </div>
      {report.findings.length ? (
        <Alert variant="destructive">
          <AlertTitle>Resolve blocking findings</AlertTitle>
          <AlertDescription>
            {report.findings.map((finding) => finding.message).join(" ")}
          </AlertDescription>
        </Alert>
      ) : null}
      <label className="flex items-start gap-3 rounded-xl border border-border p-4 text-sm">
        <Checkbox
          checked={declaration}
          onCheckedChange={(checked) => setDeclaration(checked === true)}
        />
        <span>
          I confirm that this report is complete and accurate to the best of my
          knowledge.
        </span>
      </label>
      <Button
        disabled={
          !report.capabilities.can_submit || !declaration || mutation.isPending
        }
        onClick={() => mutation.mutate()}
      >
        {mutation.isPending ? (
          <Loader2Icon className="size-4 animate-spin" />
        ) : null}
        Submit official report
      </Button>
    </div>
  );
}

function UploadPanel({ section }: { section: ReportWizardSection }) {
  if (!section.uploadUrl) {
    return (
      <Alert>
        <AlertTitle>Upload unavailable</AlertTitle>
        <AlertDescription>
          This section does not have a supported file-processing service yet.
          Use Manual entry for this section.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-base font-semibold">Upload report files</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          The file type is detected automatically. Review extracted values before
          they are added to the report.
        </p>
      </div>
      <UploadEngine
        config={{
          type: section.uploadType ?? section.id,
          uploadUrl: section.uploadUrl,
          imageUploadUrl: section.imageUploadUrl,
          templateUrl: section.templateUrl,
          columns: [],
        }}
      />
      {section.templateUrl ? (
        <Button variant="outline" asChild>
          <a href={section.templateUrl} download>
            <DownloadIcon className="size-4" aria-hidden="true" />
            Download blank template
          </a>
        </Button>
      ) : null}
    </div>
  );
}

function NoActivityDeclaration({
  section,
  reportId,
  periodLabel,
  confirmed,
  editable,
}: {
  section: ReportWizardSection;
  reportId: string;
  periodLabel: string;
  confirmed: boolean;
  editable: boolean;
}) {
  const queryClient = useQueryClient();
  const [declared, setDeclared] = React.useState(false);
  const mutation = useMutation({
    mutationFn: (status: "no_activity" | "not_started") =>
      updateReportSection(Number(reportId), section.backendId, {
        status,
        ...(status === "no_activity"
          ? { no_activity_note: `Confirmed no activity for ${periodLabel}.` }
          : {}),
      }),
    onSuccess: async (_, status) => {
      setDeclared(false);
      toast.success(
        status === "no_activity"
          ? `${section.label} marked as no activity`
          : `${section.label} is ready for entry`,
      );
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["reports"] }),
        queryClient.invalidateQueries({ queryKey: ["reports-workflow"] }),
      ]);
    },
    onError: (error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : "The section state could not be updated.",
      );
    },
  });

  if (confirmed) {
    return (
      <div className="rounded-xl border border-border bg-muted/20 p-5">
        <div className="flex items-start gap-3">
          <CheckCircle2Icon
            className="mt-0.5 size-5 shrink-0 text-emerald-600"
            aria-hidden="true"
          />
          <div>
            <h2 className="font-semibold">Marked as no activity</h2>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              You confirmed there was no activity to record for {periodLabel}.
            </p>
          </div>
        </div>
        {editable ? (
          <Button
            type="button"
            variant="outline"
            className="mt-4"
            disabled={mutation.isPending}
            onClick={() => mutation.mutate("not_started")}
          >
            {mutation.isPending ? (
              <Loader2Icon className="size-4 animate-spin" />
            ) : null}
            Undo — I need to enter activity
          </Button>
        ) : null}
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border p-4">
      <label className="flex items-start gap-3 text-sm">
        <Checkbox
          checked={declared}
          disabled={!editable || mutation.isPending}
          onCheckedChange={(checked) => setDeclared(checked === true)}
        />
        <span>There was no activity to record for this section.</span>
      </label>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="mt-4"
        disabled={!editable || !declared || mutation.isPending}
        onClick={() => mutation.mutate("no_activity")}
      >
        {mutation.isPending ? (
          <Loader2Icon className="size-4 animate-spin" />
        ) : null}
        Confirm no activity
      </Button>
    </div>
  );
}

function SkipSectionDialog({
  open,
  section,
  reportId,
  onOpenChange,
}: {
  open: boolean;
  section: ReportWizardSection;
  reportId: string | null;
  onOpenChange: (open: boolean) => void;
}) {
  const queryClient = useQueryClient();
  const [reason, setReason] = React.useState(SKIP_REASONS[0].value);
  const [notes, setNotes] = React.useState("");
  const skipMutation = useMutation({
    mutationFn: async () => {
      if (!reportId) {
        throw new Error("This section is not attached to a report yet.");
      }
      await updateReportSection(Number(reportId), section.backendId, {
        status: "skipped",
        skip_reason_code: reason,
        skip_reason_detail: notes.trim(),
      });
    },
    onSuccess: async () => {
      toast.success(`${section.label} skipped`);
      onOpenChange(false);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["reports"] }),
        queryClient.invalidateQueries({ queryKey: ["reports-workflow"] }),
      ]);
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Could not skip this section.",
      );
    },
  });

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!notes.trim()) {
      toast.error("Enter a reason note before skipping this section.");
      return;
    }
    skipMutation.mutate();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Skip {section.label}</DialogTitle>
          <DialogDescription>
            A skipped section remains part of the report and is visible in
            compliance review.
          </DialogDescription>
        </DialogHeader>
        <form className="grid gap-4" onSubmit={handleSubmit}>
          <div className="grid gap-2">
            <Label htmlFor="skip-reason">Reason</Label>
            <NativeSelect
              id="skip-reason"
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
            <Label htmlFor="skip-notes">Notes</Label>
            <Textarea
              id="skip-notes"
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
  );
}

export function ReportWizardView({ section: sectionParam }: { section: string }) {
  const searchParams = useSearchParams();
  const [skipOpen, setSkipOpen] = React.useState(false);
  const section = getReportWizardSectionByRoute(sectionParam);
  const method = normalizeMethod(searchParams.get("method"));
  const uploadType = normalizeUploadType(searchParams.get("upload_type"));
  const reportId = searchParams.get("report_id");
  const amendmentContext = searchParams.get("amendment_context");
  const reportsQuery = useReports({ year: String(new Date().getFullYear()) });
  const reports = React.useMemo(
    () => toReportWizardList(reportsQuery.data),
    [reportsQuery.data],
  );
  const numericReportId = Number(reportId);
  const workflowReportQuery = useQuery({
    queryKey: ["reports-workflow", "wizard-report", numericReportId],
    queryFn: () => getReportDetail(numericReportId),
    enabled: Number.isFinite(numericReportId) && numericReportId > 0,
  });
  const activeReport = React.useMemo(() => {
    if (reportId) {
      return reports.find((report) => String(report.id) === reportId) ?? null;
    }
    return reports.find(isPartialReportWizardReport) ?? null;
  }, [reportId, reports]);
  const workflowSections = React.useMemo(
    () => workflowSnapshots(workflowReportQuery.data),
    [workflowReportQuery.data],
  );
  const sectionSnapshots = workflowSections.length
    ? workflowSections
    : activeReport
      ? getReportWizardSections(activeReport)
      : [];
  const workflowSection = workflowReportQuery.data?.sections.find(
    (item) => item.key === section.backendId,
  );
  const sectionIsNotRequired = workflowSection?.status === "not_required";
  const sectionHasNoActivity = workflowSection?.status === "no_activity";
  const showNoActivityDeclaration = Boolean(
    reportId &&
      workflowSection &&
      workflowSection.record_count === 0 &&
      section.canConfirmNoActivity === true &&
      !sectionIsNotRequired &&
      section.id !== "review",
  );
  const periodLabel = workflowReportQuery.data
    ? formatReportPeriod(workflowReportQuery.data.period_start)
    : activeReport
      ? formatReportWizardPeriod(activeReport)
      : "Current period";
  const reportTitle = `${periodLabel} Monthly Report`;
  const sectionIndex = REPORT_WIZARD_SECTIONS.findIndex(
    (item) => item.id === section.id,
  );
  const nextSection = REPORT_WIZARD_SECTIONS[sectionIndex + 1];
  const backSection = REPORT_WIZARD_SECTIONS[sectionIndex - 1];
  const routeOptions = {
    method,
    upload_type: method === "upload" ? uploadType : null,
    report_id: reportId,
    amendment_context: amendmentContext,
  } as const;
  const backHref = backSection
    ? createReportWizardHref(backSection.id, routeOptions)
    : null;
  const nextHref = nextSection
    ? createReportWizardHref(nextSection.id, routeOptions)
    : null;
  const reportHref = createReportWizardHref(section.id, routeOptions);
  const templatesHref = createCentralTemplatesHref(section.id, routeOptions);
  const reportPeriodStart = workflowReportQuery.data?.period_start ?? activeReport?.period_start ?? null;
  const reportYear = reportPeriodStart
    ? new Date(`${reportPeriodStart}T00:00:00`).getFullYear()
    : new Date().getFullYear();

  const sidebar = (
    <ReportWizardSidebar
      steps={REPORT_WIZARD_SECTIONS}
      current={section}
      sections={sectionSnapshots}
      periodLabel={periodLabel}
      method={method}
      uploadType={uploadType}
      reportId={reportId}
      amendmentContext={amendmentContext}
      className="h-full rounded-none border-0 shadow-none xl:rounded-2xl xl:border xl:shadow-elevation-01"
    />
  );

  return (
    <CentralCreateWorkspace
      active="report"
      reportHref={reportHref}
      templatesHref={templatesHref}
      modeSwitcher={(
        <ReportWizardHeader
          section={section}
          method={method}
          uploadType={uploadType}
          reportId={reportId}
          amendmentContext={amendmentContext}
        />
      )}
      topbarProgress={(
        <YearReportProgress
          year={reportYear}
          activeReportId={reportId}
          activePeriodStart={reportPeriodStart}
          method={method}
          uploadType={uploadType}
          amendmentContext={amendmentContext}
        />
      )}
      contextPanel={sidebar}
      contextLabel="Report steps"
      mainClassName="bg-background"
    >
      <div className="flex min-h-full min-w-0 flex-col">
        <div className="flex items-start gap-3 border-b border-border-subtle px-4 py-5 sm:px-6">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            <DatabaseIcon className="size-5" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <h1 className="text-xl font-bold tracking-tight text-foreground">
              Create Report
            </h1>
            <p className="mt-1 truncate text-sm text-muted-foreground">
              {reportTitle}
            </p>
          </div>
        </div>

        <div className="min-w-0 flex-1 p-3 pb-24 sm:p-5 sm:pb-28 lg:p-6 lg:pb-28">
          <ReportWizardSectionCard
            title={section.label}
            description={SECTION_DESCRIPTIONS[section.id] ?? "Complete this report section."}
          >
            {sectionIsNotRequired ? (
              <Alert>
                <AlertTitle>Not required</AlertTitle>
                <AlertDescription>
                  Sunday School reporting begins in September 2026. No entry or declaration is needed for this period.
                </AlertDescription>
              </Alert>
            ) : sectionHasNoActivity && reportId ? (
              <NoActivityDeclaration
                section={section}
                reportId={reportId}
                periodLabel={periodLabel}
                confirmed
                editable={Boolean(workflowReportQuery.data?.capabilities.is_editable)}
              />
            ) : section.id === "review" ? (
              <ReviewSubmitPanel reportId={reportId} />
            ) : (
              <div className="space-y-6">
                {method === "upload" && section.uploadUrl ? (
                  <UploadPanel section={section} />
                ) : (
                  <ManualEntryPanel
                    section={section}
                    report={activeReport}
                    reportId={reportId}
                    period={workflowReportQuery.data?.period_start.slice(0, 7)}
                  />
                )}
                {showNoActivityDeclaration && reportId ? (
                  <NoActivityDeclaration
                    section={section}
                    reportId={reportId}
                    periodLabel={periodLabel}
                    confirmed={false}
                    editable={Boolean(workflowReportQuery.data?.capabilities.is_editable)}
                  />
                ) : null}
              </div>
            )}
          </ReportWizardSectionCard>
        </div>

        <ReportWizardFooter
          backHref={backHref}
          nextHref={nextHref}
          nextLabel={nextSection ? `Continue to ${nextSection.navigationLabel ?? nextSection.label}` : undefined}
          canSkip={Boolean(reportId) && section.id !== "review" && !sectionIsNotRequired && !sectionHasNoActivity}
          onSkip={() => setSkipOpen(true)}
        />
      </div>

      <SkipSectionDialog
        key={skipOpen ? "skip-open" : "skip-closed"}
        open={skipOpen}
        section={section}
        reportId={reportId}
        onOpenChange={setSkipOpen}
      />
    </CentralCreateWorkspace>
  );
}
