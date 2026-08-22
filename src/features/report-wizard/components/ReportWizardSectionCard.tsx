import type { ReactNode } from "react";
import { CheckIcon } from "lucide-react";

import { cn } from "@/lib/utils";

type ReportWizardSectionCardProps = {
  title: string;
  description: string;
  children: ReactNode;
  savedLabel?: string | null;
  className?: string;
};

export function ReportWizardSectionCard({
  title,
  description,
  children,
  savedLabel,
  className,
}: ReportWizardSectionCardProps) {
  return (
    <section
      aria-labelledby="report-section-title"
      className={cn(
        "min-w-0 rounded-2xl border border-border-subtle bg-background shadow-elevation-01",
        className,
      )}
    >
      <div className="flex flex-col gap-3 border-b border-border px-5 py-5 sm:flex-row sm:items-start sm:justify-between lg:px-7">
        <div className="min-w-0">
          <h1
            id="report-section-title"
            className="text-xl font-bold tracking-tight text-foreground lg:text-2xl"
          >
            {title}
          </h1>
          <p className="mt-1.5 text-sm leading-6 text-muted-foreground">
            {description}
          </p>
        </div>
        {savedLabel ? (
          <p
            role="status"
            className="inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-emerald-700 dark:text-emerald-400"
          >
            <CheckIcon className="size-4" aria-hidden="true" />
            {savedLabel}
          </p>
        ) : null}
      </div>
      <div className="min-w-0 p-4 sm:p-5 lg:p-7">{children}</div>
    </section>
  );
}
