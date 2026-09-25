import assert from "node:assert/strict"
import test from "node:test"
import { createElement, Fragment } from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { MultiEntryForm } from "../components/MultiEntryForm"
import { FinancialUploadReview } from "../components/FinancialUploadReview"
import { readFile } from "node:fs/promises"

const noop = () => {}
test("inline entry table renders every draft field, saved rows without delete, and one section save", () => {
    const html = renderToStaticMarkup(createElement(MultiEntryForm, {
        inline: { headers: ["Contributor", "Amount"], addLabel: "Add tithe", savedRows: [{ id: "saved", cells: ["Saved member", "0.00"] }] },
        rows: [{ id: "one" }, { id: "two" }], totalLabel: "250.00", isPending: false,
        onAddRow: noop, onRemoveRow: noop, onCancel: noop,
        renderRow: (_row, index) => createElement("div", null, createElement(Fragment, null, createElement("input", { name: `member-${index}` }), createElement("input", { name: `amount-${index}` }))),
    }))
    assert.equal((html.match(/<input /g) ?? []).length, 4)
    assert.equal((html.match(/Remove unsaved row [12]/g) ?? []).length, 2)
    assert.ok(html.includes("Saved member"))
    assert.ok(html.includes("0.00"))
    assert.equal((html.match(/type="submit"/g) ?? []).length, 1)
    assert.ok(html.includes("Save &amp; Continue"))
    assert.ok(html.indexOf("member-1") < html.indexOf("Add tithe"))
})

test("uploaded financial rows use the same inline table with row errors and legitimate zero values", () => {
    const html = renderToStaticMarkup(createElement(FinancialUploadReview, {
        kind: "expenses", data: [{ name: "Item", price: 0, quantity: 1, invoice_date: "2026-09-01", category: "other" }],
        errors: [{ row: 2, field: "category", message: "Check category" }], disabled: false,
        onChange: noop, onAdd: noop, onRemove: noop, onSubmit: async () => {}, onCancel: noop,
    }))
    assert.ok(html.includes('value="0"'))
    assert.ok(html.includes('aria-invalid="true"'))
    assert.ok(html.includes("Check category"))
    assert.ok(html.includes("Add expense"))
    assert.ok(html.includes("0.00"))
})

test("Save & Continue uses existing section mutations and only navigates after success", async () => {
    const form = await readFile("src/features/manual-entry/components/FinancialEntriesForm.tsx", "utf8")
    assert.match(form, /mutation.mutateAsync\(body\)/)
    assert.match(form, /form.setError\(path/)
    assert.ok(form.indexOf("onSaved?.();", form.indexOf("mutation.mutateAsync(body)")) > form.indexOf("mutation.mutateAsync(body)"))
    const workspace = await readFile("src/features/create/monthly-report/MonthlyReportWorkspace.tsx", "utf8")
    assert.match(workspace, /onSaved=\{continueAfterSave\}/)
    assert.match(workspace, /capabilities.is_editable/)
    const footer = await readFile("src/features/create/monthly-report/MonthlyReportFooter.tsx", "utf8")
    assert.match(footer, /type="submit" form=\{submitFormId\}/)
})
