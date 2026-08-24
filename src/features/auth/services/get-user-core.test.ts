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
