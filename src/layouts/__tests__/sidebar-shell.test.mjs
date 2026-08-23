import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import test from "node:test"

test("sidebar uses one Quick Create implementation with topbar and sidebar triggers", async () => {
    const [sidebar, topbar, quickCreate] = await Promise.all([
        readFile("src/layouts/ContextSidebar.tsx", "utf8"),
        readFile("src/layouts/topbar.tsx", "utf8"),
        readFile("src/layouts/quick-create.tsx", "utf8"),
    ])
    assert.match(sidebar, /<QuickCreate\s+onAction=\{closeMobile\}\s+trigger=/)
    assert.match(topbar, /<QuickCreate \/>/)
    assert.equal((quickCreate.match(/<DialogContent/g) ?? []).length, 1)
})

test("shortcut and primary navigation groups share an expanded collapsible treatment", async () => {
    const [sidebar, navigation, shortcuts, group] = await Promise.all([
        readFile("src/layouts/ContextSidebar.tsx", "utf8"),
        readFile("src/layouts/sidebar/UnifiedSidebarNavigation.tsx", "utf8"),
        readFile("src/features/workspace/sidebar/SidebarShortcuts.tsx", "utf8"),
        readFile("src/layouts/sidebar/SidebarNavigationGroup.tsx", "utf8"),
    ])
    assert.ok(sidebar.indexOf("<SidebarShortcuts") < sidebar.indexOf("sections={groupedSections}"))
    assert.match(navigation, /<SidebarNavigationGroup key=\{key\} title=\{section\.title\}>/)
    assert.match(shortcuts, /<SidebarNavigationGroup title="Shortcuts">/)
    assert.match(group, /defaultOpen = true/)
})

test("desktop shell is neutral and the themed sidebar uses the floating primitive", async () => {
    const [shell, sidebar, primitive] = await Promise.all([
        readFile("src/layouts/app-shell.tsx", "utf8"),
        readFile("src/layouts/ContextSidebar.tsx", "utf8"),
        readFile("src/components/ui/sidebar.tsx", "utf8"),
    ])
    assert.match(shell, /bg-zinc-50/)
    assert.match(shell, /dark:bg-zinc-950/)
    assert.match(sidebar, /variant = "floating"/)
    assert.match(primitive, /bg-sidebar flex h-full/)
    assert.match(primitive, /group-data-\[variant=floating\]:rounded-2xl/)
})

test("application sidebar and inset do not draw a shared-edge border or shadow", async () => {
    const [shell, sidebar] = await Promise.all([
        readFile("src/layouts/app-shell.tsx", "utf8"),
        readFile("src/layouts/ContextSidebar.tsx", "utf8"),
    ])

    assert.match(shell, /md:border-0 md:shadow-none/)
    assert.match(sidebar, /\[&>\[data-slot=sidebar-inner\]\]:border-0/)
    assert.match(sidebar, /\[&>\[data-slot=sidebar-inner\]\]:shadow-none/)
})
