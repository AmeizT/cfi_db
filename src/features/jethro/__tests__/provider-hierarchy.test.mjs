import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import test from "node:test"

test("all authenticated shells inherit one Jethro provider boundary", async () => {
    const [authenticatedRoot, headless, providers, shell, headlessShell] = await Promise.all([
        readFile("src/layouts/AuthenticatedAppLayout.tsx", "utf8"),
        readFile("src/layouts/HeadlessAppLayout.tsx", "utf8"),
        readFile("src/layouts/providers/authenticated-workspace.tsx", "utf8"),
        readFile("src/layouts/app-shell.tsx", "utf8"),
        readFile("src/layouts/headless/HeadlessLayout.tsx", "utf8"),
    ])

    assert.match(authenticatedRoot, /<AuthenticatedWorkspaceProviders>/)
    assert.doesNotMatch(headless, /AuthenticatedWorkspaceProviders/)
    assert.match(providers, /<JethroSessionProvider>\{children\}<\/JethroSessionProvider>/)
    assert.doesNotMatch(shell, /JethroSessionProvider/)
    assert.equal((shell.match(/<JethroLauncher/g) ?? []).length, 1)
    assert.equal((headlessShell.match(/<JethroLauncher/g) ?? []).length, 1)
})

test("the Jethro hook keeps its invalid-provider guard", async () => {
    const session = await readFile("src/features/jethro/JethroSessionProvider.tsx", "utf8")
    assert.match(session, /throw new Error\("useJethroSession must be used inside JethroSessionProvider"\)/)
})

test("background conversation fetching does not drive the composer sending state", async () => {
    const [session, launcher, composer] = await Promise.all([
        readFile("src/features/jethro/JethroSessionProvider.tsx", "utf8"),
        readFile("src/features/jethro/components/JethroLauncher.tsx", "utf8"),
        readFile("src/features/jethro/components/JethroComposer.tsx", "utf8"),
    ])

    assert.match(session, /isSending: send\.isPending/)
    assert.match(session, /isConversationLoading: conversation\.isFetching/)
    assert.doesNotMatch(session, /send\.isPending \|\| conversation\.isFetching/)
    assert.match(launcher, /loading=\{isSending\}/)
    assert.match(composer, /const showLoading = loading && Boolean\(value\.trim\(\)\)/)
    assert.match(composer, /\{showLoading \? \(/)
})
