import assert from "node:assert/strict"
import test from "node:test"
import { isReportDataReadOnly } from "../config/report-context"
import type { ReportCapabilities, ReportStatus } from "@/features/reports/workflow/types"

const capabilities: ReportCapabilities = {
    is_overdue: true,
    is_locked: false,
    is_editable: true,
    can_submit: true,
    can_amend: false,
    can_request_reopen: false,
    can_approve_reopen: false,
}

test("Overdue is a deadline status, not a denial of inline edit permission", () => {
    assert.equal(isReportDataReadOnly({ status: "overdue", capabilities }), false)
    assert.equal(isReportDataReadOnly({
        status: "overdue",
        capabilities: { ...capabilities, is_editable: false },
    }), true)
})

test("draft, ready and reopened reports honor server edit permission", () => {
    for (const status of ["draft", "ready_to_submit", "reopened"] as ReportStatus[]) {
        assert.equal(isReportDataReadOnly({ status, capabilities }), false)
        assert.equal(isReportDataReadOnly({
            status,
            capabilities: { ...capabilities, is_editable: false },
        }), true)
    }
})

test("submitted and locked reports retain the existing amendment flow", () => {
    for (const status of ["submitted", "locked"] as ReportStatus[]) {
        assert.equal(isReportDataReadOnly({ status, capabilities }), true)
    }
})

test("an unloaded or failed report query does not enable editing", () => {
    assert.equal(isReportDataReadOnly(undefined), true)
})
