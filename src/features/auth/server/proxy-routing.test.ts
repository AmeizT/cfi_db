import assert from "node:assert/strict"
import test from "node:test"

import { isAuthRoute, shouldBypassProxy } from "./proxy-routing"

test("only auth routes are passed to localization", () => {
    assert.equal(isAuthRoute("/en/auth/login"), true)
    assert.equal(isAuthRoute("/fr/auth/login"), true)
    assert.equal(isAuthRoute("/auth/login"), true)

    for (const pathname of [
        "/",
        "/app/dashboard",
        "/reports",
        "/finance/tithes",
        "/workspace/finance",
    ]) {
        assert.equal(isAuthRoute(pathname), false, pathname)
    }
})

test("Next internals, API routes, and static files bypass auth routing", () => {
    for (const pathname of [
        "/_next/static/chunks/app.js",
        "/_next/image",
        "/api/backend/api/v1/auth/login/",
        "/favicon.ico",
        "/robots.txt",
        "/sitemap.xml",
        "/reports/chart.js",
        "/fonts/app.woff2",
        "/images/logo.png",
    ]) {
        assert.equal(shouldBypassProxy(pathname), true, pathname)
    }

    assert.equal(shouldBypassProxy("/reports"), false)
    assert.equal(shouldBypassProxy("/app/dashboard"), false)
})
