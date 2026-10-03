"use client";

import * as React from "react";
import Link from "next/link";
import { SkippedSectionNotice } from "@/features/reports/workflow/components/SkippedSectionNotice";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CheckCircle2Icon,
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
import { FinancialUploadReview } from "@/features/manual-entry/components/FinancialUploadReview";
import { FinancialEntriesForm } from "@/features/manual-entry/components/FinancialEntriesForm";
import { SundaySchoolAttendanceForm } from "@/features/people/sunday-school/views/SundaySchoolAttendanceView";
import styles from "./monthly-report.module.css";
import {
  createCentralTemplatesHref,
  REPORT_WIZARD_SECTIONS,
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
} from "@/features/reports/workflow/api";
import { ReportStatusPopover } from "@/features/reports/workflow/components/ReportStatusPopover";
import { useReportDetail } from "@/features/reports/workflow/hooks";
import {
  formatReportPeriod,
  reportPeriodHref,
} from "@/features/reports/workflow/format";
import { UploadIllustration } from "./UploadIllustration";
import { UploadEngine } from "@/features/uploads/components/UploadEngine";

import { MonthlyReportEntryMode } from "./MonthlyReportEntryMode";
import { MonthlyReportFooter } from "./MonthlyReportFooter";
import { MonthlyReportYearProgress } from "./MonthlyReportYearProgress";
import { ReportProgressRail } from "./ReportProgressRail";
import { createMonthlyReportHref } from "./routing";

// Presentation order shared by the panel, mobile tabs, and Previous/Next.
const sectionOrder = ["attendance", "sunday-school", "tithes", "revenue", "overhead", "expenses", "review"];
const monthlyReportSections = [...REPORT_WIZARD_SECTIONS].sort((a, b) => sectionOrder.indexOf(a.id) - sectionOrder.indexOf(b.id));

const SKIP_REASONS = [
  { value: "records_unavailable", label: "Records unavailable" },
  { value: "responsible_person_unavailable", label: "Responsible person unavailable" },
  { value: "technical_problem", label: "Technical problem" },
  { value: "activity_did_not_take_place", label: "Activity did not take place" },
  { value: "information_pending", label: "Information pending" },
  { value: "other", label: "Other" },
];


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
  formId,
  onSaved,
}: {
  section: ReportWizardSection;
  report: ReportWizardReport | null;
  reportId: string | null;
  period?: string;
  formId?: string;
  onSaved?: () => void;
}) {
  const period = requestedPeriod ?? report?.period_start?.slice(0, 7) ?? new Date().toISOString().slice(0, 7);
  const effectiveReportId = report?.id ?? reportId ?? undefined;

  if (section.id === "sunday-school") {
    return <SundaySchoolAttendanceForm period={period} reportId={effectiveReportId} matrix formId={formId} onSaved={onSaved} />;
  }
  if (section.id === "attendance") {
    return <AttendanceFormView period={period} reportId={effectiveReportId} formId={formId} onSaved={onSaved} />;
  }

  const kind = section.id === "tithes"
    ? "tithes"
    : section.id === "revenue"
      ? "revenue"
      : section.id === "overhead"
        ? "overhead"
        : "expenses";

  return <FinancialEntriesForm kind={kind} period={period} reportId={effectiveReportId} inline formId={formId} onSaved={onSaved} />;
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
      if (reportQuery.data) router.push(reportPeriodHref(reportQuery.data.period_start));
    },
    onError: (error) => toast.error(error.message),
  });

  if (!reportId) {
    return (
      <Alert>
        <AlertTitle>Select a report to review</AlertTitle>
        <AlertDescription>Open this step from a monthly report so its report ID is preserved.</AlertDescription>
      </Alert>
    );
  }
  if (reportQuery.isLoading) return <div className="h-64 animate-pulse rounded-xl bg-muted" />;
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
          <div key={item.key} className="flex items-center justify-between gap-4 px-4 py-3 text-sm">
            <span className="font-medium">{getReportWizardSectionDisplayLabel(item.key, item.label)}</span>
            <span className={
              item.status === "not_required"
                ? "text-muted-foreground"
                : item.status === "no_activity"
                  ? "text-cyan-700 dark:text-cyan-300"
                  : item.resolved
                    ? "text-emerald-700 dark:text-emerald-400"
                    : "text-amber-700 dark:text-amber-400"
            }>
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
          <AlertDescription>{report.findings.map((finding) => finding.message).join(" ")}</AlertDescription>
        </Alert>
      ) : null}
      <label className="flex items-start gap-3 rounded-xl border border-border p-4 text-sm">
        <Checkbox checked={declaration} onCheckedChange={(checked) => setDeclaration(checked === true)} />
        <span>I confirm that this report is complete and accurate to the best of my knowledge.</span>
      </label>
      <Button
        disabled={!report.capabilities.can_submit || !declaration || mutation.isPending}
        onClick={() => mutation.mutate()}
      >
        {mutation.isPending ? <Loader2Icon className="size-4 animate-spin" /> : null}
        Submit official report
      </Button>
    </div>
  );
}

