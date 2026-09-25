import assert from "node:assert/strict"
import test from "node:test"
import type { User } from "../auth/schemas/user"
import { usesRegionalShell, workspaceThemeColor, zoneSwitchHref } from "./scope"
import { getWorkspaceNavigationSections } from "../../config/workspace-navigation"
import { filterNavigationSections } from "../../layouts/sidebar/navigation-utils"

const regional = { uses_regional_shell: true, is_region_staff: true, can_view_executive_summary: true, can_view_assembly_summary: true,
    active_regional_zone: { id: 2, name: "Zone two", region: 7, zone_avatar_fallback: "oklch(0.65 0.2 120)" },
    assembly: { avatar_fallback: "oklch(0.65 0.2 20)" }, assigned_regions: [{ id: 7 }],
} as User

test("regional shell has one Summary, scoped groups and no assembly/global creation navigation", () => {
    const groups = getWorkspaceNavigationSections(regional)
    assert.deepEqual(groups.map(g => g.title), [undefined, "Oversight", "Performance", "Administration"])
    assert.deepEqual(groups.flatMap(g => g.items).map(i => i.label), ["Summary", "Compliance", "Risk", "Finance", "Growth", "Ministry", "Leadership", "Assemblies", "Users"])
    assert.ok(groups[2].items.every(i => i.href.includes("/region/7/")))
    const changed = getWorkspaceNavigationSections({ ...regional, active_regional_zone: { ...regional.active_regional_zone!, region: 9 } })
    assert.ok(changed[2].items.every(i => i.href.includes("/region/9/")))
})
test("both executive role fixtures retain every regional item after permission filtering", () => {
    for (const role of ["regional_admin", "overseer"]) {
        const user = { ...regional, is_superuser: false,
            region_roles: [{ id: 1, user: 1, region: 7, role, is_active: true }] }
        const sections = filterNavigationSections(getWorkspaceNavigationSections(user), user)
        assert.equal(usesRegionalShell(user), true, role)
        assert.deepEqual(sections.flatMap(section => section.items).map(item => item.label),
            ["Summary", "Compliance", "Risk", "Finance", "Growth", "Ministry", "Leadership", "Assemblies", "Users"], role)
    }
})
test("a superuser with a Regional Admin assignment intentionally keeps the full shell", () => {
    const user = { ...regional, uses_regional_shell: false, is_superuser: true,
        region_roles: [{ id: 1, user: 1, region: 7, role: "regional_admin", is_active: true }] }
    const sections = filterNavigationSections(getWorkspaceNavigationSections(user), user)
    assert.equal(usesRegionalShell(user), false)
    assert.ok(sections.some(section => section.title === "Reporting"))
    assert.ok(sections.flatMap(section => section.items).some(item => item.key === "assembly-summary"))
})
test("assembly Pastor fixture retains assembly navigation and assembly theme", () => {
    const user = { ...regional, uses_regional_shell: false, is_region_staff: false,
        is_superuser: false, can_view_executive_summary: false, active_regional_zone: null,
        region_roles: [], roles: [{ id: 1, name: "Pastor" }] }
    const sections = filterNavigationSections(getWorkspaceNavigationSections(user), user)
    assert.equal(usesRegionalShell(user), false)
    assert.equal(workspaceThemeColor(user), user.assembly?.avatar_fallback)
    assert.ok(sections.some(section => section.title === "Reporting"))
    assert.ok(sections.flatMap(section => section.items).some(item => item.key === "home"))
    assert.ok(!sections.flatMap(section => section.items).some(item => item.key === "executive-summary"))
})
test("superusers and assembly users keep their shell and theme", () => {
    const superuser = { ...regional, is_superuser: true }
    assert.equal(usesRegionalShell(superuser), false)
    assert.ok(getWorkspaceNavigationSections(superuser).some(g => g.items.some(i => i.key === "home")))
    assert.equal(workspaceThemeColor(superuser), regional.assembly?.avatar_fallback)
    assert.equal(workspaceThemeColor(regional), regional.active_regional_zone?.zone_avatar_fallback)
    assert.equal(usesRegionalShell({ ...regional, uses_regional_shell: false }), false)
})
test("switching zones clears stale country and zone URLs while retaining reporting period", () => {
    assert.equal(zoneSwitchHref("/regional-staff/region/7/finance", "?zone=2&country=BW&period=2026-09", 9), "/regional-staff/region/9/finance?period=2026-09")
    assert.equal(zoneSwitchHref("/summary/regional", "?zone=2&country=BW", 9), "/summary/regional")
})
