import * as XLSX from "xlsx"

// Only the first sheet is parsed by the existing upload flow. Keep every column,
// including unrecognized columns, when submitting the user's reviewed values.
export function buildReviewedSpreadsheet(rows: Record<string, unknown>[]) {
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(rows), "Report")
    return new File([XLSX.write(workbook, { type: "array", bookType: "xlsx" })], "reviewed-report.xlsx", {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    })
}
