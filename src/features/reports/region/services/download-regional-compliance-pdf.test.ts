import assert from "node:assert/strict"
import test from "node:test"

test("PDF download uses the authenticated gateway with scope filters and no current-user action", async (t) => {
    const previous = process.env.NEXT_PUBLIC_API_PROXY_ENABLED
    process.env.NEXT_PUBLIC_API_PROXY_ENABLED = "true"
    Object.defineProperty(globalThis, "window", { value: {}, configurable: true })
    t.after(() => {
        Reflect.deleteProperty(globalThis, "window")
        if (previous === undefined) delete process.env.NEXT_PUBLIC_API_PROXY_ENABLED
        else process.env.NEXT_PUBLIC_API_PROXY_ENABLED = previous
    })
    const { downloadRegionalCompliancePdf } = await import("./download-regional-compliance-pdf")
    let calls = 0
    t.mock.method(globalThis, "fetch", async (input: string, init: RequestInit) => {
        calls++
        const target = new URL(input, "https://preview.example.test")
        assert.equal(target.pathname, "/api/backend/api/v1/reports/region/1/compliance/monthly-report.pdf")
        assert.equal(target.searchParams.get("zone_id"), "2")
        assert.equal(target.searchParams.get("country"), "Botswana")
        assert.equal(target.searchParams.get("from_month"), "1")
        assert.equal(init.method, "GET")
        assert.equal(init.credentials, "include")
        return Response.json({ detail: "You do not have access to this region." }, { status: 403 })
    })
    await assert.rejects(downloadRegionalCompliancePdf({
        regionId: 1, year: 2026, fromMonth: 1, toMonth: 3, zoneId: 2, country: "Botswana",
    }), /You do not have access to this region/)
    assert.equal(calls, 1)
})
