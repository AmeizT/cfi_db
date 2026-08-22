"use client";

import Link from "next/link";
import { ArrowLeftIcon, ChevronRightIcon } from "lucide-react";

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
  reportTitle: string;
};

export function ReportWizardHeader({
  section,
  method,
  uploadType,
  reportId,
  amendmentContext,
  reportTitle,
}: ReportWizardHeaderProps) {
  const canUpload = Boolean(section.uploadUrl) || section.id === "review";
  const manualActive = method !== "upload" || !canUpload;

  return (
    <header className="border-b-0 border-border px-4 py-3 lg:px-6">
      <div className="grid min-h-10 items-center gap-3 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]">
        <nav
          aria-label="Report breadcrumb"
          className="flex min-w-0 items-center gap-2 text-sm"
        >
          <Link
            href="/reports"
            aria-label="Back to reports"
            className="grid size-9 shrink-0 place-items-center rounded-full border border-border text-muted-foreground outline-none transition-colors hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
          >
            <ArrowLeftIcon className="size-4" aria-hidden="true" />
          </Link>
          <Link
            href="/reports"
            className="font-medium text-muted-foreground outline-none hover:text-foreground focus-visible:rounded focus-visible:ring-2 focus-visible:ring-ring"
          >
            Reports
          </Link>
          <ChevronRightIcon
            className="size-4 shrink-0 text-muted-foreground"
            aria-hidden="true"
          />
          <span className="truncate font-semibold text-foreground">
            {reportTitle}
          </span>
        </nav>

        <div
          role="group"
          aria-label="Report entry method"
          className="flex h-8 w-fit rounded-full border border-border-subtle p-0 lg:justify-self-center"
        >
          <Link
            href={createReportWizardHref(section.id, {
              method: method === "quick-entry" ? "quick-entry" : "manual-entry",
              report_id: reportId,
              amendment_context: amendmentContext,
            })}
            aria-current={manualActive ? "page" : undefined}
            className={cn(
              "inline-flex min-w-24 items-center justify-center rounded-full px-4 text-sm font-semibold outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring",
              manualActive
                ? "bg-background text-primary shadow-elevation-sm"
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
                "inline-flex min-w-24 items-center justify-center rounded-full px-4 text-sm font-semibold outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring",
                !manualActive
                  ? "bg-background text-primary shadow-elevation-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              Uploads
            </Link>
          ) : (
            <span
              aria-disabled="true"
              title="Uploads are not available for this section"
              className="inline-flex min-w-24 cursor-not-allowed items-center justify-center rounded-md px-4 text-sm font-semibold text-muted-foreground/50"
            >
              Uploads
            </span>
          )}
        </div>

        <div className="hidden lg:block" aria-hidden="true" />
      </div>
    </header>
  );
}
