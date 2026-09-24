import assert from "node:assert/strict"
import test from "node:test"
import { createElement, type ReactElement } from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { createFormControl, FormProvider, type UseFormReturn } from "react-hook-form"
import { readFile } from "node:fs/promises"
import { HouseholdQuickAdd } from "../components/HouseholdQuickAdd"
import { householdCreateSchema } from "@/features/create/forms/contracts"

test("household draft reuses the create shell and submits a name-only valid record", async () => {
    const methods = createFormControl<Record<string, unknown>>({ shouldUnregister: true })
    const calls: string[] = []
    const shell = HouseholdQuickAdd({ onCancel: () => calls.push("cancel"), onCreated: id => calls.push(id) })
    assert.equal(shell.props.entity, "households")
    assert.equal(shell.props.inline.presentation, "detail")
    assert.equal(shell.props.inline.fullFormHref, "/members/households/new")
    const html = renderToStaticMarkup(createElement(FormProvider, { ...methods, formState: { errors: {} }, children: shell.props.children as ReactElement } as unknown as UseFormReturn & { children: ReactElement }))
    assert.ok(html.includes('name="name"'))
    assert.ok(!html.includes('name="head_of_household"'))
    assert.ok(!html.includes('name="member_ids"'))
    assert.equal((html.match(/required=""/g) ?? []).length, 1)
    methods.setValue("name", "Example household")
    let payload: unknown
    await methods.handleSubmit(values => { payload = values })()
    assert.deepEqual(JSON.parse(JSON.stringify(householdCreateSchema.parse(payload))), { name: "Example household" })
    shell.props.inline.onCancel()
    assert.deepEqual(calls, ["cancel"])
})

test("blank names are rejected and ownership/relationship inputs are stripped by the existing schema", () => {
    assert.equal(householdCreateSchema.safeParse({ name: "   " }).success, false)
    assert.deepEqual(householdCreateSchema.parse({ name: "Home", assembly: 2, member_ids: [1], head_of_household: 1 }), { name: "Home" })
})

test("Households retains its permission gate and uses the draft/detail slots", async () => {
    const source = await readFile("src/features/people/families/views/HouseholdsView.tsx", "utf8")
    assert.match(source, /primaryAction: canCreate \?/)
    assert.match(source, /listStart: canCreate && draftOpen/)
    assert.match(source, /detailOverlay: canCreate && draftOpen/)
    assert.match(source, /content: <HouseholdQuickAdd/)
    assert.match(source, /<ScopedHouseholdsView key=\{assemblyId\}/)
    assert.match(source, /<HouseholdProfileHeader household=\{household\} canManage=\{canViewSensitive\}/)
})
