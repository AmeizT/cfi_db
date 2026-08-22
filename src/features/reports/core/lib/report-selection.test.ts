import assert from "node:assert/strict"
import test from "node:test"
import type { AssemblyReport } from "@/dal/types"
import {
    createReportSelectionQuery,
    resolveLatestRelevantReport,
    resolveReportSelection,
} from "./report-selection"

function report(id: number, period: string): AssemblyReport {
    return {
        id,
        assembly: 1,
        period_start: `${period}-01`,
        period_end: `${period}-28`,
    }
}

test("latest report selection prefers the newest completed calendar period", () => {
    const selected = resolveLatestRelevantReport(
        [report(48, "2026-06"), report(50, "2026-07"), report(51, "2026-08")],
        new Date(2026, 7, 22),
    )

    assert.equal(selected?.id, 50)
})

test("latest report selection falls back across a missing month", () => {
    const selected = resolveLatestRelevantReport(
        [report(47, "2026-05"), report(48, "2026-06")],
        new Date(2026, 7, 22),
    )

    assert.equal(selected?.id, 48)
})

test("an explicit valid report wins while an unknown ID falls back", () => {
    const reports = [report(48, "2026-06"), report(50, "2026-07")]
    const now = new Date(2026, 7, 22)

    assert.equal(resolveReportSelection(reports, "48", now)?.id, 48)
    assert.equal(resolveReportSelection(reports, "999", now)?.id, 50)
})

test("selection and canonical query handle a year boundary", () => {
    const selected = resolveLatestRelevantReport(
        [report(60, "2026-12"), report(61, "2027-01")],
        new Date(2027, 0, 10),
    )

    assert.equal(selected?.id, 60)

    const query = new URLSearchParams(
        createReportSelectionQuery(new URLSearchParams("filter=active"), selected!),
    )
    assert.equal(query.get("reportId"), "60")
    assert.equal(query.get("period"), "year:2026")
    assert.equal(query.get("page"), "1")
    assert.equal(query.get("filter"), "active")
})

test("query construction preserves an existing tab and valid page", () => {
    const query = new URLSearchParams(createReportSelectionQuery(
        new URLSearchParams("tab=expenses&page=3"),
        report(50, "2026-07"),
        { defaultTab: "statement" },
    ))

    assert.equal(query.get("tab"), "expenses")
    assert.equal(query.get("page"), "3")
})

test("report navigation resets pagination without inventing a tab", () => {
    const query = new URLSearchParams(createReportSelectionQuery(
        new URLSearchParams("page=5&report_id=50"),
        report(50, "2026-07"),
        { resetPage: true },
    ))

    assert.equal(query.get("page"), "1")
    assert.equal(query.has("tab"), false)
    assert.equal(query.has("report_id"), false)
})
