"use client"

import { useSearchParams } from "next/navigation"
import { FileSpreadsheetIcon } from "lucide-react"

import { CentralCreateWorkspace } from "@/features/central-create/components/CentralCreateWorkspace"
import { ReportTemplateCard } from "@/features/central-create/components/ReportTemplateCard"
import {
    REPORT_WIZARD_SECTIONS,
    createReportWizardHref,
    getReportWizardSectionByRoute,
    type ReportWizardMethod,
    type ReportWizardUploadType,
} from "@/features/report-wizard/config/report-types"

const TEMPLATE_DESCRIPTIONS: Record<string, string> = {
    attendance: "Prepare weekly service attendance records for import.",
    "sunday-school": "Prepare Sunday School attendance and lesson records for import.",
    tithes: "Prepare individual tithe contributions for import.",
    revenue: "Prepare General Income entries for import.",
    expenses: "Prepare Other Expenses entries for import.",
    overhead: "Prepare regular Operating Costs entries for import.",
}

const TEMPLATE_FILE_NAMES: Record<string, string> = {
    attendance: "attendance_template.xlsx",
    "sunday-school": "sunday_school_attendance_template.xlsx",
    tithes: "tithe_template.xlsx",
    revenue: "revenue_template.xlsx",
    expenses: "expenditure_template.xlsx",
    overhead: "overhead_template.xlsx",
}

function reportMethod(value: string | null): ReportWizardMethod {
    if (value === "upload") return "upload"
    if (value === "web-form") return "web-form"
    if (value === "quick-entry") return "quick-entry"
    return "manual-entry"
}

function uploadType(value: string | null): ReportWizardUploadType {
    if (value === "csv") return "csv"
    if (value === "ocr") return "ocr"
    if (value === "photo") return "photo"
    return "excel"
}

export function CentralCreateTemplatesView() {
    const searchParams = useSearchParams()
    const section = getReportWizardSectionByRoute(
        searchParams.get("return_section"),
    )
    const method = reportMethod(searchParams.get("method"))
    const type = uploadType(searchParams.get("upload_type"))
    const query = searchParams.toString()
    const reportHref = createReportWizardHref(section.id, {
        method,
        upload_type: method === "upload" ? type : null,
        report_id: searchParams.get("report_id"),
        amendment_context: searchParams.get("amendment_context"),
    })
    const templatesHref = query ? `/create/templates?${query}` : "/create/templates"
    const templates = REPORT_WIZARD_SECTIONS.flatMap((item) => {
        const href = item.templateUrls.excel
        return href ? [{ ...item, href }] : []
    })

    return (
        <CentralCreateWorkspace
            active="templates"
            reportHref={reportHref}
            templatesHref={templatesHref}
        >
            <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
                <div className="max-w-2xl">
                    <p className="text-xs font-bold uppercase tracking-[0.12em] text-primary">
                        Create resources
                    </p>
                    <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                        Templates
                    </h1>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                        Download an Excel template, prepare your report data, then
                        upload it from the matching Report Wizard section.
                    </p>
                </div>

                <section aria-labelledby="report-templates-title" className="mt-8">
                    <div className="flex items-end justify-between gap-4 border-b border-border-subtle pb-4">
                        <div>
                            <h2 id="report-templates-title" className="text-lg font-bold text-foreground">
                                Report templates
                            </h2>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Excel workbooks matched to the existing import format.
                            </p>
                        </div>
                        <span className="hidden text-xs font-medium text-muted-foreground sm:block">
                            {templates.length} available
                        </span>
                    </div>

                    <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                        {templates.map((template) => (
                            <ReportTemplateCard
                                key={template.id}
                                title={template.navigationLabel ?? template.label}
                                category="Report template"
                                description={TEMPLATE_DESCRIPTIONS[template.id] ??
                                    "Prepare report records for import."}
                                icon={FileSpreadsheetIcon}
                                downloadUrl={template.href}
                                fileName={TEMPLATE_FILE_NAMES[template.id]}
                                fileType="Excel workbook (.xlsx)"
                                className="rounded-2xl"
                            />
                        ))}
                    </div>
                </section>
            </div>
        </CentralCreateWorkspace>
    )
}
