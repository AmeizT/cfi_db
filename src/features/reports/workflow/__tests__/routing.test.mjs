import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import test from "node:test"

import {
  adjacentReportPeriod,
  reportDestination,
  reportPeriodHref,
} from "../format.ts"
import {
  REPORT_SECTION_WIZARD_ROUTES,
  createReportSectionWizardHref,
} from "../../../report-wizard/config/report-routing.ts"
import { createSourceRecordsHref } from "../../../workspace/config/report-source-routing.ts"

test("every month state resolves to the same canonical period route", () => {
  for (const status of [
    "not_started", "draft", "ready_to_submit", "overdue", "submitted",
    "locked", "reopened", "not_required",
  ]) {
    assert.equal(
      reportDestination({ id: status === "not_started" ? null : 42, status, period_start: "2026-06-01" }),
      "/reports/period/2026-06",
    )
  }
})

test("month navigation crosses year boundaries on the canonical route", () => {
  assert.equal(adjacentReportPeriod("2026-01-01", -1), "/reports/period/2025-12")
  assert.equal(adjacentReportPeriod("2026-12-01", 1), "/reports/period/2027-01")
  assert.equal(reportPeriodHref(new Date(2026, 5, 1)), "/reports/period/2026-06")
})

test("all report sections route through the Report Wizard with context intact", () => {
  assert.deepEqual(Object.keys(REPORT_SECTION_WIZARD_ROUTES), [
    "general_attendance",
    "sunday_school_attendance",
    "tithes",
    "revenue",
    "operating_expenses",
    "activity_other_expenses",
    "review",
  ])
  assert.equal(
    createReportSectionWizardHref("operating_expenses", {
      method: "upload",
      upload_type: "excel",
      report_id: 84,
      amendment_context: "reopened",
    }),
    "/report-wizard/create/overhead?method=upload&upload_type=excel&report_id=84&amendment_context=reopened",
  )
  assert.equal(createReportSectionWizardHref("review", { report_id: 84 }), "/report-wizard/create/review?method=manual-entry&report_id=84")
})

test("submitted sections open operational source records without reusing Wizard routes", () => {
  assert.equal(
    createSourceRecordsHref("revenue", { period: "2026-06-01", reportId: 84 }),
    "/finance/revenue?period=2026-06&report_id=84&section=revenue",
  )
  assert.doesNotMatch(createSourceRecordsHref("tithes", { reportId: 84 }), /report-wizard/)
})

test("Current Report remains a shortcut that redirects to the canonical current period", async () => {
  const navigation = await readFile("src/config/workspace-navigation.ts", "utf8")
  const currentPage = await readFile("app/(authenticated)/(shell)/(dashboard)/reports/current/page.tsx", "utf8")
  assert.match(navigation, /label: "Current Report",\s+href: APP_ROUTES\.reports\.current/)
  assert.match(currentPage, /redirect\(reportPeriodHref\(new Date\(\)\)\)/)
})
