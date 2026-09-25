import assert from 'node:assert/strict'
import test from 'node:test'
import { existsSync } from 'node:fs'
import { getWorkspaceNavigationSections, workspaceNavigation } from '../../config/workspace-navigation'
import { getActiveNavigationKey, filterNavigationSections } from '../sidebar/navigation-utils'
import type { User } from '../../features/auth/schemas/user'

const user = (extra = {}) => ({
    is_region_staff: false, is_admin: false, church: 1,
    assigned_regions: [], active_region: null, ...extra,
} as unknown as User)
const regional = user({ is_region_staff: true, active_region: { id: 7 }, assigned_regions: [{ id: 7 }, { id: 9 }] })

test('assembly and administrators retain the assembly navigation regardless of URL', () => {
    for (const account of [user(), user({ is_admin: true }), user({ is_db_staff: true })]) {
        assert.equal(getWorkspaceNavigationSections(account, '/regional-staff/region/7'), workspaceNavigation)
        assert.ok(!filterNavigationSections(workspaceNavigation, account).some(s => s.items.some(i => i.key.startsWith('regional-'))))
    }
})

test('regional login restores all nine historical destinations with valid page routes and active highlighting', () => {
    const sections = filterNavigationSections(getWorkspaceNavigationSections(regional), regional)
    const items = sections.flatMap(s => s.items)
    assert.deepEqual(items.map(i => i.label), ['Overview', 'Finance', 'Growth', 'Ministry', 'Leadership', 'Compliance', 'Risk', 'Assemblies', 'Users'])
    for (const item of items) {
        const pathname = item.href.split('?')[0]
        assert.equal(getActiveNavigationKey(pathname, sections), item.key)
        const route = pathname.replace('/region/7', '/region/[id]').replace(/(\/\[id\])\/[^/]+$/, '$1/[module]')
        assert.ok(existsSync(`app/(authenticated)/(shell)/(dashboard)${route}/page.tsx`), route)
    }
    assert.equal(getActiveNavigationKey('/regional-staff/region/7/finance/detail', sections), 'regional-7-finance')
})

test('regional context is assignment-scoped and independent of assembly switching', () => {
    assert.deepEqual(getWorkspaceNavigationSections(user({ ...regional, church: 2 })), getWorkspaceNavigationSections(regional))
    assert.match(getWorkspaceNavigationSections(regional, '/regional-staff/region/9/finance')[0].items[0].href, /\/9$/)
    assert.match(getWorkspaceNavigationSections(regional, '/regional-staff/region/99')[0].items[0].href, /\/7$/)
    assert.deepEqual(getWorkspaceNavigationSections(user({ is_region_staff: true })), [])
    assert.deepEqual(getWorkspaceNavigationSections(user({ ...regional, is_admin: true })), getWorkspaceNavigationSections(regional))
})
