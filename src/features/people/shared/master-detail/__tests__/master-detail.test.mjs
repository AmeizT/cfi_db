import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import test from "node:test"
import { applySearchParamUpdates, clampPage, displayValue, getInitials } from "../entity-master-detail.utils.ts"

const root = new URL("../../../", import.meta.url)

async function source(path) {
    return readFile(new URL(path, root), "utf8")
}

test("URL updates preserve unrelated state and repeated filters", () => {
    const current = new URLSearchParams("selected=one&tab=overview&search=ann&sort=name&filters=active&filters=local&page=2")
    const next = applySearchParamUpdates(current, { selected: "two" })
    assert.equal(next.get("selected"), "two")
    assert.equal(next.get("tab"), "overview")
    assert.equal(next.get("search"), "ann")
    assert.equal(next.get("sort"), "name")
    assert.deepEqual(next.getAll("filters"), ["active", "local"])
    assert.equal(next.get("page"), "2")
})

test("URL updates delete only explicitly cleared parameters", () => {
    const next = applySearchParamUpdates("selected=one&tab=notes&page=3", { selected: null, page: null })
    assert.equal(next.get("selected"), null)
    assert.equal(next.get("page"), null)
    assert.equal(next.get("tab"), "notes")
})

test("display utilities produce safe neutral values", () => {
    assert.equal(getInitials("Tsholo Motlhabi"), "TM")
    assert.equal(displayValue(null), "—")
    assert.equal(clampPage(-4), 1)
    assert.equal(clampPage(3.8), 3)
})

test("Directory and Households compose the shared master-detail view inside View", async () => {
    const [directory, households] = await Promise.all([
        source("directory/components/directory-view.tsx"),
        source("families/views/HouseholdsView.tsx"),
    ])
    for (const content of [directory, households]) {
        assert.match(content, /<View/)
        assert.match(content, /<EntityMasterDetailView/)
    }
})

test("all directory segments use backend-backed adapters", async () => {
    const directory = await source("directory/components/directory-view.tsx")
    assert.match(directory, /useMembersDirectoryPage/)
    assert.match(directory, /useChildrenDirectory/)
    assert.match(directory, /FormerMembersDirectory/)
    assert.doesNotMatch(directory, /mock|fixture/i)
})

test("selection uses existing backend identifiers", async () => {
    const [directory, former, households] = await Promise.all([
        source("directory/components/directory-view.tsx"),
        source("former-members/components/former-members-directory.tsx"),
        source("families/views/HouseholdsView.tsx"),
    ])
    assert.match(directory, /member\.member_key/)
    assert.match(former, /String\(former\.id\)/)
    assert.match(households, /String\(household\.id\)/)
})

test("responsive and accessibility states are owned by the shared shell", async () => {
    const [view, item, detail] = await Promise.all([
        source("shared/master-detail/entity-master-detail-view.tsx"),
        source("shared/master-detail/entity-list-item.tsx"),
        source("shared/master-detail/entity-detail-panel.tsx"),
    ])
    assert.match(view, /min-width: 1024px/)
    assert.match(item, /aria-selected/)
    assert.match(item, /focus-visible:ring/)
    assert.match(detail, /lg:hidden/)
})
