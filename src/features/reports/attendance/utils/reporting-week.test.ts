import assert from "node:assert/strict"
import test from "node:test"
import { attendanceReportingWeek } from "./reporting-week"

test("reporting weeks use real period boundaries, including a partial first week", () => {
    const first = attendanceReportingWeek("2026-09-06", "2026-09-01", "2026-09-30")
    assert.equal(first.key, "2026-08-31")
    assert.equal(first.label, "Week 1 — Homecell Attendance · 1 Sept 2026 – 6 Sept 2026")
    const last = attendanceReportingWeek("2026-09-30", "2026-09-01", "2026-09-30")
    assert.equal(last.label, "Week 5 — Homecell Attendance · 28 Sept 2026 – 30 Sept 2026")
})

test("records in the same reporting week share a table key", () => {
    const monday = attendanceReportingWeek("2026-09-07", "2026-09-01", "2026-09-30")
    const sunday = attendanceReportingWeek("2026-09-13", "2026-09-01", "2026-09-30")
    assert.deepEqual(monday, sunday)
    assert.match(monday.label, /^Week 2 /)
})

test("empty weeks do not renumber later records", () => {
    assert.match(attendanceReportingWeek("2026-09-21", "2026-09-01", "2026-09-30").label, /^Week 4 /)
})

test("week labels handle leap years and periods crossing the year boundary", () => {
    assert.match(attendanceReportingWeek("2024-02-29", "2024-02-01", "2024-02-29").label, /26 Feb 2024 – 29 Feb 2024$/)
    assert.match(attendanceReportingWeek("2027-01-01", "2026-12-28", "2027-01-10").label, /^Week 1 .*28 Dec 2026 – 3 Jan 2027$/)
})

test("invalid dates do not crash the attendance view", () => {
    assert.deepEqual(attendanceReportingWeek("invalid"), { key: "undated", label: "Homecell Attendance — date unavailable" })
})
