"use client";

import Link from "next/link";
import { SendIcon, XCircleIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  createReportWizardHref,
  getResolvedReportSectionCount,
  type ReportWizardMethod,
  type ReportWizardSection,
  type ReportWizardSectionSnapshot,
  type ReportWizardUploadType,
} from "@/features/report-wizard/config/report-types";

type ReportWizardStepState =
  | "current"
  | "completed"
  | "no-activity"
  | "not-required"
  | "in-progress"
  | "skipped"
  | "error"
  | "pending";

type ReportWizardSidebarProps = {
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

type ReportWizardStepItemProps = {
  step: ReportWizardSection;
  stepNumber: number;
  state: ReportWizardStepState;
  description: string;
  href: string;
  separated?: boolean;
};

const stateStyles: Record<ReportWizardStepState, string> = {
  current: "bg-primary/10 text-primary ring-1 ring-inset ring-primary/15",
  completed: "text-foreground hover:bg-accent",
  "no-activity": "text-cyan-700 hover:bg-cyan-50 dark:text-cyan-300 dark:hover:bg-cyan-950/40",
  "not-required": "text-muted-foreground hover:bg-accent",
  "in-progress": "text-primary hover:bg-primary/5",
  skipped: "text-amber-700 dark:text-amber-400",
  error: "bg-destructive/5 text-destructive",
  pending: "text-muted-foreground hover:bg-accent hover:text-foreground",
};

function ReportWizardStepIndicator({
  state,
  stepNumber,
  review,
}: {
  state: ReportWizardStepState;
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

  if (state === "completed") {
    return (
      <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-sm font-bold text-white dark:bg-emerald-600">
        <span className="sr-only">Completed: </span>{stepNumber}
      </span>
    );
  }

  if (state === "skipped") {
    return (
      <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-amber-500 text-sm font-bold text-white dark:bg-amber-600">
        <span className="sr-only">Skipped: </span>{stepNumber}
      </span>
    );
  }

  if (state === "no-activity") {
    return (
      <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-cyan-500 text-sm font-bold text-white dark:bg-cyan-600">
        <span className="sr-only">No activity: </span>{stepNumber}
      </span>
    );
  }

  if (state === "not-required") {
    return (
      <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-border bg-muted text-sm font-bold text-muted-foreground">
        <span className="sr-only">Not required: </span>{stepNumber}
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

  if (state === "current") {
    return (
      <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground shadow-sm">
        {stepNumber}
      </span>
    );
  }

  return (
    <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-bold text-muted-foreground">
      {stepNumber}
    </span>
  );
}

export function ReportWizardStepItem({
  step,
  stepNumber,
  state,
  description,
  href,
  separated = false,
}: ReportWizardStepItemProps) {
  const current = state === "current";

  return (
    <li className={cn(separated && "mt-3 border-t border-border pt-3")}>
      <Link
        href={href}
        scroll={false}
        aria-current={current ? "step" : undefined}
        className={cn(
          "group flex min-w-0 items-center gap-3 rounded-xl px-3 py-2.5 outline-none transition-colors",
          "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          stateStyles[state],
        )}
      >
        <ReportWizardStepIndicator
          state={state}
          stepNumber={stepNumber}
          review={step.id === "review"}
        />
        <span className="flex min-w-0 flex-col gap-0.5">
          <span className="text-sm font-semibold leading-5 text-current">
            {step.navigationLabel ?? step.label}
          </span>
          <span className="text-xs leading-4 text-current opacity-70">
            {description}
          </span>
        </span>
      </Link>
    </li>
  );
}

export function ReportWizardStepList({
  steps,
  current,
  sections,
  method,
  uploadType,
  reportId,
  amendmentContext,
}: Omit<ReportWizardSidebarProps, "periodLabel" | "className">) {
  const resolvedCount = getResolvedReportSectionCount(sections);

  return (
    <ol className="grid gap-0.5">
      {steps.map((step, index) => {
        const snapshot = sections.find(
          (section) => section.name === step.backendId,
        );
        const active = step.id === current.id;
        const completed =
          snapshot?.status === "submitted" ||
          snapshot?.status === "completed";
        const noActivity = snapshot?.status === "no_activity";
        const notRequired = snapshot?.status === "not_required";
        const skipped = snapshot?.status === "skipped";
        const hasError = snapshot?.status === "error";
        const inProgress = snapshot?.status === "in_progress";
        const state: ReportWizardStepState = active
          ? "current"
          : completed
            ? "completed"
            : noActivity
              ? "no-activity"
              : notRequired
                ? "not-required"
                : skipped
                  ? "skipped"
                  : hasError
                    ? "error"
                    : inProgress
                      ? "in-progress"
                      : "pending";
        const description =
          step.id === "review"
            ? `${resolvedCount} of ${steps.length} resolved`
            : active
              ? "In progress"
              : completed
                ? "Completed"
                : noActivity
                  ? "No activity"
                  : notRequired
                    ? "Not required"
                    : skipped
                      ? "Skipped"
                      : hasError
                        ? "Needs attention"
                        : inProgress
                          ? "In progress"
                          : "Not started";

        return (
          <ReportWizardStepItem
            key={step.id}
            step={step}
            stepNumber={index + 1}
            state={state}
            description={description}
            separated={step.id === "review"}
            href={createReportWizardHref(step.id, {
              method,
              upload_type: method === "upload" ? uploadType : null,
              report_id: reportId,
              amendment_context: amendmentContext,
            })}
          />
        );
      })}
    </ol>
  );
}

export function ReportWizardSidebar({
  steps,
  current,
  sections,
  periodLabel,
  method,
  uploadType,
  reportId,
  amendmentContext,
  className,
}: ReportWizardSidebarProps) {
  return (
    <aside
      aria-label="Report sections"
      className={cn(
        "flex min-h-0 w-full flex-col overflow-hidden rounded-2xl border border-border-subtle bg-background p-3 shadow-elevation-01",
        className,
      )}
    >
      <div className="border-b border-border-subtle px-3 pb-4 pt-2">
        <p className="text-xs font-semibold text-muted-foreground">Report Wizard</p>
        <h2 className="mt-2 text-xl font-bold tracking-tight text-foreground">
          {periodLabel} Report
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Step {Math.max(steps.findIndex((step) => step.id === current.id) + 1, 1)} of {steps.length}
          {" · "}{getResolvedReportSectionCount(sections)} resolved
        </p>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto py-3 pr-1 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-zinc-300">
        <ReportWizardStepList
          steps={steps}
          current={current}
          sections={sections}
          method={method}
          uploadType={uploadType}
          reportId={reportId}
          amendmentContext={amendmentContext}
        />
      </div>

      <div className="mt-2 rounded-xl border border-primary/15 bg-primary/5 p-4">
        <p className="text-xs leading-5 text-muted-foreground">
          After submission, you can request to reopen and edit the report during
          the grace period. Once locked, it becomes read-only.
        </p>
      </div>
    </aside>
  );
}
