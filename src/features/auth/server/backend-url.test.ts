import assert from "node:assert/strict"
import test from "node:test"
import { getBackendApiUrl, getBackendRequestPath } from "./backend-url"

const path = "api/v1/auth/users/me/"

test("Preview uses production-mode fallback, not the development backend", () => {
    assert.equal(getBackendApiUrl(path, {
        NODE_ENV: "production", VERCEL_ENV: "preview",
        NEXT_PUBLIC_SERVER_DEV_URL: "http://localhost:8000",
        NEXT_PUBLIC_SERVER_PROD_URL: "https://django.example.test",
    }), `https://django.example.test/${path}`)
})

test("server-only origin overrides a baked-in public URL", () => {
    assert.equal(getBackendApiUrl(path, {
        NODE_ENV: "production", VERCEL_ENV: "preview",
        DJANGO_API_URL: "https://preview-api.example.test/",
        NEXT_PUBLIC_API_URL: "http://localhost:8000",
    }), `https://preview-api.example.test/${path}`)
})

test("local direct backend remains supported; deployed loopback and malformed URLs fail early", () => {
    assert.equal(getBackendApiUrl(path, { NEXT_PUBLIC_API_URL: "http://localhost:8000" }), `http://localhost:8000/${path}`)
    for (const base of ["http://localhost:8000", "http://127.0.0.1", "http://[::1]", "/api/backend", "ftp://api.test", "https://secret:token@api.test", "https://api.test/?token=secret"]) {
        assert.throws(() => getBackendApiUrl(path, { DJANGO_API_URL: base, VERCEL_ENV: "preview" }))
    }
    assert.throws(() => getBackendApiUrl(path, {}))
})

test("gateway preserves Django's explicit PDF route and restores normal router slashes", () => {
    const pdf = "api/v1/reports/region/1/compliance/monthly-report.pdf"
    assert.equal(getBackendRequestPath(pdf), pdf)
    assert.equal(getBackendRequestPath(`${pdf}/`), pdf)
    assert.equal(getBackendRequestPath("api/v1/auth/users/me"), path)
    assert.equal(getBackendRequestPath(path), path)
})
