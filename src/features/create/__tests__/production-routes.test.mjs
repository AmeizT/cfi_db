import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import test from "node:test"

const root = "app/(authenticated)/(headless)/(forms)/create"

test("production Create Home and form routes mount the existing components", async () => {
    assert.match(await readFile(`${root}/page.tsx`, "utf8"), /<CreateHub/)
    for (const [entity, component] of Object.entries({
        members: "MemberForm", households: "HouseholdForm",
        homecells: "HomecellForm", assets: "AssetForm",
    })) {
        assert.match(await readFile(`${root}/${entity}/page.tsx`, "utf8"), new RegExp(`<${component}`))
        assert.match(await readFile(`${root}/new/${entity}/page.tsx`, "utf8"), new RegExp(`/create/${entity}`))
    }
})

test("old Create Home preserves query context in its compatibility redirect", async () => {
    const source = await readFile(`${root}/new/page.tsx`, "utf8")
    assert.match(source, /params.append\(key, item\)/)
    assert.match(source, /redirect\(`\/create/)
    assert.doesNotMatch(source, /report-wizard|\/forms\//)
})
