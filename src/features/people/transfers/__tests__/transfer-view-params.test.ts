import assert from "node:assert/strict"
import test from "node:test"
// @ts-expect-error Node's built-in TypeScript test runner requires the file extension.
import { buildTransferViewQuery, getTransferView } from "../utils/transfer-view-params.ts"

test("getTransferView defaults missing and invalid values to incoming", () => {
    assert.equal(getTransferView(""), "incoming")
    assert.equal(getTransferView("view=unknown"), "incoming")
})

test("getTransferView reads valid transfer views from search params", () => {
    assert.equal(getTransferView("view=incoming"), "incoming")
    assert.equal(getTransferView("view=outgoing"), "outgoing")
    assert.equal(getTransferView("view=history"), "history")
})

test("buildTransferViewQuery preserves unrelated params and resets page", () => {
    const query = buildTransferViewQuery(
        "view=incoming&page=4&page_size=25&search=smith",
        "outgoing"
    )
    const params = new URLSearchParams(query)

    assert.equal(params.get("view"), "outgoing")
    assert.equal(params.get("page"), "1")
    assert.equal(params.get("page_size"), "25")
    assert.equal(params.get("search"), "smith")
})
