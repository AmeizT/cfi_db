import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import {
  createMonthlyReportHref,
  getMonthlyReportResumeSection,
} from "../monthly-report/routing.ts";
import {
  createReportWizardHref,
  getReportWizardResumeSection,
} from "../../report-wizard/config/report-types.ts";

test("new monthly report routing preserves the complete report context", () => {
  const href = createMonthlyReportHref("expenses", {
    method: "upload",
    upload_type: "photo",
    report_id: 42,
    amendment_context: "grace-period",
  });
  const url = new URL(href, "https://workspace.test");

  assert.equal(url.pathname, "/create");
  assert.equal(url.searchParams.get("workspace"), "monthly-report");
  assert.equal(url.searchParams.get("section"), "expenses");
  assert.equal(url.searchParams.get("method"), "upload");
  assert.equal(url.searchParams.get("upload_type"), "photo");
  assert.equal(url.searchParams.get("report_id"), "42");
  assert.equal(url.searchParams.get("amendment_context"), "grace-period");
});

test("manual report routes do not retain an inapplicable upload type", () => {
  const url = new URL(
    createMonthlyReportHref("tithes", {
      method: "manual-entry",
      upload_type: "excel",
      report_id: "9",
    }),
    "https://workspace.test",
  );

  assert.equal(url.searchParams.get("method"), "manual-entry");
  assert.equal(url.searchParams.get("upload_type"), null);
  assert.equal(url.searchParams.get("report_id"), "9");
});

test("existing workflow reports resume at the first unresolved section", () => {
  const report = {
    id: 42,
    status: "draft",
    sections: [
      { key: "general_attendance", resolved: true },
      { key: "sunday_school_attendance", resolved: true },
      { key: "tithes", resolved: false },
      { key: "revenue", resolved: false },
      { key: "activity_other_expenses", resolved: false },
      { key: "operating_expenses", resolved: false },
    ],
  };

  assert.equal(getMonthlyReportResumeSection(report), "tithes");
  assert.equal(
    getMonthlyReportResumeSection({ ...report, status: "locked" }),
    "review",
  );
  assert.equal(
    getMonthlyReportResumeSection({
      ...report,
      sections: report.sections.map((section) => ({ ...section, resolved: true })),
    }),
    "review",
  );
});

test("legacy and new workspaces choose the same resume section and preserve equivalent context", () => {
  const legacyReport = {
    id: 84,
    compliance: {
      sections: [
        { name: "general_attendance", status: "completed" },
        { name: "sunday_school_attendance", status: "completed" },
        { name: "tithes", status: "pending" },
        { name: "revenue", status: "pending" },
        { name: "activity_other_expenses", status: "pending" },
        { name: "operating_expenses", status: "pending" },
      ],
    },
  };
  const workflowReport = {
    id: 84,
    status: "draft",
    sections: legacyReport.compliance.sections.map((section) => ({
      key: section.name,
      name: section.name,
      resolved: section.status !== "pending",
    })),
  };

  const legacySection = getReportWizardResumeSection(legacyReport);
  const newSection = getMonthlyReportResumeSection(workflowReport);
  assert.equal(newSection, legacySection);

  const context = {
    method: "upload",
    upload_type: "excel",
    report_id: 84,
    amendment_context: "reopened",
  };
  const legacyUrl = new URL(createReportWizardHref(legacySection, context), "https://workspace.test");
  const newUrl = new URL(createMonthlyReportHref(newSection, context), "https://workspace.test");
  for (const key of ["method", "upload_type", "report_id", "amendment_context"]) {
    assert.equal(newUrl.searchParams.get(key), legacyUrl.searchParams.get(key));
  }
});

test("Create Home resolves the active report before routing and uses the existing template workflow", async () => {
  const [hub, dashboard] = await Promise.all([
    readFile("src/features/create/CreateHub.tsx", "utf8"),
    readFile("src/features/create/CreateDashboard.tsx", "utf8"),
  ]);

  assert.match(hub, /useCurrentReport\(\)/);
  assert.match(hub, /if \(currentReport\.id\) return \{ report: currentReport, request \}/);
  assert.match(hub, /startCurrentReport/);
  assert.match(hub, /getMonthlyReportResumeSection\(report\)/);
  assert.match(hub, /report_id: report\.id/);
  assert.match(hub, /createCentralTemplatesHref/);
  assert.match(hub, /router\.replace\(href\)/);
  assert.match(dashboard, /action: "templates"/);
  assert.match(dashboard, /title: "Manual entry"[\s\S]*action: "report"[\s\S]*tab: "manual"/);
  assert.match(dashboard, /title: "Uploads"[\s\S]*action: "report"[\s\S]*tab: "uploads"/);
  assert.doesNotMatch(`${hub}\n${dashboard}`, /\/forms\//);
});

test("the new Create workspace reuses production report forms and APIs without the Central Create shell", async () => {
  const [hub, workspace, progress] = await Promise.all([
    readFile("src/features/create/CreateHub.tsx", "utf8"),
    readFile("src/features/create/monthly-report/MonthlyReportWorkspace.tsx", "utf8"),
    readFile("src/features/create/monthly-report/ReportProgressRail.tsx", "utf8"),
  ]);

  assert.match(hub, /MONTHLY_REPORT_WORKSPACE/);
  assert.match(hub, /<MonthlyReportWorkspace section=\{section\}/);
  assert.match(workspace, /AttendanceFormView/);
  assert.match(workspace, /SundaySchoolAttendanceForm/);
  assert.match(workspace, /FinancialEntriesForm/);
  assert.match(workspace, /UploadEngine/);
  assert.match(workspace, /getReportDetail/);
  assert.match(workspace, /updateReportSection/);
  assert.match(workspace, /submitReport/);
  assert.doesNotMatch(workspace, /CentralCreateWorkspace/);
  assert.match(progress, />Report progress</);
  assert.doesNotMatch(progress, />Report Wizard</);
});

test("legacy monthly report routes remain mounted on the legacy implementation", async () => {
  const [legacyPage, legacyCreatePage, legacyView] = await Promise.all([
    readFile("app/(authenticated)/(headless)/(forms)/report-wizard/page.tsx", "utf8"),
    readFile("app/(authenticated)/(headless)/(forms)/report-wizard/create/page.tsx", "utf8"),
    readFile("src/features/report-wizard/views/ReportWizardView.tsx", "utf8"),
  ]);

  assert.match(legacyPage, /report-wizard\/create\/attendance/);
  assert.match(legacyCreatePage, /report-wizard\/create\/attendance/);
  assert.match(legacyView, /CentralCreateWorkspace/);
  assert.match(legacyView, /ReportWizardSidebar/);
});
