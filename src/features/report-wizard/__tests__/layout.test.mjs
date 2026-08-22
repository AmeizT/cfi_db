import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import test from "node:test"

import { createReportWizardHref } from "../config/report-routing.ts"

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
})

test("wizard uses the canonical sections in a responsive workspace shell", async () => {
    const [view, sidebar, header, footer] = await Promise.all([
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
    ])

    assert.doesNotMatch(view, /ReportWizardStepper|<StepRail/)
    assert.match(
        view,
        /xl:grid-cols-\[250px_minmax\(0,1fr\)\] 2xl:grid-cols-\[250px_minmax\(0,1fr\)_320px\]/
    )
    assert.match(view, /<ReportWizardHeader/)
    assert.match(view, /<ReportWizardFooter/)
    assert.match(view, /<Sheet>/)
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
    assert.match(header, />\s*Manual\s*</)
    assert.match(header, />\s*Uploads\s*</)
    assert.match(footer, /Skip this section/)
    assert.match(footer, /sticky bottom-0/)
})

test("reporting progress summarizes the active report and finance entries collapse", async () => {
    const [view, progress, form, multiEntry] = await Promise.all([
        readFile("src/features/report-wizard/views/ReportWizardView.tsx", "utf8"),
        readFile(
            "src/features/report-wizard/components/ReportingProgressPanel.tsx",
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

    assert.match(progress, />\s*Report Progress\s*</)
    assert.match(progress, /Overall progress/)
    assert.match(progress, /Need attention/)
    assert.doesNotMatch(progress, /partialReports|Accordion/)
    assert.match(view, /sticky top-4 hidden/)
    assert.match(form, /kind !== "expenses" && "lg:grid-cols-3"/)
    assert.match(form, /grid gap-1\.5 sm:col-span-2/)
    assert.match(form, /renderSummary/)
    assert.match(form, /Add notes/)
    assert.match(multiEntry, /activeIndex/)
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
