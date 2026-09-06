"use client";

import Link from "next/link";
import { SendIcon, XCircleIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  getResolvedReportSectionCount,
  type ReportWizardMethod,
  type ReportWizardSection,
  type ReportWizardSectionSnapshot,
  type ReportWizardUploadType,
} from "@/features/report-wizard/config/report-types";

import { createMonthlyReportHref } from "./routing";

type StepState =
  | "current"
  | "completed"
  | "no-activity"
  | "not-required"
  | "in-progress"
  | "skipped"
  | "error"
  | "pending";

type ReportProgressRailProps = {
  steps: ReportWizardSection[];
  current: ReportWizardSection;
  sections: ReportWizardSectionSnapshot[];
  periodLabel: string;
  method: ReportWizardMethod;
  uploadType: ReportWizardUploadType;
  reportId?: string | number | null;
  amendmentContext?: string | null;
  className?: string;
};

const stateStyles: Record<StepState, string> = {
  current: "bg-primary/10 text-primary ring-1 ring-inset ring-primary/15",
  completed: "text-foreground hover:bg-accent",
  "no-activity": "text-cyan-700 hover:bg-cyan-50 dark:text-cyan-300 dark:hover:bg-cyan-950/40",
  "not-required": "text-muted-foreground hover:bg-accent",
  "in-progress": "text-primary hover:bg-primary/5",
  skipped: "text-amber-700 dark:text-amber-400",
  error: "bg-destructive/5 text-destructive",
  pending: "text-muted-foreground hover:bg-accent hover:text-foreground",
};

function StepIndicator({
  state,
  stepNumber,
  review,
}: {
  state: StepState;
  stepNumber: number;
  review: boolean;
}) {
  if (review) {
    return (
      <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-300">
        <SendIcon className="size-4" aria-hidden="true" />
      </span>
    );
  }
  if (state === "error") {
    return (
      <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-destructive/10 text-destructive">
        <XCircleIcon className="size-4" aria-hidden="true" />
      </span>
    );
  }

  const indicatorClass =
    state === "completed"
      ? "bg-emerald-500 text-white dark:bg-emerald-600"
      : state === "skipped"
        ? "bg-amber-500 text-white dark:bg-amber-600"
        : state === "no-activity"
          ? "bg-cyan-500 text-white dark:bg-cyan-600"
          : state === "current"
            ? "bg-primary text-primary-foreground shadow-sm"
            : "border border-border bg-muted text-muted-foreground";

  return (
    <span
      className={cn(
        "flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-bold",
        indicatorClass,
      )}
    >
      {stepNumber}
    </span>
  );
}

function getStepState(
  step: ReportWizardSection,
  current: ReportWizardSection,
  snapshot?: ReportWizardSectionSnapshot,
): StepState {
  if (step.id === current.id) return "current";
  if (snapshot?.status === "submitted" || snapshot?.status === "completed") return "completed";
  if (snapshot?.status === "no_activity") return "no-activity";
  if (snapshot?.status === "not_required") return "not-required";
  if (snapshot?.status === "skipped") return "skipped";
  if (snapshot?.status === "error") return "error";
  if (snapshot?.status === "in_progress") return "in-progress";
  return "pending";
}

function stepDescription(state: StepState) {
  if (state === "current") return "In progress";
  if (state === "completed") return "Completed";
  if (state === "no-activity") return "No activity";
  if (state === "not-required") return "Not required";
  if (state === "skipped") return "Skipped";
  if (state === "error") return "Needs attention";
  if (state === "in-progress") return "In progress";
  return "Not started";
}

export function ReportProgressRail({
  steps,
  current,
  sections,
  periodLabel,
  method,
  uploadType,
  reportId,
  amendmentContext,
  className,
}: ReportProgressRailProps) {
  const resolvedCount = getResolvedReportSectionCount(sections);

  return (
    <aside
      aria-label="Report progress"
      className={cn(
        "flex min-h-0 w-full flex-col overflow-hidden rounded-2xl border border-border-subtle bg-background p-3 shadow-elevation-01",
        className,
      )}
    >
      <div className="shrink-0 border-b border-border-subtle px-3 pb-4 pt-2">
        <p className="text-xs font-semibold text-primary">Report progress</p>
        <h2 className="mt-2 text-xl font-bold tracking-tight text-foreground">
          {periodLabel} Report
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Step {Math.max(steps.findIndex((step) => step.id === current.id) + 1, 1)} of {steps.length}
          {" · "}{resolvedCount} resolved
        </p>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain py-3 pr-1 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-zinc-300">
        <ol className="grid gap-0.5">
          {steps.map((step, index) => {
            const snapshot = sections.find((item) => item.name === step.backendId);
            const state = getStepState(step, current, snapshot);
            const description = step.id === "review"
              ? `${resolvedCount} of ${steps.length} resolved`
              : stepDescription(state);

            return (
              <li key={step.id} className={cn(step.id === "review" && "mt-3 border-t border-border pt-3")}>
                <Link
                  href={createMonthlyReportHref(step.id, {
                    method,
                    upload_type: method === "upload" ? uploadType : null,
                    report_id: reportId,
                    amendment_context: amendmentContext,
                  })}
                  scroll={false}
                  aria-current={state === "current" ? "step" : undefined}
                  className={cn(
                    "group flex min-w-0 items-center gap-3 rounded-xl px-3 py-2.5 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                    stateStyles[state],
                  )}
                >
                  <StepIndicator state={state} stepNumber={index + 1} review={step.id === "review"} />
                  <span className="flex min-w-0 flex-col gap-0.5">
                    <span className="text-sm font-semibold leading-5 text-current">
                      {step.navigationLabel ?? step.label}
                    </span>
                    <span className="text-xs leading-4 text-current opacity-70">{description}</span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ol>
      </div>

      <div className="mt-2 shrink-0 rounded-xl border border-primary/15 bg-primary/5 p-4">
        <p className="text-xs leading-5 text-muted-foreground">
          After submission, you can request to reopen and edit the report during
          the grace period. Once locked, it becomes read-only.
        </p>
      </div>
    </aside>
  );
}
