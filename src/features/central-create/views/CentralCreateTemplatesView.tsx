"use client"

import { FileSpreadsheetIcon } from "lucide-react"

import { ReportTemplateCard } from "@/features/central-create/components/ReportTemplateCard"
import { REPORT_WIZARD_SECTIONS } from "@/features/report-wizard/config/report-types"

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

export function CentralCreateTemplatesView() {
    const templates = REPORT_WIZARD_SECTIONS.flatMap((item) => {
        const href = item.templateUrls.excel
        return href ? [{ ...item, href }] : []
    })

    return (
        <div className="mx-auto w-full max-w-6xl py-6 lg:py-8">
            <section aria-labelledby="report-templates-title">
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
    )
}
