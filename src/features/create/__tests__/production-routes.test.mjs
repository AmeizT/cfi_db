import assert from "node:assert/strict"
import { readFile, readdir } from "node:fs/promises"
import test from "node:test"
import { reportHref } from "../../reports/modules/lib/report-route-redirect.ts"

const shell = "app/(authenticated)/(shell)"
const destinations = {
    members: ["members/directory/new", "MemberForm"],
    households: ["members/households/new", "HouseholdForm"],
    "cell-groups": ["spaces/new", "HomecellForm"],
    assets: ["assets/new", "AssetForm"],
    baptism: ["members/lifecycle/baptisms"],
    "baby-dedication": ["members/lifecycle/dedications"],
}

test("entity routes reuse one form implementation and old Record Center routes redirect", async () => {
    assert.match(await readFile(`${shell}/(forms)/record-center/page.tsx`, "utf8"), /<CreateHub monthlyReport/)
    for (const [entity, [destination, component]] of Object.entries(destinations)) {
        const redirect = await readFile(`${shell}/(forms)/record-center/${entity}/page.tsx`, "utf8")
        assert.ok(redirect.includes(`createLegacyRedirectPage("/${destination}")`))
        if (component) {
            const page = await readFile(`${shell}/(dashboard)/${destination}/page.tsx`, "utf8")
            assert.ok(page.includes(`@/features/create/forms/${component}`))
            assert.match(page, new RegExp(`<${component} />`))
        }
    }
    assert.deepEqual(await readdir("src/features/record-center/forms").catch(error => {
        if (error.code === "ENOENT") return []
        throw error
    }), [])
})

test("legacy create routes go directly to entity destinations", async () => {
    const targets = { ...destinations, homecells: destinations["cell-groups"] }
    for (const [entity, [destination]] of Object.entries(targets)) {
        const source = await readFile(`${shell}/(forms)/create/${entity}/page.tsx`, "utf8")
        assert.ok(source.includes(`createLegacyRedirectPage("/${destination}")`))
    }
    for (const entity of ["members", "households", "homecells", "assets"]) {
        const source = await readFile(`${shell}/(forms)/create/new/${entity}/page.tsx`, "utf8")
        assert.ok(source.includes(`createLegacyRedirectPage("/${targets[entity][0]}")`))
    }
    const source = await readFile(`${shell}/(forms)/create/page.tsx`, "utf8")
    assert.ok(source.includes('createLegacyRedirectPage("/record-center")'))
})

test("redirects retain query context including repeated parameters", () => {
    const href = reportHref("/members/directory/new", { assembly: "4", tag: ["one", "two"], search: "a b" })
    const url = new URL(href, "https://workspace.test")
    assert.equal(url.searchParams.get("assembly"), "4")
    assert.deepEqual(url.searchParams.getAll("tag"), ["one", "two"])
    assert.equal(url.searchParams.get("search"), "a b")
})

test("Record Center retains the period control without flat entity navigation", async () => {
    const source = await readFile("src/features/record-center/views/RecordCenterShell.tsx", "utf8")
    assert.match(source, /<MonthlyReportSplitButton/)
    assert.match(source, /useCurrentReport/)
    for (const entity of Object.keys(destinations)) assert.ok(!source.includes(`/record-center/${entity}`))
    assert.doesNotMatch(source, /recordCenterItems|linear-gradient|radial-gradient/)
})
