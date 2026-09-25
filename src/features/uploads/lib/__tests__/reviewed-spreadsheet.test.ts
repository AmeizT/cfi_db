import assert from "node:assert/strict"
import test from "node:test"
import * as XLSX from "xlsx"
import { buildReviewedSpreadsheet } from "../reviewed-spreadsheet"

test("reviewed spreadsheet submits edited values, zeros, dates and extra columns to the existing parser", async () => {
    const rows = [
        { member_name: "Example Member", amount: 0, timestamp: "2026-09-05", notes: "Corrected", custom_column: "Kept" },
        { member_name: "Another Member", amount: "250.00", timestamp: 46200, notes: "", custom_column: "Also kept" },
    ]
    const file = buildReviewedSpreadsheet(rows)
    const workbook = XLSX.read(await file.arrayBuffer(), { type: "array" })
    assert.deepEqual(XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]), rows)
    assert.equal(file.name, "reviewed-report.xlsx")
})
