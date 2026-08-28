"use client";

import Link from "next/link";

import { cn } from "@/lib/utils";
import {
  createReportWizardHref,
  type ReportWizardMethod,
  type ReportWizardSection,
  type ReportWizardUploadType,
} from "@/features/report-wizard/config/report-types";

type ReportWizardHeaderProps = {
  section: ReportWizardSection;
  method: ReportWizardMethod;
  uploadType: ReportWizardUploadType;
  reportId?: string | number | null;
  amendmentContext?: string | null;
};

export function ReportWizardHeader({
  section,
  method,
  uploadType,
  reportId,
  amendmentContext,
}: ReportWizardHeaderProps) {
  const canUpload = Boolean(section.uploadUrl) || section.id === "review";
  const manualActive = method !== "upload" || !canUpload;

  return (
    <div className="border-b border-border-subtle bg-background px-3 py-2 md:border-0 md:bg-transparent md:p-0">
      <div
        role="group"
        aria-label="Report entry method"
        className="mx-auto flex h-10 w-fit rounded-xl bg-muted p-1"
      >
          <Link
            href={createReportWizardHref(section.id, {
              method: method === "quick-entry" ? "quick-entry" : "manual-entry",
              report_id: reportId,
              amendment_context: amendmentContext,
            })}
            aria-current={manualActive ? "page" : undefined}
            className={cn(
              "inline-flex min-w-24 items-center justify-center rounded-lg px-4 text-sm font-semibold outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring",
              manualActive
                ? "bg-background text-primary shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            Manual
          </Link>
          {canUpload ? (
            <Link
              href={createReportWizardHref(section.id, {
                method: "upload",
                upload_type: uploadType,
                report_id: reportId,
                amendment_context: amendmentContext,
              })}
              aria-current={!manualActive ? "page" : undefined}
              className={cn(
                "inline-flex min-w-24 items-center justify-center rounded-lg px-4 text-sm font-semibold outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring",
                !manualActive
                  ? "bg-background text-primary shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              Uploads
            </Link>
          ) : (
            <span
              aria-disabled="true"
              title="Uploads are not available for this section"
              className="inline-flex min-w-24 cursor-not-allowed items-center justify-center rounded-lg px-4 text-sm font-semibold text-muted-foreground/50"
            >
              Uploads
            </span>
          )}
      </div>
    </div>
  );
}
