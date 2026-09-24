import assert from "node:assert/strict"
import test from "node:test"
import { createElement, type ReactElement } from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { createFormControl, FormProvider, type UseFormReturn } from "react-hook-form"
import { readFile } from "node:fs/promises"
import { AssetQuickAdd } from "../components/AssetQuickAdd"
import { assetCreateSchema } from "@/features/create/forms/contracts"

const minimum = { item_name: "Keyboard", asset_type: "Instrument", acquisition_date: "2026-09-14", condition: "New", units: "1" }

test("asset quick add exposes required fields and reuses the existing form submission", async () => {
    const calls: string[] = []
    const shell = AssetQuickAdd({ onCancel: () => calls.push("cancel"), onCreated: id => calls.push(id) })
    assert.equal(shell.props.entity, "assets")
    assert.equal(shell.props.inline.fullFormHref, "/assets/new")
    assert.equal(shell.props.inline.presentation, "row")
    const methods = createFormControl<Record<string, unknown>>({ shouldUnregister: true })
    const html = renderToStaticMarkup(createElement(FormProvider, { ...methods, formState: { errors: {} }, children: shell.props.children as ReactElement } as unknown as UseFormReturn & { children: ReactElement }))
    for (const field of Object.keys(minimum)) assert.ok(html.includes(`name="${field}"`))
    assert.ok(!html.includes('value="0"'))
    assert.equal((html.match(/required=""/g) ?? []).length, 5)
    for (const [name, value] of Object.entries(minimum)) methods.setValue(name, value)
    let submitted: unknown
    await methods.handleSubmit(values => { submitted = values })()
    assert.deepEqual(JSON.parse(JSON.stringify(assetCreateSchema.parse(submitted))), { ...minimum, units: 1 })
    shell.props.inline.onCancel()
    assert.deepEqual(calls, ["cancel"])
})

test("existing Asset validation distinguishes missing units from explicit zero and validates decimal money", () => {
    assert.equal(assetCreateSchema.safeParse({ ...minimum, units: "" }).success, false)
    const zero = assetCreateSchema.parse({ ...minimum, units: "0", acquisition_cost: "0.00" })
    assert.equal(zero.units, 0)
    assert.equal(zero.acquisition_cost, "0.00")
    assert.equal(assetCreateSchema.safeParse({ ...minimum, acquisition_cost: "12.345" }).success, false)
    assert.equal(assetCreateSchema.safeParse({ ...minimum, item_name: "   " }).success, false)
})

test("table and card entry points share one create surface and remain available for empty collections", async () => {
    const source = await readFile("src/features/finance/assets/views/AssetsView.tsx", "utf8")
    assert.match(source, /trailingRow=\{creating \? <AssetQuickAdd/)
    assert.equal((source.match(/<AssetQuickAdd onCancel=\{closeCreate\} onCreated=\{handleCreated\}/g) ?? []).length, 2)
    assert.match(source, /border-dashed/)
    assert.doesNotMatch(source, /New Asset<|!isLoading && assets.length === 0 \?/)
    const table = await readFile("src/features/reports/core/components/DataTable.tsx", "utf8")
    assert.ok(table.indexOf("<DataTableBody") < table.indexOf("<TableFooter>"))
    assert.match(table, /groupIndex === rowGroups.length - 1/)
})
