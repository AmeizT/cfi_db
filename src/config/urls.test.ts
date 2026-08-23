import assert from "node:assert/strict"
import test from "node:test"

import { buildApiRequestUrl } from "./urls"

test("direct API URLs contain one Django API prefix", () => {
    assert.equal(
        buildApiRequestUrl({
            backendUrl: "http://local-django.test:8000/",
            path: "api/v1/auth/csrf/",
            proxyEnabled: false,
        }),
        "http://local-django.test:8000/api/v1/auth/csrf/"
    )
})

test("gateway API URLs contain one gateway and one Django API prefix", () => {
    assert.equal(
        buildApiRequestUrl({
            backendUrl: "https://backend.example.test",
            path: "api/v1/auth/csrf/",
            proxyEnabled: true,
            proxyPath: "/api/backend/",
        }),
        "/api/backend/api/v1/auth/csrf/"
    )
})
