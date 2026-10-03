"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { CheckIcon, ChevronRightIcon, CircleHelpIcon, SendIcon, XCircleIcon } from "lucide-react";

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
  compact?: boolean;
};

const stateStyles: Record<StepState, string> = {
  current: "bg-primary/10 text-foreground ring-1 ring-inset ring-primary/25",
  completed: "text-foreground hover:bg-accent",
  "no-activity": "text-cyan-700 hover:bg-cyan-50 dark:text-cyan-300 dark:hover:bg-cyan-950/40",
  "not-required": "text-muted-foreground hover:bg-accent",
  "in-progress": "text-foreground hover:bg-accent",
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
  if (review && state !== "current") {
    return (
      <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-300">
        <SendIcon className="size-4" aria-hidden="true" />
      </span>
    );
  }
  if (state === "error") {
    return (
      <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-destructive/10 text-destructive">
        <XCircleIcon className="size-4" aria-hidden="true" />
      </span>
    );
  }

  const indicatorClass =
    state === "completed"
      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
      : state === "skipped"
        ? "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
        : state === "no-activity"
          ? "bg-cyan-100 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-300"
          : state === "current"
            ? "bg-primary text-primary-foreground shadow-sm"
            : "border border-border bg-muted text-muted-foreground";

  return (
    <span
      className={cn(
        "flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-bold",
        indicatorClass,
      )}
    >
      {state === "completed" ? <CheckIcon aria-hidden="true" className="size-4" /> : stepNumber}
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
  compact = false,
}: ReportProgressRailProps) {
  const resolvedCount = getResolvedReportSectionCount(sections);
  const railRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!compact) return;
    const rail = railRef.current;
    const active = rail?.querySelector<HTMLElement>('[aria-current="step"]');
    if (!rail || !active) return;
    // Scroll only the horizontal rail, without moving the page vertically.
    const railBounds = rail.getBoundingClientRect();
    const bounds = active.getBoundingClientRect();
    if (bounds.left < railBounds.left || bounds.right > railBounds.right) {
      rail.scrollTo({ left: rail.scrollLeft + bounds.left - railBounds.left - 4, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
    }
  }, [compact, current.id]);

  return (
    <aside
      aria-label="Report progress"
      className={cn(
        compact ? "min-w-0 w-full max-w-full lg:hidden" : "flex w-full flex-col rounded-3xl bg-background p-5",
        className,
      )}
    >
      <div className={compact ? "hidden" : "shrink-0 px-1 pb-3"}>
        <div className="flex flex-col gap-4">
          <p className="text-xl font-semibold text-foreground">This Report</p>
          <div className="flex items-center gap-2.5">
            <progress aria-label="Resolved report sections" max={steps.length} value={resolvedCount} className="block h-2 min-w-0 flex-1 overflow-hidden rounded-full [&::-webkit-progress-bar]:bg-muted [&::-webkit-progress-value]:bg-primary [&::-moz-progress-bar]:bg-primary" />
            <span className="text-xs font-semibold tabular-nums text-foreground" aria-label={`${resolvedCount} of ${steps.length} sections resolved`}>{resolvedCount}/{steps.length}</span>
          </div>
        </div>
        <p className="sr-only">{periodLabel}</p>
      </div>

      {/* Keep absolutely positioned sr-only labels inside the rail overflow boundary. */}
      <div ref={railRef} className={compact ? "relative min-w-0 w-full max-w-full overflow-x-auto overscroll-x-contain snap-x snap-proximity scroll-px-1 p-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" : "flex-1 py-3 pr-1"}>
        <ol className={compact ? "flex w-max gap-2" : "grid gap-1 [&>li]:border-b [&>li]:border-border-subtle"}>
          {steps.map((step, index) => {
            const snapshot = sections.find((item) => item.name === step.backendId);
            const state = getStepState(step, current, snapshot);
            const description = step.id === "review"
              ? `${resolvedCount} of ${steps.length} resolved`
              : stepDescription(state);

            return (
              <li key={step.id} className={compact ? "shrink-0 snap-start" : cn(step.id === "review" && "mt-3 pt-3")}>
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
                    compact && "whitespace-nowrap rounded-full border border-border px-4 py-3",
                    stateStyles[state],
                  )}
                >
                  <StepIndicator state={state} stepNumber={index + 1} review={step.id === "review"} />
                  <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <span className="text-sm font-semibold leading-5 text-current">
                      {step.navigationLabel ?? step.label}
                    </span>
                    <span className={compact ? "sr-only" : "text-xs leading-4 text-current opacity-70"}>{description}</span>
                  </span>
                  {!compact ? <ChevronRightIcon aria-hidden="true" className="size-3.5 shrink-0 opacity-40" /> : null}
                </Link>
              </li>
            );
          })}
        </ol>
      </div>

      <div className={compact ? "hidden" : "mt-6 shrink-0 rounded-3xl bg-muted/50 p-4"}>
        <p className="mb-2 flex items-center gap-2 text-sm font-medium"><CircleHelpIcon aria-hidden="true" className="size-4 shrink-0 text-muted-foreground" /> Reporting guidance</p>
        <p className="text-xs leading-5 text-muted-foreground">
          After submission, you can request to reopen and edit the report during
          the grace period. Once locked, it becomes read-only.
        </p>
      </div>
    </aside>
  );
}
