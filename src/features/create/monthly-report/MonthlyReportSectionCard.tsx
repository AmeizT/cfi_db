import type { ReactNode } from "react";
import { ClipboardListIcon } from "lucide-react";

export function MonthlyReportSectionCard({ title, description, children }: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section aria-labelledby="report-section-title" className="min-w-0 overflow-hidden rounded-2xl border border-border-subtle bg-background">
      <div className="flex items-start gap-3 border-b border-border-subtle px-4 py-5 sm:px-6">
        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/8 text-primary">
          <ClipboardListIcon aria-hidden="true" className="size-5" />
        </span>
        <div className="min-w-0">
          <h2 id="report-section-title" className="text-lg font-semibold tracking-tight text-foreground sm:text-xl">{title}</h2>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">{description}</p>
        </div>
      </div>
      <div className="min-w-0 p-4 sm:p-6">{children}</div>
    </section>
  );
}
