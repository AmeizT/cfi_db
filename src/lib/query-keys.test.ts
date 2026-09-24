import assert from "node:assert/strict"
import test from "node:test"
import { QueryClient, QueryObserver } from "@tanstack/react-query"
import { getUserClient } from "../features/auth/services/get-user-client"
import { refreshAfterAssemblySwitch, userQueryKeys } from "./query-keys"

test("assembly switching fetches current user once with an active observer", async (t) => {
    const client = new QueryClient({ defaultOptions: { queries: { retry: false, staleTime: Infinity } } })
    client.setQueryData(userQueryKeys.current, { church: 1, assemblies: [] })
    const observer = new QueryObserver(client, { queryKey: userQueryKeys.current, queryFn: getUserClient })
    const unsubscribe = observer.subscribe(() => {})
    t.after(() => { unsubscribe(); client.clear() })
    let calls = 0
    t.mock.method(globalThis, "fetch", async () => {
        calls++
        return new Response(null, { status: 401 })
    })
    await refreshAfterAssemblySwitch(client, 2)
    assert.equal(calls, 1)
    assert.equal(client.getQueryData(userQueryKeys.current), null)
})
