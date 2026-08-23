import assert from "node:assert/strict"
import test from "node:test"

import { authenticatedFetch } from "./csrf"

test("a backend without a CSRF bootstrap route does not block login", async () => {
    const originalFetch = globalThis.fetch
    const originalDocument = Object.getOwnPropertyDescriptor(globalThis, "document")
    const requests: Array<{ input: string; headers: Headers }> = []

    Object.defineProperty(globalThis, "document", {
        configurable: true,
        value: { cookie: "" },
    })

    globalThis.fetch = async (input, init) => {
        const url = String(input)
        requests.push({ input: url, headers: new Headers(init?.headers) })

        if (url.includes("/auth/csrf/")) {
            return new Response(null, { status: 404 })
        }

        return Response.json({ success: true })
    }

    try {
        const response = await authenticatedFetch("http://local-django.test/api/v1/auth/login/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: "test@example.test", password: "password" }),
        })

        assert.equal(response.status, 200)
        assert.equal(requests.length, 2)
        assert.match(requests[0].input, /\/api\/v1\/auth\/csrf\/$/)
        assert.equal(requests[1].headers.has("X-CSRFToken"), false)
    } finally {
        globalThis.fetch = originalFetch
        if (originalDocument) {
            Object.defineProperty(globalThis, "document", originalDocument)
        } else {
            delete (globalThis as { document?: unknown }).document
        }
    }
})
