import assert from "node:assert/strict"
import test from "node:test"
import { QueryClient } from "@tanstack/react-query"

import type { User } from "../schemas/user"
import { CurrentUserError, fetchCurrentUser } from "./get-user-core"

const endpoint = "https://api.example.test/api/v1/auth/users/me/"

function validUser(): User {
    return {
        id: 1,
        user_id: "AbCdEf123456",
        full_name: "Test User",
        first_name: "Test",
        last_name: "User",
        username: "test.user",
        email: "test@example.test",
        recovery_email: null,
        church: 10,
        assembly: {
            id: 10,
            public_id: "assembly-public-id",
            name: "Test Assembly",
        },
        assemblies: [{
            id: 10,
            public_id: "assembly-public-id",
            name: "Test Assembly",
        }],
        roles: [{ id: 1, name: "Member" }],
        is_region_staff: false,
        active_region: null,
        region_roles: [],
        assigned_regions: [],
        assigned_zones: [],
        avatar: null,
        avatar_fallback: null,
        is_active: true,
        is_admin: false,
        is_onboarded: true,
        is_student: false,
        is_db_staff: false,
        is_db_zone_staff: false,
        is_academy_staff: false,
        is_staff: false,
        created_at: "2026-01-01T00:00:00Z",
        updated_at: "2026-01-01T00:00:00Z",
    }
}

function request(fetchImpl: typeof fetch, timeoutMs = 100) {
    return fetchCurrentUser({
        endpoint,
        cookieHeader: "session=redacted",
        fetchImpl,
        timeoutMs,
    })
}

function assertCurrentUserError(error: unknown, code: CurrentUserError["code"], status?: number) {
    assert.ok(error instanceof CurrentUserError)
    assert.equal(error.code, code)
    assert.equal(error.status, status)
    return true
}

test("valid current-user response returns the parsed user", async () => {
    const user = validUser()
    const result = await request(async () => Response.json(user))
    assert.deepEqual(result, user)
})

test("401 is the only response treated as authenticated absence", async () => {
    const result = await request(async () => new Response(null, { status: 401 }))
    assert.equal(result, null)

    await assert.rejects(
        request(async () => new Response(null, { status: 403 })),
        (error) => assertCurrentUserError(error, "http", 403),
    )
})

test("server and unexpected non-OK responses throw", async () => {
    await assert.rejects(
        request(async () => new Response(null, { status: 500 })),
        (error) => assertCurrentUserError(error, "http", 500),
    )
    await assert.rejects(
        request(async () => new Response(null, { status: 429 })),
        (error) => assertCurrentUserError(error, "http", 429),
    )
})

test("network and timeout failures throw", async () => {
    await assert.rejects(
        request(async () => { throw new TypeError("offline") }),
        (error) => assertCurrentUserError(error, "network"),
    )

    const pendingFetch = ((_input: URL | RequestInfo, init?: RequestInit) =>
        new Promise<Response>((_resolve, reject) => {
            init?.signal?.addEventListener("abort", () => {
                reject(new DOMException("aborted", "AbortError"))
            })
        })) as typeof fetch

    await assert.rejects(
        request(pendingFetch, 1),
        (error) => assertCurrentUserError(error, "timeout"),
    )
})

test("invalid JSON and schema mismatches throw", async () => {
    await assert.rejects(
        request(async () => new Response("not-json", { status: 200 })),
        (error) => assertCurrentUserError(error, "invalid-json", 200),
    )
    await assert.rejects(
        request(async () => Response.json({ id: "wrong" })),
        (error) => assertCurrentUserError(error, "invalid-user", 200),
    )
})

test("a refetch error retains an already cached user", async () => {
    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
    const queryKey = ["user"] as const
    const user = validUser()
    queryClient.setQueryData(queryKey, user)

    await assert.rejects(queryClient.fetchQuery({
        queryKey,
        queryFn: async () => { throw new CurrentUserError("network", "offline") },
        staleTime: 0,
    }))

    assert.deepEqual(queryClient.getQueryData(queryKey), user)
    assert.equal(queryClient.getQueryState(queryKey)?.status, "error")
})

test("diagnostics contain host, deadline, status, elapsed time and category without credentials", async () => {
    const events: unknown[] = []
    await fetchCurrentUser({
        endpoint: "https://name:secret@api.example.test/me/?token=secret",
        cookieHeader: "accessToken=secret",
        fetchImpl: async (_url, init) => {
            assert.equal((init?.headers as { Cookie: string }).Cookie, "accessToken=secret")
            assert.equal(init?.cache, "no-store")
            return new Response(null, { status: 401 })
        },
        log: event => events.push(event),
    })
    assert.equal(events.length, 1)
    const event = events[0] as import("./get-user-core").CurrentUserRequestLog
    assert.equal(event.apiHost, "api.example.test")
    assert.equal(event.timeoutMs, 5000)
    assert.equal(event.status, 401)
    assert.equal(event.failureCategory, "unauthenticated")
    assert.ok(event.durationMs >= 0)
    assert.doesNotMatch(JSON.stringify(events), /secret|accessToken|token=|name:/)
})

test("body-read timeout is classified as timeout, with the received response status", async () => {
    const events: import("./get-user-core").CurrentUserRequestLog[] = []
    await assert.rejects(fetchCurrentUser({
        endpoint,
        cookieHeader: "session=redacted",
        timeoutMs: 2,
        fetchImpl: async (_url, init) => new Response(new ReadableStream({
            start(controller) {
                init?.signal?.addEventListener("abort", () => {
                    controller.error(new DOMException("aborted", "AbortError"))
                })
            },
        })),
        log: event => events.push(event),
    }), error => assertCurrentUserError(error, "timeout"))
    assert.equal(events[0].failureCategory, "timeout")
    assert.equal(events[0].status, 200)
})
