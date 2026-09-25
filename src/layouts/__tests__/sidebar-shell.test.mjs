import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import test from "node:test"

test("sidebar uses one New launcher implementation with topbar and sidebar triggers", async () => {
    const [sidebar, topbar, quickCreate] = await Promise.all([
        readFile("src/layouts/ContextSidebar.tsx", "utf8"),
        readFile("src/layouts/topbar.tsx", "utf8"),
        readFile("src/layouts/quick-create.tsx", "utf8"),
    ])
    assert.match(sidebar, /<QuickCreate\s+onAction=\{closeMobile\}\s+trigger=/)
    assert.match(topbar, /<QuickCreate \/>/)
    assert.match(quickCreate, /NewLauncherMenu/)
    assert.doesNotMatch(quickCreate, /router\.push/)
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

test("desktop shell is assembly tinted and the content inset stays neutral", async () => {
    const [shell, sidebar, primitive] = await Promise.all([
        readFile("src/layouts/app-shell.tsx", "utf8"),
        readFile("src/layouts/ContextSidebar.tsx", "utf8"),
        readFile("src/components/ui/sidebar.tsx", "utf8"),
    ])
    assert.match(shell, /bg-sidebar/)
    assert.match(shell, /bg-white dark:bg-neutral-900/)
    assert.match(sidebar, /variant = "floating"/)
    assert.match(primitive, /bg-sidebar[^"\n]*flex h-full/)
    assert.match(primitive, /group-data-\[variant=floating\]:rounded-3xl/)
})

test("application sidebar avoids a shared-edge border and the inset has no shadow", async () => {
    const [shell, sidebar] = await Promise.all([
        readFile("src/layouts/app-shell.tsx", "utf8"),
        readFile("src/layouts/ContextSidebar.tsx", "utf8"),
    ])

    assert.match(shell, /md:rounded-\[20px\] md:ring-1 md:ring-sidebar-border md:shadow-none/)
    assert.match(sidebar, /\*:data-\[slot=sidebar-inner\]:border-0/)
})
