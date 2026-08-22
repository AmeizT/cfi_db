import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import test from "node:test"

import {
    EMPTY_SHORTCUT_PREFERENCES,
    MAX_PINNED_PAGES,
    MAX_RECENT_PAGES,
    buildWorkspaceShortcutRegistry,
    parseShortcutPreferences,
    pinShortcut,
    recordShortcutVisit,
    resolveShortcutLists,
    sanitizeShortcutPreferences,
    unpinShortcut,
} from "../sidebar/shortcuts.ts"

const icon = () => null
const sections = [{
    title: "Operations",
    items: [{
        key: "finance",
        label: "Finance",
        href: "/finance/tithes",
        icon,
        activeIcon: icon,
        children: [
            { key: "tithes", label: "Tithes", href: "/finance/tithes", icon, activeIcon: icon },
            { key: "expenses", label: "Expenses", href: "/finance/expenses", icon, activeIcon: icon },
        ],
    }],
}]

test("the recovered shortcut registry contains leaves and excludes collapsible parents", () => {
    const registry = buildWorkspaceShortcutRegistry(sections)
    assert.deepEqual(registry.map((item) => item.key), ["tithes", "expenses"])
    assert.equal(registry[0].accessibleLabel, "Finance / Tithes")
})

test("pinning preserves the previous five-page limit", () => {
    let preferences = EMPTY_SHORTCUT_PREFERENCES
    for (let index = 0; index < MAX_PINNED_PAGES; index += 1) {
        preferences = pinShortcut(preferences, `page-${index}`).preferences
    }
    const result = pinShortcut(preferences, "page-six")
    assert.equal(result.limitReached, true)
    assert.deepEqual(result.preferences.pinnedKeys, preferences.pinnedKeys)
})

test("recent shortcuts remain ordered, deduplicated, limited, and separate from pins", () => {
    let preferences = EMPTY_SHORTCUT_PREFERENCES
    for (let index = 0; index < 7; index += 1) {
        preferences = recordShortcutVisit(preferences, `page-${index}`, index)
    }
    assert.equal(preferences.recent.length, MAX_RECENT_PAGES)
    preferences = recordShortcutVisit(preferences, "page-4", 99)
    assert.equal(preferences.recent[0].key, "page-4")

    const registry = buildWorkspaceShortcutRegistry(sections)
    preferences = recordShortcutVisit(EMPTY_SHORTCUT_PREFERENCES, "tithes", 1)
    preferences = recordShortcutVisit(preferences, "expenses", 2)
    preferences = pinShortcut(preferences, "tithes").preferences
    const lists = resolveShortcutLists(preferences, registry)
    assert.deepEqual(lists.pinned.map((item) => item.key), ["tithes"])
    assert.deepEqual(lists.recent.map((item) => item.key), ["expenses"])
    assert.deepEqual(unpinShortcut(preferences, "tithes").pinnedKeys, [])
})

test("removed and unauthorized shortcut keys are sanitized", () => {
    assert.deepEqual(parseShortcutPreferences("not-json"), EMPTY_SHORTCUT_PREFERENCES)
    const parsed = parseShortcutPreferences(JSON.stringify({
        version: 1,
        pinnedKeys: ["allowed", "removed"],
        recent: [{ key: "removed", visitedAt: 3 }, { key: "allowed", visitedAt: 2 }],
    }))
    const sanitized = sanitizeShortcutPreferences(parsed, new Set(["allowed"]))
    assert.deepEqual(sanitized.pinnedKeys, ["allowed"])
    assert.deepEqual(sanitized.recent.map((item) => item.key), ["allowed"])
})

test("shortcut persistence remains versioned and scoped to user and assembly", async () => {
    const hook = await readFile("src/features/workspace/sidebar/useSidebarShortcuts.ts", "utf8")
    assert.match(hook, /cfi:workspace-sidebar-shortcuts:v1/)
    assert.match(hook, /user\.user_id/)
    assert.match(hook, /user\.church/)
    assert.match(hook, /useSyncExternalStore/)
})
