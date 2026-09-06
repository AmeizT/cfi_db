import assert from "node:assert/strict"
import test from "node:test"

import {
    isJwtExpired,
    replaceAuthCookies,
} from "./auth-session"

function tokenExpiringAt(exp: number) {
    const encode = (value: object) => Buffer.from(JSON.stringify(value))
        .toString("base64url")
    return `${encode({ alg: "none" })}.${encode({ exp })}.signature`
}

test("JWT expiry checks honor the refresh clock-skew window", () => {
    const now = Math.floor(Date.now() / 1000)

    assert.equal(isJwtExpired(tokenExpiringAt(now - 1)), true)
    assert.equal(isJwtExpired(tokenExpiringAt(now + 120)), false)
    assert.equal(isJwtExpired(tokenExpiringAt(now + 20), 30), true)
    assert.equal(isJwtExpired("malformed"), true)
})

test("auth cookie replacement preserves non-auth cookies", () => {
    const cookies = replaceAuthCookies(
        "csrftoken=csrf; accessToken=old-access; theme=dark; refreshToken=old-refresh",
        { access: "new-access", refresh: "new-refresh" }
    )

    assert.equal(
        cookies,
        "csrftoken=csrf; theme=dark; accessToken=new-access; refreshToken=new-refresh"
    )
})
