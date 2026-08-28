import { apiRoutes } from "@/config/urls"

export {
    REPORT_SECTION_WIZARD_ROUTES,
    createCentralTemplatesHref,
    createReportSectionWizardHref,
    createReportWizardHref,
    type ReportWizardHrefOptions,
    type ReportWizardMethod,
    type ReportWizardUploadType,
    type WorkflowReportSectionKey,
} from "./report-routing"

export type ReportWizardTemplateFormat = "excel" | "csv" | "print"
export type ReportWizardSectionStatus =
    | "pending"
    | "not_started"
    | "in_progress"
    | "completed"
    | "submitted"
    | "no_activity"
    | "not_required"
    | "skipped"
    | "error"

export type ReportWizardSection = {
    id: string
    backendId: string
    label: string
    navigationLabel?: string
    canConfirmNoActivity?: boolean
    uploadType?: string
    uploadUrl?: string
    imageUploadUrl?: string
    templateUrl?: string
    templateUrls: Partial<Record<ReportWizardTemplateFormat, string>>
}

export type ReportWizardSectionSnapshot = {
    id?: number
    name: string
    status: ReportWizardSectionStatus
    reason?: string | null
}

export type ReportWizardReport = {
    id: number | string
    assembly?: { name?: string }
    period_start?: string
    period_end?: string
    status?: string
    compliance?: {
        pending?: number
        skipped?: number
        sections?: ReportWizardSectionSnapshot[]
    }
}

export const REPORT_WIZARD_SECTIONS: ReportWizardSection[] = [
    {
        id: "attendance",
        backendId: "general_attendance",
        label: "Attendance",
        uploadType: "attendance",
        uploadUrl: apiRoutes.uploadExcel.attendance,
        templateUrl: apiRoutes.downloadTemplate.attendance,
        templateUrls: {
            excel: apiRoutes.downloadTemplate.attendance,
        },
    },
    {
        id: "sunday-school",
        backendId: "sunday_school_attendance",
        label: "Sunday School Attendance",
        navigationLabel: "Sunday School",
        uploadType: "sunday-school",
        uploadUrl: apiRoutes.uploadExcel.sundaySchool,
        templateUrl: apiRoutes.downloadTemplate.sundaySchool,
        templateUrls: {
            excel: apiRoutes.downloadTemplate.sundaySchool,
        },
    },
    {
        id: "tithes",
        backendId: "tithes",
        label: "Tithes",
        uploadType: "tithes",
        uploadUrl: apiRoutes.uploadExcel.tithes,
        templateUrl: apiRoutes.downloadTemplate.tithes,
        templateUrls: {
            excel: apiRoutes.downloadTemplate.tithes,
        },
    },
    {
        id: "revenue",
        backendId: "revenue",
        label: "General Income",
        uploadType: "revenue",
        uploadUrl: apiRoutes.uploadExcel.revenue,
        templateUrl: apiRoutes.downloadTemplate.revenue,
        templateUrls: {
            excel: apiRoutes.downloadTemplate.revenue,
        },
    },
    {
        id: "expenses",
        backendId: "activity_other_expenses",
        label: "Other Expenses",
        canConfirmNoActivity: true,
        uploadType: "expenditure",
        uploadUrl: apiRoutes.uploadExcel.expenses,
        imageUploadUrl: apiRoutes.uploadImage.expenses,
        templateUrl: apiRoutes.downloadTemplate.expenses,
        templateUrls: {
            excel: apiRoutes.downloadTemplate.expenses,
        },
    },
    {
        id: "overhead",
        backendId: "operating_expenses",
        label: "Operating Costs",
        uploadType: "overhead",
        uploadUrl: apiRoutes.uploadExcel.overhead,
        templateUrl: apiRoutes.downloadTemplate.overhead,
        templateUrls: {
            excel: apiRoutes.downloadTemplate.overhead,
        },
    },
    {
        id: "review",
        backendId: "review",
        label: "Review & Submit",
        templateUrls: {},
    },
]

export function getReportWizardSectionByRoute(section: string | null | undefined) {
    return REPORT_WIZARD_SECTIONS.find((item) => item.id === section)
        ?? REPORT_WIZARD_SECTIONS.find((item) => item.backendId === section)
        ?? REPORT_WIZARD_SECTIONS[0]
}

export function getReportWizardSectionByBackend(section: string | null | undefined) {
    return REPORT_WIZARD_SECTIONS.find((item) => item.backendId === section)
        ?? REPORT_WIZARD_SECTIONS.find((item) => item.id === section)
        ?? REPORT_WIZARD_SECTIONS[0]
}

export function getReportWizardSectionDisplayLabel(
    section: string | null | undefined,
    fallback = "Report section",
) {
    const configured = REPORT_WIZARD_SECTIONS.find(
        (item) => item.backendId === section || item.id === section,
    )

    return configured?.navigationLabel ?? configured?.label ?? fallback
}

export function getReportWizardSectionByPathname(pathname: string) {
    const segments = pathname.split("/").filter(Boolean)
    const createIndex = segments.findIndex((segment) => segment === "create")
    const section = createIndex >= 0 ? segments[createIndex + 1] : undefined

    return section ? getReportWizardSectionByRoute(section) : null
}

function isRecord(value: unknown): value is Record<string, unknown> {
    return Boolean(value) && typeof value === "object" && !Array.isArray(value)
}

function isReportWizardReport(value: unknown): value is ReportWizardReport {
    return isRecord(value) && (
        typeof value.id === "number" || typeof value.id === "string"
    )
}

export function toReportWizardList(value: unknown): ReportWizardReport[] {
    if (Array.isArray(value)) return value.filter(isReportWizardReport)
    if (!isRecord(value)) return []

    if (Array.isArray(value.results)) return value.results.filter(isReportWizardReport)
    if (Array.isArray(value.data)) return value.data.filter(isReportWizardReport)

    return []
}

export function getReportWizardSections(report: ReportWizardReport): ReportWizardSectionSnapshot[] {
    const sections = report.compliance?.sections ?? []

    if (sections.length) return sections

    return REPORT_WIZARD_SECTIONS.map((section) => ({
        name: section.backendId,
        status: "pending",
    }))
}

export function getResolvedReportSectionCount(
    sections: ReportWizardSectionSnapshot[],
) {
    return sections.filter((section) =>
        section.status === "submitted" ||
        section.status === "completed" ||
        section.status === "no_activity" ||
        section.status === "not_required" ||
        section.status === "skipped"
    ).length
}

export function getReportWizardResumeSection(report: ReportWizardReport) {
    const pending = getReportWizardSections(report)
        .find((section) => section.status === "pending")

    return getReportWizardSectionByBackend(pending?.name ?? REPORT_WIZARD_SECTIONS[0].backendId).id
}

export function isPartialReportWizardReport(report: ReportWizardReport) {
    return getReportWizardSections(report)
        .some((section) => section.status !== "submitted")
}

export function formatReportWizardPeriod(report: ReportWizardReport) {
    if (!report.period_start) return "Current period"

    const date = new Date(`${report.period_start}T00:00:00`)
    if (Number.isNaN(date.getTime())) return report.period_start

    return new Intl.DateTimeFormat("en", {
        month: "long",
        year: "numeric",
    }).format(date)
}

export function getReportWizardTitle(report: ReportWizardReport) {
    const assembly = report.assembly?.name ?? "Assembly report"
    return `${assembly} - ${formatReportWizardPeriod(report)}`
}
