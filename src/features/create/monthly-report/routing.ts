import type {
  ReportWizardHrefOptions,
  ReportWizardMethod,
  ReportWizardUploadType,
} from "@/features/report-wizard/config/report-types";
import { REPORT_WIZARD_SECTIONS } from "@/features/report-wizard/config/report-types";
import type { WorkflowReport } from "@/features/reports/workflow/types";

export const MONTHLY_REPORT_WORKSPACE = "monthly-report";

export function getMonthlyReportResumeSection(report: WorkflowReport) {
  if (report.status === "submitted" || report.status === "locked") {
    return "review";
  }

  const unresolved = REPORT_WIZARD_SECTIONS.find((section) => {
    if (section.id === "review") return false;
    const workflowSection = report.sections.find(
      (item) => item.key === section.backendId || item.name === section.backendId,
    );
    return !workflowSection?.resolved;
  });

  return unresolved?.id ?? "review";
}

export function createMonthlyReportHref(
  section = "attendance",
  options: ReportWizardHrefOptions = {},
) {
  const params = new URLSearchParams();
  const method = options.method ?? "manual-entry";

  params.set("workspace", MONTHLY_REPORT_WORKSPACE);
  params.set("section", section);
  params.set("method", method);

  if (method === "upload" && options.upload_type) {
    params.set("upload_type", options.upload_type);
  }
  if (options.report_id) {
    params.set("report_id", String(options.report_id));
  }
  if (options.amendment_context) {
    params.set("amendment_context", options.amendment_context);
  }

  return `/create?${params.toString()}`;
}

export type MonthlyReportMethod = ReportWizardMethod;
export type MonthlyReportUploadType = ReportWizardUploadType;
