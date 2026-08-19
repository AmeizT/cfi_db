"use client";

import Link from "next/link";
import {
  ChartNoAxesCombinedIcon,
  CheckIcon,
  CircleDollarSignIcon,
  CircleIcon,
  ClipboardCheckIcon,
  GraduationCapIcon,
  HandCoinsIcon,
  ReceiptTextIcon,
  SkipForwardIcon,
  UsersIcon,
  WalletCardsIcon,
  XCircleIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import {
  createReportWizardHref,
  type ReportWizardMethod,
  type ReportWizardSection,
  type ReportWizardSectionSnapshot,
  type ReportWizardUploadType,
} from "@/features/report-wizard/config/report-types";

type ReportWizardStepState =
  | "current"
  | "completed"
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
  state: ReportWizardStepState;
  description: string;
  href: string;
  separated?: boolean;
};

const stateStyles: Record<ReportWizardStepState, string> = {
  current: "bg-primary/10 text-primary ring-1 ring-inset ring-primary/15",
  completed: "text-foreground hover:bg-accent",
  "in-progress": "text-primary hover:bg-primary/5",
  skipped: "text-amber-700 dark:text-amber-400",
  error: "bg-destructive/5 text-destructive",
  pending: "text-muted-foreground hover:bg-accent hover:text-foreground",
};

const STEP_ICONS = {
  attendance: UsersIcon,
  "sunday-school": GraduationCapIcon,
  tithes: WalletCardsIcon,
  revenue: ChartNoAxesCombinedIcon,
  expenses: ReceiptTextIcon,
  overhead: CircleDollarSignIcon,
  review: ClipboardCheckIcon,
} as const;

function ReportWizardStepIndicator({
  state,
}: {
  state: ReportWizardStepState;
}) {
  if (state === "completed") {
    return (
      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
        <CheckIcon className="size-3.5" aria-hidden="true" />
      </span>
    );
  }

  if (state === "skipped") {
    return (
      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300">
        <SkipForwardIcon className="size-3.5" aria-hidden="true" />
      </span>
    );
  }

  if (state === "error") {
    return (
      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-destructive/10 text-destructive">
        <XCircleIcon className="size-4" aria-hidden="true" />
      </span>
    );
  }

  if (state === "current") {
    return (
      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm">
        <span className="size-2.5 rounded-full border-2 border-current" aria-hidden="true" />
      </span>
    );
  }

  return (
    <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-border bg-muted/40 text-muted-foreground">
      <CircleIcon className="size-4" aria-hidden="true" />
    </span>
  );
}

export function ReportWizardStepItem({
  step,
  state,
  description,
  href,
  separated = false,
}: ReportWizardStepItemProps) {
  const current = state === "current";
  const Icon = STEP_ICONS[step.id as keyof typeof STEP_ICONS] ?? HandCoinsIcon;

  return (
    <li className={cn(separated && "mt-3 border-t border-border pt-3")}>
      <Link
        href={href}
        scroll={false}
        aria-current={current ? "step" : undefined}
        className={cn(
          "group flex min-w-0 items-start gap-3 rounded-xl px-3 py-3 outline-none transition-colors",
          "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          stateStyles[state],
        )}
      >
        <span className="relative">
          <ReportWizardStepIndicator state={state} />
          {state === "pending" || state === "in-progress" ? (
            <Icon className="pointer-events-none absolute left-1/2 top-1/2 size-4 -translate-x-1/2 -translate-y-1/2" aria-hidden="true" />
          ) : null}
        </span>
        <span className="flex min-w-0 flex-col gap-0.5">
          <span className="text-sm font-semibold leading-5 text-current">
            {step.label}
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
  const resolvedCount = sections.filter(
    (section) =>
      section.status === "submitted" ||
      section.status === "completed" ||
      section.status === "no_activity" ||
      section.status === "skipped",
  ).length;

  return (
    <ol className="grid gap-0.5">
      {steps.map((step) => {
        const snapshot = sections.find(
          (section) => section.name === step.backendId,
        );
        const active = step.id === current.id;
        const completed =
          snapshot?.status === "submitted" ||
          snapshot?.status === "completed" ||
          snapshot?.status === "no_activity";
        const skipped = snapshot?.status === "skipped";
        const hasError = snapshot?.status === "error";
        const inProgress = snapshot?.status === "in_progress";
        const state: ReportWizardStepState = completed
          ? "completed"
          : skipped
            ? "skipped"
            : hasError
              ? "error"
            : active
              ? "current"
              : inProgress
                ? "in-progress"
              : "pending";
        const description =
          step.id === "review"
            ? `${resolvedCount} of ${steps.length} resolved`
            : completed
              ? "Completed"
              : skipped
                ? "Skipped"
                : hasError
                  ? "Needs attention"
                : active
                  ? "In progress"
                  : inProgress
                    ? "In progress"
                  : "Not started";

        return (
          <ReportWizardStepItem
            key={step.id}
            step={step}
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
        "w-full rounded-2xl border border-border-subtle bg-background p-3 shadow-elevation-01",
        className,
      )}
    >
      <div className="mb-4 px-3 pt-2">
        <h2 className="text-lg font-bold text-foreground">Report Wizard</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Step {Math.max(steps.findIndex((step) => step.id === current.id) + 1, 1)} of {steps.length}
        </p>
        <p className="mt-2 truncate text-xs font-medium text-muted-foreground">
          {periodLabel}
        </p>
      </div>

      <ReportWizardStepList
        steps={steps}
        current={current}
        sections={sections}
        method={method}
        uploadType={uploadType}
        reportId={reportId}
        amendmentContext={amendmentContext}
      />
    </aside>
  );
}
