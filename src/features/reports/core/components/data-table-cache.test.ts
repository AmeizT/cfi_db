import assert from "node:assert/strict"
import test from "node:test"
import { optimisticUpdateRecord } from "@/helpers/optistimicUpdate"
import { removeRecordsFromCache } from "@/helpers/removeFromCache"

test("optimistic cell updates preserve and update each report list alias", () => {
    const first = { id: 1, amount: 10 }
    const second = { id: 2, amount: 20 }
    const result = optimisticUpdateRecord(
        { count: 2, rows: [first, second], results: [first, second], data: [first, second] },
        2,
        "amount",
        25,
    ) as Record<string, unknown>

    for (const key of ["rows", "results", "data"] as const) {
        assert.deepEqual(result[key], [first, { id: 2, amount: 25 }])
    }
    assert.equal(result.count, 2)
})

test("bulk cache removal preserves report envelopes", () => {
    const result = removeRecordsFromCache(
        { count: 3, results: [{ id: 1 }, { id: 2 }, { id: 3 }] },
        [1, 3],
    ) as { count: number; results: Array<{ id: number }> }

    assert.equal(result.count, 3)
    assert.deepEqual(result.results, [{ id: 2 }])
})