function UploadPanel({ section, formId, onSaved, disabled }: { section: ReportWizardSection; formId: string; onSaved: () => void; disabled: boolean }) {
  const queryClient = useQueryClient();
  const kind = section.id === "tithes" || section.id === "revenue" || section.id === "overhead" ? section.id : section.id === "expenses" ? "expenses" : null;
  if (!section.uploadUrl) {
    return (
      <Alert>
        <AlertTitle>Upload unavailable</AlertTitle>
        <AlertDescription>
          This section does not have a supported file-processing service yet. Use Manual entry for this section.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-base font-semibold">Upload report files</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          The file type is detected automatically. Review extracted values before they are added to the report.
        </p>
      </div>
      <UploadEngine disabled={disabled} onSaved={() => { void Promise.all([queryClient.invalidateQueries({ queryKey: ["assembly"] }), queryClient.invalidateQueries({ queryKey: ["reports"] }), queryClient.invalidateQueries({ queryKey: ["reports-workflow"] })]).then(onSaved); }} renderReview={kind ? props => <FinancialUploadReview {...props} kind={kind} formId={formId} /> : undefined} illustration={<UploadIllustration formats={section.imageUploadUrl ? ["XLSX", "JPEG"] : ["XLSX", "CSV"]} />} config={{
        type: section.uploadType ?? section.id,
        uploadUrl: section.uploadUrl,
        imageUploadUrl: section.imageUploadUrl,
        templateUrl: section.templateUrl,
        columns: [],
      }} />
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
        ...(status === "no_activity" ? { no_activity_note: `Confirmed no activity for ${periodLabel}.` } : {}),
      }),
    onSuccess: async (_, status) => {
      setDeclared(false);
      toast.success(status === "no_activity" ? `${section.label} marked as no activity` : `${section.label} is ready for entry`);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["reports"] }),
        queryClient.invalidateQueries({ queryKey: ["reports-workflow"] }),
      ]);
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : "The section state could not be updated."),
  });

  if (confirmed) {
    return (
      <div className="rounded-xl border border-border bg-muted/20 p-5">
        <div className="flex items-start gap-3">
          <CheckCircle2Icon className="mt-0.5 size-5 shrink-0 text-emerald-600" aria-hidden="true" />
          <div>
            <h2 className="font-semibold">Marked as no activity</h2>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              You confirmed there was no activity to record for {periodLabel}.
            </p>
          </div>
        </div>
        {editable ? (
          <Button type="button" variant="outline" className="mt-4" disabled={mutation.isPending} onClick={() => mutation.mutate("not_started")}>
            {mutation.isPending ? <Loader2Icon className="size-4 animate-spin" /> : null}
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
        {mutation.isPending ? <Loader2Icon className="size-4 animate-spin" /> : null}
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
      if (!reportId) throw new Error("This section is not attached to a report yet.");
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
    onError: (error) => toast.error(error instanceof Error ? error.message : "Could not skip this section."),
  });

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    skipMutation.mutate();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Skip {section.label}</DialogTitle>
          <DialogDescription>A skipped section remains part of the report and is visible in compliance review.</DialogDescription>
        </DialogHeader>
        <form className="grid gap-4" onSubmit={handleSubmit}>
          <div className="grid gap-2">
            <Label htmlFor="create-report-skip-reason">Reason</Label>
            <NativeSelect
              id="create-report-skip-reason"
              className="min-w-full"
              value={reason}
              onChange={(event) => setReason(event.target.value)}
            >
              {SKIP_REASONS.map((item) => (
                <NativeSelectOption key={item.value} value={item.value}>{item.label}</NativeSelectOption>
              ))}
            </NativeSelect>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="create-report-skip-notes">Notes (optional)</Label>
            <Textarea
              id="create-report-skip-notes"
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={skipMutation.isPending}>
              {skipMutation.isPending
                ? <Loader2Icon className="size-4 animate-spin" />
                : <SkipForwardIcon className="size-4" />}
              Skip section
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function MonthlyReportWorkspace({ section: sectionParam }: { section: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [skipOpen, setSkipOpen] = React.useState(false);
  const section = getReportWizardSectionByRoute(sectionParam);
  const method = normalizeMethod(searchParams.get("method"));
  const uploadType = normalizeUploadType(searchParams.get("upload_type"));
  const reportId = searchParams.get("report_id");
  const amendmentContext = searchParams.get("amendment_context");
  const reportsQuery = useReports({ year: String(new Date().getFullYear()) });
  const reports = React.useMemo(() => toReportWizardList(reportsQuery.data), [reportsQuery.data]);
  const numericReportId = Number(reportId);
  const workflowReportQuery = useReportDetail(numericReportId);
  const activeReport = React.useMemo(() => {
    if (reportId) return reports.find((report) => String(report.id) === reportId) ?? null;
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
  const workflowSection = workflowReportQuery.data?.sections.find((item) => item.key === section.backendId);
  const sectionIsNotRequired = workflowSection?.status === "not_required";
  const sectionIsSkipped = workflowSection?.status === "skipped";
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
  const sectionIndex = monthlyReportSections.findIndex((item) => item.id === section.id);
  const nextSection = monthlyReportSections[sectionIndex + 1];
  const backSection = monthlyReportSections[sectionIndex - 1];
  const routeOptions = {
    method,
    upload_type: method === "upload" ? uploadType : null,
    report_id: reportId,
    amendment_context: amendmentContext,
  } as const;
  const backHref = backSection ? createMonthlyReportHref(backSection.id, routeOptions) : null;
  const nextHref = nextSection ? createMonthlyReportHref(nextSection.id, routeOptions) : null;
  const entryFormId = `monthly-report-${section.id}-${reportId ?? "draft"}`;
  const canEdit = Boolean(workflowReportQuery.data?.capabilities.is_editable);
  const continueAfterSave = () => { if (nextHref) router.push(nextHref); };
  const reportPeriodStart = workflowReportQuery.data?.period_start ?? activeReport?.period_start ?? null;
  const reportYear = reportPeriodStart
    ? new Date(`${reportPeriodStart}T00:00:00`).getFullYear()
    : new Date().getFullYear();

  const submitFormId = canEdit && (method !== "upload" || ["tithes", "revenue", "overhead", "expenses"].includes(section.id)) && section.id !== "review" && !sectionIsSkipped && !sectionIsNotRequired && !sectionHasNoActivity ? entryFormId : undefined;
  const contentStart = React.useRef<HTMLDivElement>(null);
  const previousSection = React.useRef(section.id);
  React.useEffect(() => {
    const changed = previousSection.current !== section.id;
    previousSection.current = section.id;
    if (changed && window.matchMedia("(max-width: 1023px)").matches) {
      contentStart.current?.scrollIntoView({ block: "start", behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
    }
  }, [section.id]);

  const entryMode = <MonthlyReportEntryMode section={section} method={method} uploadType={uploadType} reportId={reportId} amendmentContext={amendmentContext} />;

  const progressRail = (
    <ReportProgressRail
      steps={monthlyReportSections}
      current={section}
      sections={sectionSnapshots}
      periodLabel={periodLabel}
      method={method}
      uploadType={uploadType}
      reportId={reportId}
      amendmentContext={amendmentContext}
      className="min-h-full"
    />
  );

  return (
    <div className="flex min-w-0 w-full max-w-full flex-col gap-4 pt-4 pb-[calc(2rem+env(safe-area-inset-bottom))] text-foreground lg:h-full lg:min-h-0 lg:overflow-hidden lg:bg-sidebar lg:p-3 lg:pt-4">
      <header className="flex shrink-0 flex-col gap-4 lg:flex-row lg:flex-wrap lg:items-center lg:justify-between">
        <div className="flex min-w-0 flex-col items-start gap-2.5 lg:flex-row lg:flex-wrap lg:items-center">
          <h1 className="text-lg font-semibold tracking-tight sm:text-xl">Monthly Report <span className="block text-muted-foreground lg:inline">{periodLabel}</span></h1>
          {workflowReportQuery.data ? <ReportStatusPopover sectionKey={section.backendId} reopenHref={createMonthlyReportHref(section.id, { ...routeOptions, amendment_context: "reopened" })} /> : null}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="order-first w-full lg:order-last lg:w-auto">
            <MonthlyReportYearProgress year={reportYear} activeReportId={reportId} activePeriodStart={reportPeriodStart} method={method} uploadType={uploadType} amendmentContext={amendmentContext} />
          </div>
          <div className="w-full lg:hidden">{entryMode}</div>
          <Button variant="outline" size="sm" className="rounded-full bg-background" asChild>
            <Link href={createCentralTemplatesHref(section.id, routeOptions)}>Templates</Link>
          </Button>
          <Button variant="outline" size="sm" className="rounded-full bg-background" disabled title="No section guide is available">Guide</Button>
        </div>
      </header>

      <div ref={contentStart} className="min-w-0 max-w-full scroll-mt-[calc(var(--mobile-navbar-height)+1rem)] lg:hidden">
        {React.cloneElement(progressRail, { compact: true, className: undefined })}
      </div>
      <main className="grid min-w-0 max-w-full grid-cols-1 items-start gap-3 lg:min-h-0 lg:flex-1 lg:grid-cols-[minmax(0,2.6fr)_minmax(0,1.15fr)] lg:grid-rows-1 lg:items-stretch">
        <section aria-labelledby="report-section-title" className="flex min-w-0 flex-col rounded-2xl bg-background lg:min-h-0 lg:overflow-y-auto lg:overscroll-contain lg:rounded-3xl">
          <div className="mx-4 flex shrink-0 items-center justify-between gap-3 border-b border-border-subtle py-4 lg:mx-6">
            <h2 id="report-section-title" className="text-lg font-semibold">{section.label}</h2>
            <div className="hidden lg:block">{entryMode}</div>
          </div>
          <div data-report-scroll="form" className="min-w-0 shrink-0 flex-1 p-2 sm:p-4 lg:px-6">
            {sectionIsSkipped && reportId ? (
              <SkippedSectionNotice reportId={reportId} section={section} editable={Boolean(workflowReportQuery.data?.capabilities.is_editable)} />
            ) : sectionIsNotRequired ? (
              <div className="space-y-4"><Alert>
                <AlertTitle>Not required</AlertTitle>
                <AlertDescription>
                  Sunday School reporting begins in September 2026. This section does not require records for this period.
                </AlertDescription>
              </Alert>
              {reportId ? <NoActivityDeclaration section={section} reportId={reportId} periodLabel={periodLabel} confirmed={false} editable={Boolean(workflowReportQuery.data?.capabilities.is_editable)} /> : null}
              </div>
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
              <fieldset disabled={!canEdit} className="min-w-0 space-y-6">
                {method === "upload" && section.uploadUrl ? (
                  <UploadPanel key={`${reportId}-${section.id}`} section={section} formId={entryFormId} onSaved={continueAfterSave} disabled={!canEdit} />
                ) : (
                  <div className={section.id === "attendance" ? styles.attendance : undefined}>
                  <ManualEntryPanel
                    key={`${reportId}-${section.id}`}
                    formId={entryFormId}
                    onSaved={continueAfterSave}
                    section={section}
                    report={activeReport}
                    reportId={reportId}
                    period={workflowReportQuery.data?.period_start.slice(0, 7)}
                  />
                  </div>
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
              </fieldset>
            )}

          </div>
          <MonthlyReportFooter
            backLabel={backSection?.navigationLabel ?? backSection?.label}
            nextStep={nextSection ? sectionIndex + 2 : undefined}
            stepCount={monthlyReportSections.length}
            submitFormId={submitFormId}
            backHref={backHref}
            nextHref={nextHref}
            nextLabel={nextSection ? `Continue to ${nextSection.navigationLabel ?? nextSection.label}` : undefined}
            canSkip={Boolean(reportId) && section.id !== "review" && !sectionIsNotRequired && !sectionHasNoActivity && !sectionIsSkipped && Boolean(workflowReportQuery.data?.capabilities.is_editable)}
            onSkip={() => setSkipOpen(true)}
          />
        </section>

        <div data-report-scroll="progress" className="hidden min-w-0 rounded-3xl lg:block lg:min-h-0 lg:overflow-y-auto lg:overscroll-contain">
          {progressRail}
        </div>
      </main>

      <SkipSectionDialog
        key={skipOpen ? "skip-open" : "skip-closed"}
        open={skipOpen}
        section={section}
        reportId={reportId}
        onOpenChange={setSkipOpen}
      />
    </div>
  );
}
