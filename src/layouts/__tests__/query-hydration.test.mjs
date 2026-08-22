import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import test from "node:test"

const authenticatedLayouts = [
    "src/layouts/AuthenticatedAppLayout.tsx",
    "src/layouts/HeadlessAppLayout.tsx",
    "app/(manage)/layout.tsx",
]

test("authenticated layouts seed the server user before dehydration", async () => {
    for (const path of authenticatedLayouts) {
        const source = await readFile(path, "utf8")
        assert.match(source, /const user = React\.use\(getUser\(\)\)/)
        assert.match(source, /const queryClient = makeQueryClient\(\)/)
        assert.match(source, /seedCurrentUser\(queryClient, user\)/)
        assert.ok(
            source.indexOf("seedCurrentUser(queryClient, user)") < source.indexOf("dehydrate(queryClient)"),
            `${path} must seed user before dehydration`,
        )
    }
})

test("browser QueryClient is stable and user query stays fresh through hydration", async () => {
    const [provider, userHook] = await Promise.all([
        readFile("src/layouts/providers/query.tsx", "utf8"),
        readFile("src/hooks/query/use-user.ts", "utf8"),
    ])
    assert.match(provider, /let browserQueryClient/)
    assert.match(provider, /if \(!browserQueryClient\) browserQueryClient = makeQueryClient\(\)/)
    assert.match(userHook, /staleTime: 60_000/)
})

test("browser-only responsive and session stores provide deterministic server snapshots", async () => {
    const [mobile, jethro] = await Promise.all([
        readFile("src/hooks/use-mobile.ts", "utf8"),
        readFile("src/features/jethro/JethroSessionProvider.tsx", "utf8"),
    ])
    assert.match(mobile, /useSyncExternalStore\(subscribe, getSnapshot, getServerSnapshot\)/)
    assert.match(mobile, /function getServerSnapshot\(\) \{\s*return false/)
    assert.match(jethro, /useSyncExternalStore/)
    assert.match(jethro, /\(\) => undefined/)
})

test("AssemblySwitcher keeps a stable Radix trigger element while loading", async () => {
    const source = await readFile("src/layouts/dashboard/AssemblySwitcher.tsx", "utf8")
    const triggerStart = source.indexOf("const trigger = (")
    const trigger = source.slice(triggerStart, source.indexOf("return (", triggerStart))
    const popoverTrigger = source.slice(source.indexOf("<PopoverTrigger asChild>"), source.indexOf("</PopoverTrigger>"))
    assert.match(trigger, /<Button/)
    assert.match(source, /const triggerContent = isLoading \? \(/)
    assert.doesNotMatch(trigger, /isLoading \? \(\s*<Skeleton/)
    assert.match(popoverTrigger, /\{trigger\}/)
})

test("Overview receives a server clock and uses an explicit formatting locale", async () => {
    const [page, view, metrics] = await Promise.all([
        readFile("app/(dashboard)/page.tsx", "utf8"),
        readFile("src/features/dashboard/views/OverviewView.tsx", "utf8"),
        readFile("src/features/dashboard/components/overview/OverviewMetrics.tsx", "utf8"),
    ])
    assert.match(page, /initialNow=\{new Date\(\)\.toISOString\(\)\}/)
    assert.match(view, /greetByTime\(referenceNow\)/)
    assert.match(view, /referenceDate=\{initialNow\}/)
    assert.match(metrics, /locale \|\| "en-BW"/)
    assert.doesNotMatch(metrics, /Intl\.NumberFormat\(undefined/)
})
