import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import test from "node:test"

import {
    createCentralTemplatesHref,
    createReportWizardHref,
} from "../config/report-routing.ts"

test("wizard step links preserve report entry context", () => {
    assert.equal(
        createReportWizardHref("expenses", {
            method: "upload",
            upload_type: "photo",
            report_id: 42,
            amendment_context: "reopened",
        }),
        "/report-wizard/create/expenses?method=upload&upload_type=photo&report_id=42&amendment_context=reopened"
    )
    assert.equal(
        createCentralTemplatesHref("expenses", {
            method: "upload",
            upload_type: "photo",
            report_id: 42,
            amendment_context: "reopened",
        }),
        "/create/templates?return_section=expenses&method=upload&upload_type=photo&report_id=42&amendment_context=reopened"
    )
})

test("Templates uses ReportTemplateCard with canonical download endpoints", async () => {
    const [templates, card, types, urls, templateMixin, uploadService] = await Promise.all([
        readFile(
            "src/features/central-create/views/CentralCreateTemplatesView.tsx",
            "utf8"
        ),
        readFile(
            "src/features/central-create/components/ReportTemplateCard.tsx",
            "utf8"
        ),
        readFile("src/features/report-wizard/config/report-types.ts", "utf8"),
        readFile("src/config/urls.ts", "utf8"),
        readFile(
            "backend/cfidb/apps/people/mixins/sunday_school_template.py",
            "utf8"
        ),
        readFile(
            "backend/cfidb/apps/uploads/services/sunday_school_upload.py",
            "utf8"
        ),
    ])

    assert.match(templates, /REPORT_WIZARD_SECTIONS\.flatMap/)
    assert.match(templates, /templateUrls\.excel/)
    assert.match(templates, /ReportTemplateCard/)
    assert.match(templates, /downloadUrl=\{template\.href\}/)
    assert.match(templates, /TEMPLATE_FILE_NAMES/)
    assert.doesNotMatch(templates, /<article|Monthly Assembly Report|Engagement Report|Outreach Report/)
    assert.match(card, /<a href=\{downloadUrl\} download=\{fileName\}>/)
    assert.match(card, /Excel workbook/)
    assert.match(templates, /createReportWizardHref/)
    assert.match(types, /uploadType: "sunday-school"/)
    assert.match(types, /apiRoutes\.downloadTemplate\.sundaySchool/)
    assert.match(types, /apiRoutes\.uploadExcel\.sundaySchool/)
    assert.match(urls, /sunday-school-attendance\/download_sunday_school_template\//)
    assert.match(urls, /sunday-school-attendance\/upload_excel\//)
    assert.match(templateMixin, /"service_date"/)
    assert.match(templateMixin, /"teacher_name"/)
    assert.match(templateMixin, /freeze_panes = "A2"/)
    assert.match(uploadService, /required_columns = \[/)
    assert.match(uploadService, /class SundaySchoolAttendanceUploadService/)
})

test("wizard uses the canonical sections in the Central Create workspace", async () => {
    const [view, sidebar, header, footer, workspace] = await Promise.all([
        readFile("src/features/report-wizard/views/ReportWizardView.tsx", "utf8"),
        readFile(
            "src/features/report-wizard/components/ReportWizardSidebar.tsx",
            "utf8"
        ),
        readFile(
            "src/features/report-wizard/components/ReportWizardHeader.tsx",
            "utf8"
        ),
        readFile(
            "src/features/report-wizard/components/ReportWizardFooter.tsx",
            "utf8"
        ),
        readFile(
            "src/features/central-create/components/CentralCreateWorkspace.tsx",
            "utf8"
        ),
    ])

    assert.doesNotMatch(view, /ReportWizardStepper|<StepRail/)
    assert.match(view, /<CentralCreateWorkspace/)
    assert.match(workspace, /lg:grid-cols-\[270px_minmax\(0,1fr\)\]/)
    assert.match(workspace, /xl:grid-cols-\[270px_minmax\(0,1fr\)_340px\]/)
    assert.match(workspace, /Report Wizard/)
    assert.match(workspace, /Templates/)
    assert.match(workspace, /Members/)
    assert.match(workspace, /Finance/)
    assert.match(workspace, /Engagement/)
    assert.match(view, /<ReportWizardHeader/)
    assert.match(view, /<ReportWizardFooter/)
    assert.match(workspace, /<Sheet>/)
    assert.match(workspace, /className="xl:hidden"/)
    assert.match(workspace, /className="hidden min-h-0 xl:block"/)
    assert.match(workspace, /flex h-dvh min-h-0 min-w-0 flex-col overflow-hidden/)
    assert.match(view, /steps=\{REPORT_WIZARD_SECTIONS\}/)
    assert.match(sidebar, /createReportWizardHref\(step\.id/)
    assert.match(sidebar, /method,/)
    assert.match(sidebar, /upload_type: method === "upload" \? uploadType : null/)
    assert.match(sidebar, /report_id: reportId/)
    assert.match(sidebar, /amendment_context: amendmentContext/)
    assert.match(sidebar, /Report Wizard/)
    assert.match(sidebar, /In progress/)
    assert.match(sidebar, /Completed/)
    assert.match(sidebar, /Skipped/)
    assert.match(sidebar, /Not started/)
    assert.match(sidebar, /navigationLabel \?\? step\.label/)
    assert.match(sidebar, /overflow-y-auto.*scrollbar-thin/)
    assert.match(sidebar, /After submission, you can request to reopen/)
    assert.match(header, />\s*Manual\s*</)
    assert.match(header, />\s*Uploads\s*</)
    assert.match(footer, /Skip this section/)
    assert.match(footer, /Previous/)
    assert.match(footer, /sticky bottom-3/)
    assert.match(footer, /rounded-2xl/)
    assert.match(footer, /shadow-elevation-01/)
    assert.match(view, /pb-24.*sm:pb-28/)
})

test("current-report and year progress remain distinct", async () => {
    const [view, workspace, yearProgress, form, multiEntry] = await Promise.all([
        readFile("src/features/report-wizard/views/ReportWizardView.tsx", "utf8"),
        readFile(
            "src/features/central-create/components/CentralCreateWorkspace.tsx",
            "utf8"
        ),
        readFile(
            "src/features/central-create/components/YearReportProgress.tsx",
            "utf8"
        ),
        readFile(
            "src/features/manual-entry/components/FinancialEntriesForm.tsx",
            "utf8"
        ),
        readFile(
            "src/features/manual-entry/components/MultiEntryForm.tsx",
            "utf8"
        ),
    ])

    assert.match(view, /topbarProgress=/)
    assert.match(view, /<YearReportProgress/)
    assert.match(view, /contextPanel=\{sidebar\}/)
    assert.doesNotMatch(view, /getResolvedReportSectionCount\(sectionSnapshots\)/)
    assert.doesNotMatch(workspace, /Overall progress/)
    assert.match(yearProgress, /useReportsOverview\(year\)/)
    assert.match(yearProgress, /\{year\} Progress/)
    assert.match(yearProgress, /query\.data\?\.months/)
    assert.match(yearProgress, /REPORT_WIZARD_SECTIONS\.map/)
    assert.match(yearProgress, /<Accordion/)
    assert.match(yearProgress, /createReportWizardHref/)
    assert.match(yearProgress, /report\.id/)
    assert.match(yearProgress, /Current/)
    assert.match(yearProgress, /submitted/)
    assert.match(view, /Confirm no activity/)
    assert.match(view, /section\.canConfirmNoActivity === true/)
    assert.match(view, /getReportWizardSectionDisplayLabel\(item\.key, item\.label\)/)
    assert.match(view, /Undo — I need to enter activity/)
    assert.match(view, /status: "no_activity" \| "not_started"/)
    assert.match(form, /kind !== "expenses" && "lg:grid-cols-3"/)
    assert.match(form, /grid gap-1\.5 sm:col-span-2/)
    assert.match(form, /renderSummary/)
    assert.match(form, /Add notes/)
    assert.match(multiEntry, /activeIndex/)
})

test("wizard display labels and no-activity eligibility use section configuration", async () => {
    const [types, workflowTypes, yearProgress, sidebar] = await Promise.all([
        readFile("src/features/report-wizard/config/report-types.ts", "utf8"),
        readFile("src/features/reports/workflow/types.ts", "utf8"),
        readFile(
            "src/features/central-create/components/YearReportProgress.tsx",
            "utf8"
        ),
        readFile(
            "src/features/report-wizard/components/ReportWizardSidebar.tsx",
            "utf8"
        ),
    ])

    assert.match(types, /label: "General Income"/)
    assert.match(types, /label: "Operating Costs"/)
    assert.match(types, /label: "Other Expenses"/)
    assert.match(types, /id: "expenses"[\s\S]*canConfirmNoActivity: true/)
    assert.doesNotMatch(types, /label: "Revenue"|label: "Operating Expenses"|label: "Activity & Other Expenses"/)
    assert.doesNotMatch(workflowTypes, /label: "Revenue"|label: "Operating Expenses"|label: "Activity & Other Expenses"/)
    assert.match(yearProgress, /item\.meta\.navigationLabel \?\? item\.meta\.label/)
    assert.match(sidebar, /step\.navigationLabel \?\? step\.label/)
})

test("uploads are unified and review bypasses upload mode", async () => {
    const [view, engine, dropzone] = await Promise.all([
        readFile("src/features/report-wizard/views/ReportWizardView.tsx", "utf8"),
        readFile("src/features/uploads/components/UploadEngine.tsx", "utf8"),
        readFile("src/features/uploads/components/UploadDropzone.tsx", "utf8"),
    ])

    assert.match(view, /section\.id === "review" \? \(/)
    assert.match(view, /<ReviewSubmitPanel reportId=\{reportId\}/)
    assert.match(engine, /const isImage = selectedFile\.type\.startsWith/)
    assert.doesNotMatch(engine, /ToggleGroup/)
    assert.doesNotMatch(engine, /aria-label="Spreadsheet upload"|aria-label="Image upload"/)
    assert.match(dropzone, /Excel sheets, CSVs, or images/)
})

test("Sunday School manual entry renders the attendance form directly", async () => {
    const view = await readFile(
        "src/features/report-wizard/views/ReportWizardView.tsx",
        "utf8"
    )

    assert.match(view, /<SundaySchoolAttendanceForm/)
    assert.match(view, /reportId=\{effectiveReportId\}/)
    assert.doesNotMatch(view, /<SundaySchoolAttendanceView/)
})
