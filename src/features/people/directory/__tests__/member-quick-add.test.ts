import assert from "node:assert/strict"
import test from "node:test"
import { createElement, type ReactElement } from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { createFormControl, FormProvider, type UseFormReturn } from "react-hook-form"
import { MemberQuickAdd } from "../../members/components/MemberQuickAdd"
import { memberCreateSchema } from "@/features/create/forms/contracts"
import { readFile } from "node:fs/promises"

const minimal = { first_name: "Ada", last_name: "Lovelace", date_of_birth: "1990-12-10", gender: "Female", country: "Namibia", phone_number: "" }

function quickForm() {
    const methods = createFormControl({ shouldUnregister: true, defaultValues: { phone_number: "", ministries: [], positions: [] } })
    const shell = MemberQuickAdd({ onCancel() {} })
    const html = renderToStaticMarkup(createElement(FormProvider, {
        ...methods,
        formState: { errors: {} },
        children: shell.props.children as ReactElement,
    } as unknown as UseFormReturn & { children: ReactElement }))
    return { methods, shell, html }
}

test("quick add exposes the actual required fields and reuses the full form shell", async () => {
    const { methods, shell, html } = quickForm()
    assert.equal(shell.props.entity, "members")
    assert.equal(shell.props.inline.fullFormHref, "/members/directory/new")
    for (const field of Object.keys(minimal)) assert.ok(html.includes(`name="${field}"`))
    assert.equal((html.match(/<input /g) ?? []).length, 5)
    assert.equal((html.match(/<select /g) ?? []).length, 1)
    assert.ok(!html.includes('name="ministries"'))
    for (const [name, value] of Object.entries(minimal)) methods.setValue(name as "phone_number", value)
    let submitted: unknown
    await methods.handleSubmit(values => { submitted = values })()
    const payload = memberCreateSchema.parse(submitted)
    assert.deepEqual(payload, { ...minimal, ministries: [], positions: [] })
})

test("the existing member schema rejects missing required fields and invalid phone without changing inputs", () => {
    for (const name of ["first_name", "last_name", "date_of_birth", "gender", "country"]) {
        const values = { ...minimal, ministries: [], positions: [], [name]: "" }
        const snapshot = structuredClone(values)
        assert.equal(memberCreateSchema.safeParse(values).success, false)
        assert.deepEqual(values, snapshot)
    }
    assert.equal(memberCreateSchema.safeParse({ ...minimal, phone_number: "bad", ministries: [], positions: [] }).success, false)
})

test("quick add lives below the header and outside the listbox, with the backend creation capability", async () => {
    const panel = await readFile("src/features/people/shared/master-detail/entity-list-panel.tsx", "utf8")
    assert.ok(panel.indexOf("{header}") < panel.indexOf("{listStart}"))
    assert.ok(panel.indexOf("{listStart}") < panel.indexOf('role="listbox"'))
    const directory = await readFile("src/features/people/directory/components/directory-view.tsx", "utf8")
    assert.match(directory, /const canCreate = options.data\?\.can_create_member === true/)
    assert.match(directory, /const canManage = canManagePeople\(userQuery.data\)/)
    assert.match(directory, /primaryAction: canCreate \?/)
    assert.match(directory, /listStart: canCreate && open \? <button/)
    assert.match(directory, /content: <MemberQuickAdd onCancel=\{close\} onCreated=/)
})
