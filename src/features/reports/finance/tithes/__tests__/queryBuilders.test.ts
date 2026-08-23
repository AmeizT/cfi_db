import assert from "node:assert/strict"
import test from "node:test"
import {
    buildReportTithesQuery,
    buildTithesActionQuery,
} from "../utils/queryBuilders.ts"

test("Tithes action queries preserve production proxy paths", () => {
    const result = buildTithesActionQuery(
        new URLSearchParams("page=2&page_size=25&status=active"),
        "/api/backend/api/v1/reports/69/tithes/contributors/",
    )

    assert.equal(
        result,
        "/api/backend/api/v1/reports/69/tithes/contributors/?page=2&page_size=25",
    )
})

test("Tithes action queries preserve absolute development endpoints", () => {
    const result = buildTithesActionQuery(
        new URLSearchParams("period=year%3A2026&search=person"),
        "http://127.0.0.1:8000/api/v1/reports/69/tithes/contributors/",
    )

    assert.equal(
        result,
        "http://127.0.0.1:8000/api/v1/reports/69/tithes/contributors/?period=year%3A2026&search=person",
    )
})

test("report Tithe queries retain server-side status filtering", () => {
    const result = buildReportTithesQuery(
        "69",
        new URLSearchParams("page=1&page_size=10"),
        "active",
    )
    const parsed = new URL(result, "https://workspace.example.test")

    assert.equal(parsed.pathname, "/api/v1/reports/69/tithes/")
    assert.equal(parsed.searchParams.get("page"), "1")
    assert.equal(parsed.searchParams.get("page_size"), "10")
    assert.equal(parsed.searchParams.get("status"), "active")
})

test("malformed Tithes endpoints fail with a configuration error", () => {
    assert.throws(
        () => buildTithesActionQuery(
            new URLSearchParams(),
            "backend.example.test/api/v1/reports/69/tithes/",
        ),
        /absolute HTTP\(S\) URL or a root-relative path/,
    )
})
