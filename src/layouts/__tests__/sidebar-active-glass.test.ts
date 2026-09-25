import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import { createElement as h } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { Home } from 'lucide-react'
import { SidebarProvider } from '../../components/ui/sidebar'
import { UnifiedSidebarNavigation } from '../sidebar/UnifiedSidebarNavigation'
import { SidebarShortcuts } from '../../features/workspace/sidebar/SidebarShortcuts'
import { getActiveNavigationKey } from '../sidebar/navigation-utils'
import { getActiveShortcutKey, type ShortcutDestination } from '../../features/workspace/sidebar/shortcuts'
import { getSelectedShortcutKey, selectSidebarOrigin } from '../sidebar/navigation-origin'
import type { NavigationItem, NavigationSection } from '../../config/workspace-navigation'

const item = (key: string): NavigationItem => ({ key, label: key, href: `/${key}`, icon: Home, activeIcon: Home })
const sections: NavigationSection[] = [
  { items: [item('home')] },
  { title: 'Reporting', items: [item('reports')] },
  { title: 'Operations', items: [item('operations')] },
  { title: 'Organization', items: [item('organization'), { ...item('parent'), children: [item('nested')] }] },
]
const pinned = ['reports', 'operations'].map(key => ({ ...item(key), accessibleLabel: key })) as ShortcutDestination[]
const noop = () => {}
const css = readFileSync('src/styles/shell.css', 'utf8')

for (const [name, route, shortcuts] of [
  ['Home', '/home', []],
  ['first Shortcut', '/reports', pinned],
  ['another Shortcut', '/operations', pinned],
  ['Reporting', '/reports', []],
  ['Operations', '/operations', []],
  ['Organization', '/organization', []],
  ['nested item', '/nested', []],
] as const) {
  test(`${name} renders exactly one active shared sidebar button`, () => {
    const activeKey = getActiveNavigationKey(route, sections)
    const matchingShortcutKey = getActiveShortcutKey(activeKey, sections, [...shortcuts])
    const clickedShortcut = shortcuts.find(item => item.key === matchingShortcutKey)
    const origin = clickedShortcut
      ? selectSidebarOrigin(route, 'shortcuts', clickedShortcut)
      : { pathname: route, selection: null }
    const activeShortcutKey = getSelectedShortcutKey(origin, matchingShortcutKey)
    const html = renderToStaticMarkup(h(SidebarProvider, {},
      h(SidebarShortcuts, { pinned: [...shortcuts], recent: [], activeKey: activeShortcutKey, onNavigate: noop, onUnpin: noop }),
      h(UnifiedSidebarNavigation, { sections, activeKey, suppressActive: Boolean(activeShortcutKey), onNavigate: noop }),
    ))
    const active = html.match(/<[^>]+data-active="true"[^>]*>/g) ?? []
    assert.equal(active.length, 1)
    assert.ok(active[0].includes(`href="${route}"`))
    const primitive = route === '/nested' ? 'menu-sub-button' : 'menu-button'
    assert.ok(active[0].includes(`data-sidebar="${primitive}"`))
    assert.ok(css.includes(`[data-sidebar="${primitive}"][data-active="true"]`))
    assert.equal((html.match(/aria-current="page"/g) ?? []).length, 1)
  })
}
