import assert from "node:assert/strict"
import test from "node:test"
import { readFile } from "node:fs/promises"
import { workspaceNavigation, getWorkspaceNavigationSections } from "../../config/workspace-navigation"
import { filterNavigationSections, getPrimaryNavigationSections, getMobileNavigationGroups, getActiveNavigationKey } from "../sidebar/navigation-utils"
import type { User } from "../../features/auth/schemas/user"

const assemblyUser = { is_admin: false, is_region_staff: false, can_view_assembly_summary: true } as User

test("dock groups exactly reuse sidebar groups including report Summary", () => {
    const sections = filterNavigationSections(getWorkspaceNavigationSections(assemblyUser), assemblyUser)
    const groups = getMobileNavigationGroups(sections)
    const sidebarReports = getPrimaryNavigationSections(sections).find(section => section.title === "Reporting")!
    assert.deepEqual(groups.reports, sidebarReports.items)
    assert.equal(groups.reports[0].label, "Summary")
    for (const key of ["finance", "engagement"] as const) {
        const parent = sections.flatMap(section => section.items).find(item => item.key === key)!
        assert.equal(groups[key], parent.children)
        for (const item of groups[key]) assert.equal(getActiveNavigationKey(item.href.split("?")[0], sections), item.key)
    }
})

test("permission filtering removes restricted destinations before mobile grouping", () => {
    const sections = filterNavigationSections(workspaceNavigation, assemblyUser)
    assert.ok(!sections.flatMap(section => section.items).some(item => item.key === "assemblies" || item.key === "zone"))
    const restricted = [{ title: "Reporting", items: [{ ...workspaceNavigation[0].items[0], permission: "manageAssemblies" as const }] }]
    assert.deepEqual(getMobileNavigationGroups(filterNavigationSections(restricted, assemblyUser)).reports, [])
})

test("missing regional groups do not expose assembly-only menus", () => {
    const sections = [{ items: [{ ...workspaceNavigation[0].items[0], key: "executive-summary", href: "/summary/regional" }] }]
    assert.deepEqual(getMobileNavigationGroups(sections), { reports: [], finance: [], engagement: [] })
})

test("five-item mobile dock uses drawers for groups and includes no AI or immediate logout action", async () => {
    const dock = await readFile("src/layouts/BottomMenu.tsx", "utf8")
    assert.equal((dock.match(/label: "/g) ?? []).length, 5)
    assert.match(dock, /if \(key === "home"\)\s*\{?\s*return\s*\(?\s*<Link/)
    assert.match(dock, /<Drawer\s+key=\{key\}/)
    assert.match(dock, /getMobileNavigationGroups\(sections\)/)
    assert.match(dock, /h-16/)
    assert.match(dock, /md:hidden/)
    assert.doesNotMatch(dock, /logout\(|router.push|Jethro|MAIN_NAV/)
    const profile = await readFile("src/layouts/dashboard/ProfileDropdown.tsx", "utf8")
    assert.match(profile, /<SignoutButton standalone/)
    assert.match(profile, /<ThemeMenuItem standalone/)
})

test("mobile drawer variants preserve desktop presentations and reserve dock clearance", async () => {
    const [search, create, assembly, shell, jethro] = await Promise.all([
        readFile("src/layouts/AppSearch.tsx", "utf8"),
        readFile("src/features/create/launcher/NewLauncher.tsx", "utf8"),
        readFile("src/layouts/dashboard/AssemblyCardDeck.tsx", "utf8"),
        readFile("src/layouts/app-shell.tsx", "utf8"),
        readFile("src/features/jethro/components/JethroLauncher.tsx", "utf8"),
    ])
    assert.match(search, /mobile \? Drawer : Popover/)
    assert.match(search, /90dvh/)
    assert.match(search, /getSearchGroups\(user, pathname, variant === "mobile"\)/)
    assert.match(create, /mobile \? Drawer : DropdownMenu/)
    assert.match(create, /if \(mobile\) setOpen\(false\)/)
    assert.match(create, /openQuickAdd\(action.entity, triggerRef.current\)/)
    assert.match(assembly, /isMobile \? Drawer : Dialog/)
    assert.match(shell, /pb-\[calc\(6rem\+env\(safe-area-inset-bottom\)\)\]/)
    assert.match(jethro, /bottom-\[calc\(5.75rem\+env\(safe-area-inset-bottom\)\)\]/)
    assert.match(jethro, /md:bottom-\[calc\(1.5rem/)
})
