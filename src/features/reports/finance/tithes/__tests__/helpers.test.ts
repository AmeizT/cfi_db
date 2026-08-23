import assert from "node:assert/strict"
import test from "node:test"
import { normalizeListResponse, unwrapDataEnvelope } from "../utils/helpers.ts"

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

test("production-shaped Tithe responses feed transactions, contributors, and cumulative totals", () => {
    const transactionsResponse = {
        data: {
            count: 2,
            next: null,
            previous: null,
            results: [
                {
                    id: 41,
                    amount: "125.00",
                    timestamp: "2026-01-14",
                    member_name: "A Person",
                    is_trash: false,
                },
                {
                    id: 42,
                    amount: "75.00",
                    timestamp: "2026-02-14",
                    member_name: "A Person",
                    is_trash: false,
                },
            ],
        },
    }
    const contributorsResponse = {
        data: {
            count: 1,
            results: [{
                member_id: 7,
                contributor: "A Person",
                cumulative: "200.00",
            }],
        },
    }
    const cumulativeResponse = {
        data: {
            data: {
                statements: [
                    { month: 1, total: "125.00" },
                    { month: 2, total: "75.00" },
                ],
            },
        },
    }

    const transactions = normalizeListResponse(transactionsResponse)
    const contributors = normalizeListResponse(contributorsResponse)
    const cumulativePayload = unwrapDataEnvelope(cumulativeResponse) as {
        statements: Array<{ total: string }>
    }
    const cumulative = cumulativePayload.statements.reduce(
        (total, row) => total + Number(row.total),
        0,
    )

    assert.deepEqual(transactions.rows.map((row) => row.id), [41, 42])
    assert.deepEqual(contributors.rows.map((row) => row.contributor), ["A Person"])
    assert.equal(cumulative, 200)
    assert.equal("status" in transactions.rows[0], false)
    assert.equal(transactions.rows.every((row) => row.is_trash === false), true)
})
