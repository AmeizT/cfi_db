export type ReportWizardMethod = "manual-entry" | "web-form" | "quick-entry" | "upload"
export type ReportWizardUploadType = "excel" | "csv" | "ocr" | "photo"

export type WorkflowReportSectionKey =
    | "general_attendance"
    | "sunday_school_attendance"
    | "tithes"
    | "revenue"
    | "operating_expenses"
    | "activity_other_expenses"
    | "review"

export const REPORT_SECTION_WIZARD_ROUTES: Record<WorkflowReportSectionKey, string> = {
    general_attendance: "attendance",
    sunday_school_attendance: "sunday-school",
    tithes: "tithes",
    revenue: "revenue",
    operating_expenses: "overhead",
    activity_other_expenses: "expenses",
    review: "review",
}

export type ReportWizardHrefOptions = {
    method?: ReportWizardMethod
    upload_type?: ReportWizardUploadType | null
    report_id?: string | number | null
    amendment_context?: string | null
}

export function createReportWizardHref(
    section: string,
    updates: ReportWizardHrefOptions = {}
) {
    const params = new URLSearchParams()
    const method = updates.method ?? "manual-entry"
    params.set("method", method)

    if (method === "upload" && updates.upload_type) {
        params.set("upload_type", updates.upload_type)
    }
    if (updates.report_id) {
        params.set("report_id", String(updates.report_id))
    }
    if (updates.amendment_context) {
        params.set("amendment_context", updates.amendment_context)
    }

    return `/report-wizard/create/${section}?${params.toString()}`
}

export function createReportSectionWizardHref(
    section: WorkflowReportSectionKey,
    updates: ReportWizardHrefOptions = {}
) {
    return createReportWizardHref(REPORT_SECTION_WIZARD_ROUTES[section], updates)
}
