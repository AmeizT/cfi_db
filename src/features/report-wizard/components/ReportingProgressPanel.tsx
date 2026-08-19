"use client";

import {
  AlertTriangleIcon,
  CheckCircle2Icon,
  CloudCheckIcon,
  SendIcon,
} from "lucide-react";

import { Progress } from "@/components/ui/progress";
import {
  REPORT_WIZARD_SECTIONS,
  type ReportWizardReport,
  type ReportWizardSectionSnapshot,
} from "@/features/report-wizard/config/report-types";
import type { WorkflowReport } from "@/features/reports/workflow/types";
import { cn } from "@/lib/utils";

type ReportingProgressPanelProps = {
  report?: WorkflowReport | null;
  fallbackReport?: ReportWizardReport | null;
  sections?: ReportWizardSectionSnapshot[];
  periodLabel: string;
  loading?: boolean;
  className?: string;
};

type ProgressState =
  | "completed"
  | "in_progress"
  | "skipped"
  | "attention"
  | "pending";

function normalizeStatus(status?: string, resolved?: boolean): ProgressState {
  if (status === "submitted" || status === "completed" || status === "no_activity") {
    return "completed";
  }
  if (status === "skipped") return "skipped";
  if (status === "in_progress") return "in_progress";
  if (status === "error" || (resolved === false && status !== "not_started")) {
    return "attention";
  }
  return "pending";
}

export function ReportingProgressPanel({
  report,
  fallbackReport,
  sections = [],
  periodLabel,
  loading = false,
  className,
}: ReportingProgressPanelProps) {
  const rows = REPORT_WIZARD_SECTIONS.map((section) => {
    if (section.id === "review") {
      const submitted = report?.status === "submitted" || report?.status === "locked";
      const ready = Boolean(report?.capabilities.can_submit);
      return {
        key: section.id,
        label: section.label,
        state: submitted ? "completed" : ready ? "in_progress" : "pending",
      } satisfies { key: string; label: string; state: ProgressState };
    }

    const workflowSection = report?.sections.find(
      (item) => item.key === section.backendId || item.name === section.backendId,
    );
    const snapshot = sections.find((item) => item.name === section.backendId);
    return {
      key: section.id,
      label: section.label,
      state: normalizeStatus(
        workflowSection?.status ?? snapshot?.status,
        workflowSection?.resolved,
      ),
    } satisfies { key: string; label: string; state: ProgressState };
  });

  const completed = rows.filter((item) => item.state === "completed").length;
  const skipped = rows.filter((item) => item.state === "skipped").length;
  const attentionRows = rows.filter((item) => item.state === "attention");
  const blockingFindings = report?.findings.filter((finding) => finding.blocking) ?? [];
  const attentionCount = Math.max(attentionRows.length, blockingFindings.length);
  const calculatedProgress = Math.round(((completed + skipped) / rows.length) * 100);
  const progress = Math.max(
    0,
    Math.min(100, report?.completion_percentage ?? calculatedProgress),
  );
  const assemblyName = report?.assembly.name ?? fallbackReport?.assembly?.name;

  return (
    <section
      aria-labelledby="report-progress-title"
      className={cn(
        "flex min-h-0 w-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-5">
        <div className="min-w-0">
          <h2 id="report-progress-title" className="font-bold text-foreground">
            Report Progress
          </h2>
          {assemblyName ? (
            <p className="mt-0.5 truncate text-xs text-muted-foreground">
              {assemblyName}
            </p>
          ) : null}
        </div>
        <span className="shrink-0 rounded-full border border-border bg-background px-3 py-1 text-xs font-semibold">
          {periodLabel}
        </span>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
        {loading ? (
          <div className="grid gap-3" aria-label="Loading report progress">
            <div className="h-5 w-2/3 animate-pulse rounded bg-muted" />
            <div className="h-2 animate-pulse rounded bg-muted" />
            <div className="h-28 animate-pulse rounded-xl bg-muted" />
          </div>
        ) : (
          <div className="space-y-6">
            <div className="rounded-xl border border-border bg-background p-4">
              <div className="flex items-center justify-between text-sm font-semibold">
                <span>Overall progress</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="mt-3 h-2" />
              <p className="mt-3 text-xs text-muted-foreground">
                {completed} of {rows.length} steps completed
                {skipped ? ` · ${skipped} skipped` : ""}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-border bg-background p-3">
                <CheckCircle2Icon className="size-4 text-emerald-600" aria-hidden="true" />
                <p className="mt-2 text-xl font-bold">{completed}</p>
                <p className="text-xs text-muted-foreground">Completed</p>
              </div>
              <div className="rounded-xl border border-border bg-background p-3">
                <AlertTriangleIcon
                  className={cn(
                    "size-4",
                    attentionCount ? "text-destructive" : "text-muted-foreground",
                  )}
                  aria-hidden="true"
                />
                <p className="mt-2 text-xl font-bold">{attentionCount}</p>
                <p className="text-xs text-muted-foreground">Need attention</p>
              </div>
            </div>

            {attentionCount ? (
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                  Attention needed
                </h3>
                <ul className="mt-2 grid gap-2">
                  {blockingFindings.slice(0, 3).map((finding, index) => (
                    <li
                      key={`${finding.code}-${index}`}
                      className="rounded-lg bg-destructive/5 px-3 py-2 text-xs leading-5 text-destructive"
                    >
                      {finding.message}
                    </li>
                  ))}
                  {!blockingFindings.length
                    ? attentionRows.slice(0, 3).map((item) => (
                        <li
                          key={item.key}
                          className="rounded-lg bg-destructive/5 px-3 py-2 text-xs text-destructive"
                        >
                          {item.label} needs review
                        </li>
                      ))
                    : null}
                </ul>
              </div>
            ) : null}

            <div className="space-y-2 border-t border-border pt-4">
              <div className="flex items-start gap-3 rounded-lg px-2 py-2">
                <CloudCheckIcon className="mt-0.5 size-4 shrink-0 text-emerald-600" aria-hidden="true" />
                <div>
                  <p className="text-sm font-semibold">Progress saved</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Changes are saved by each report form.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-lg px-2 py-2">
                <SendIcon className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
                <div>
                  <p className="text-sm font-semibold">
                    {report?.capabilities.can_submit
                      ? "Ready for submission"
                      : "Submission checks pending"}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {report?.capabilities.can_submit
                      ? "Review the declaration before submitting."
                      : "Complete required sections and resolve blocking findings."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
