import assert from "node:assert/strict"
import test from "node:test"

import { buildTransferQueryKey } from "../utils/transfer-query-key.ts"

test("transfer query keys include assembly, view, status, pagination, search, and filters", () => {
    const key = buildTransferQueryKey(42, "incoming", {
        status: "pending_acceptance,accepted",
        page: 3,
        page_size: 25,
        search: "  member name  ",
        filters: {
            zone: "north",
            effective_year: 2026,
        },
    })

    assert.deepEqual(key, [
        "assembly", "42",
        "people", "member-transfers",
        "view", "incoming",
        "status", "pending_acceptance,accepted",
        "page", 3,
        "page-size", 25,
        "search", "member name",
        "filters", [["effective_year", 2026], ["zone", "north"]],
    ])
})

test("changing the active assembly creates a separate transfer cache key", () => {
    const params = { page: 1, page_size: 10, search: "member" }

    assert.notDeepEqual(
        buildTransferQueryKey("assembly-a", "history", params),
        buildTransferQueryKey("assembly-b", "history", params),
    )
})
