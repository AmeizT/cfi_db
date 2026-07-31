import assert from "node:assert/strict"
import test from "node:test"
// @ts-expect-error Node's built-in TypeScript test runner requires the file extension.
import { normalizeListResponse } from "../utils/helpers.ts"

test("normalizeListResponse preserves paginated count and current page rows", () => {
    const result = normalizeListResponse({
        count: 25,
        next: "http://api.test/reports/1/tithes/?page=3",
        previous: "http://api.test/reports/1/tithes/",
        results: [
            { id: 11, amount: "10.00" },
            { id: 12, amount: "12.00" },
        ],
    })

    assert.equal(result.count, 25)
    assert.deepEqual(result.rows.map((row) => row.id), [11, 12])
    assert.equal(result.data.length, 2)
})

test("normalizeListResponse does not re-count paginated rows as the total", () => {
    const result = normalizeListResponse({
        count: 100,
        results: [{ id: 1 }],
    })

    assert.equal(result.count, 100)
    assert.equal(result.rows.length, 1)
})
