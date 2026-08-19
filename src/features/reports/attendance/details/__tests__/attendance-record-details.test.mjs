import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import test from "node:test"

import {
    getAttendanceRecordTitle,
    parseAttendanceList,
    safeAttendanceReturnPath,
} from "../attendance-record-format.ts"

const featureRoot = new URL("../", import.meta.url)
const projectRoot = new URL("../../../../../../", import.meta.url)

test("record labels are derived from server values", () => {
    assert.equal(
        getAttendanceRecordTitle({
            is_special_event: true,
            special_event_name: "Annual Thanksgiving",
            service_type: "sunday",
        }),
        "Annual Thanksgiving"
    )
    assert.equal(
        getAttendanceRecordTitle({ service_type: "midweek" }),
        "Midweek Service"
    )
    assert.deepEqual(
        parseAttendanceList("John 3:16; Romans 8:1\nPsalm 23"),
        ["John 3:16", "Romans 8:1", "Psalm 23"]
    )
})

test("back links keep local attendance filters and reject external URLs", () => {
    const filtered = "/engagement/attendance?sheet=sunday&page=3"
    assert.equal(safeAttendanceReturnPath(filtered, "/fallback"), filtered)
    assert.equal(safeAttendanceReturnPath("//example.com", "/fallback"), "/fallback")
    assert.equal(safeAttendanceReturnPath("https://example.com", "/fallback"), "/fallback")
})

test("detail loading and navigation are ID-backed", async () => {
    const [service, grid, workspaceRoute, reportRoute] = await Promise.all([
        readFile(new URL("attendance-record-detail-service.ts", featureRoot), "utf8"),
        readFile(
            new URL("../views/AttendanceDataGrid.tsx", featureRoot),
            "utf8"
        ),
        readFile(
            new URL(
                "app/(workspace)/engagement/attendance/records/[recordId]/page.tsx",
                projectRoot
            ),
            "utf8"
        ),
        readFile(
            new URL(
                "app/(dashboard)/reports/ministry/attendance/records/[recordId]/page.tsx",
                projectRoot
            ),
            "utf8"
        ),
    ])

    assert.match(service, /apiRoutes\.attendance\.detail\(recordId\)/)
    assert.match(grid, /records\/\$\{row\.id\}/)
    assert.match(grid, /return_to/)
    assert.match(workspaceRoute, /recordId/)
    assert.match(reportRoute, /recordId/)
    assert.doesNotMatch(service, /mock|fixture/i)
})
