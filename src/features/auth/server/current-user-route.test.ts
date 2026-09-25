import assert from "node:assert/strict"
import test from "node:test"
import { NextRequest } from "next/server"
import { GET } from "../../../../app/api/auth/current-user/route"

test("current-user GET preserves auth failures and never retries forbidden or timeout responses", async (t) => {
    const previous = process.env.DJANGO_API_URL
    process.env.DJANGO_API_URL = "https://django.example.test"
    t.after(() => {
        if (previous === undefined) delete process.env.DJANGO_API_URL
        else process.env.DJANGO_API_URL = previous
    })
    t.mock.method(console, "info", () => {})
    let status = 401
    let calls = 0
    t.mock.method(globalThis, "fetch", async (_url: string, init: RequestInit) => {
        calls++
        assert.equal((init.headers as { Cookie: string }).Cookie.includes("accessToken=private"), true)
        if (status === 504) throw new DOMException("aborted", "AbortError")
        return new Response(null, { status })
    })
    for (status of [401, 403, 504]) {
        calls = 0
        const response = await GET(new NextRequest("https://preview.example.test/api/auth/current-user", {
            headers: { cookie: "accessToken=private" },
        }))
        assert.equal(response.status, status)
        assert.equal(response.headers.get("Cache-Control"), "private, no-store")
        assert.doesNotMatch(await response.text(), /private|accessToken/)
        assert.equal(calls, 1)
    }
})
