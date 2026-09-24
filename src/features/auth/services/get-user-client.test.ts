import assert from "node:assert/strict"
import test from "node:test"
import { getUserClient } from "./get-user-client"
import { CurrentUserError } from "./get-user-core"

test("browser current-user reads use a same-origin GET and only 401 means no user", async (t) => {
    let status = 401
    t.mock.method(globalThis, "fetch", async (url: string, options: RequestInit) => {
        assert.equal(url, "/api/auth/current-user")
        assert.equal(options.method ?? "GET", "GET")
        assert.equal(options.credentials, "same-origin")
        assert.equal(options.cache, "no-store")
        return new Response(null, { status })
    })
    assert.equal(await getUserClient(), null)
    for (status of [403, 502, 504]) {
        await assert.rejects(getUserClient(), error => {
            assert.ok(error instanceof CurrentUserError)
            assert.equal(error.status, status)
            assert.equal(error.code, status === 504 ? "timeout" : "http")
            return true
        })
    }
})
