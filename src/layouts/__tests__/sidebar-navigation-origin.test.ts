import assert from 'node:assert/strict'
import test from 'node:test'
import { createElement as h } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { Home } from 'lucide-react'
import { SidebarProvider } from '../../components/ui/sidebar'
import { UnifiedSidebarNavigation } from '../sidebar/UnifiedSidebarNavigation'
import { SidebarShortcuts } from '../../features/workspace/sidebar/SidebarShortcuts'
import { getActiveNavigationKey } from '../sidebar/navigation-utils'
import { getActiveShortcutKey } from '../../features/workspace/sidebar/shortcuts'
import { getSelectedShortcutKey, reconcileSidebarOrigin, selectSidebarOrigin, type SidebarNavigationOrigin } from '../sidebar/navigation-origin'

const tithes = { key: 'tithes', label: 'Tithes', href: '/finance/tithes', icon: Home, activeIcon: Home }
const members = { key: 'members', label: 'Members', href: '/members', icon: Home, activeIcon: Home }
const sections = [
    { title: 'Finance', items: [{ ...tithes, key: 'finance', href: '/finance', children: [tithes] }] },
    { title: 'Organization', items: [members] },
]
const pinned = [tithes, members].map(item => ({ ...item, accessibleLabel: item.label, areaLabel: 'Shortcuts' }))
const noop = () => {}

function verify(state: SidebarNavigationOrigin, source: 'navigation' | 'shortcuts') {
    const activeKey = getActiveNavigationKey(state.pathname, sections)
    const activeShortcutKey = getSelectedShortcutKey(state, getActiveShortcutKey(activeKey, sections, pinned))
    const html = renderToStaticMarkup(h(SidebarProvider, {},
        h('div', { 'data-origin': 'shortcuts' }, h(SidebarShortcuts, { pinned, recent: [], activeKey: activeShortcutKey, onNavigate: noop, onUnpin: noop })),
        h('div', { 'data-origin': 'navigation' }, h(UnifiedSidebarNavigation, { sections, activeKey, suppressActive: Boolean(activeShortcutKey), onNavigate: noop })),
    ))
    const split = html.indexOf('data-origin="navigation"')
    const shortcutsHtml = html.slice(0, split)
    const navigationHtml = html.slice(split)
    assert.equal((html.match(/data-active="true"/g) ?? []).length, 1)
    assert.equal((html.match(/aria-current="page"/g) ?? []).length, 1)
    assert.equal(shortcutsHtml.includes('data-active="true"'), source === 'shortcuts')
    assert.equal(navigationHtml.includes('data-active="true"'), source === 'navigation')
}

for (const item of [tithes, members]) {
    test(`${item.label}: original click, same-route Shortcut click, and original click transfer sole ownership`, () => {
        let state = selectSidebarOrigin('/home', 'navigation', item)
        state = reconcileSidebarOrigin(state, item.href)
        verify(state, 'navigation')
        state = selectSidebarOrigin(item.href, 'shortcuts', item)
        verify(state, 'shortcuts')
        state = selectSidebarOrigin(item.href, 'navigation', item)
        verify(state, 'navigation')
    })
    test(`${item.label}: direct load and reload prefer original despite existing Shortcut`, () => {
        verify({ pathname: item.href, selection: null }, 'navigation')
    })
    test(`${item.label}: Shortcut click across routes survives its route transition only`, () => {
        let state = selectSidebarOrigin('/home', 'shortcuts', item)
        state = reconcileSidebarOrigin(state, item.href)
        verify(state, 'shortcuts')
        state = reconcileSidebarOrigin(state, '/elsewhere')
        state = reconcileSidebarOrigin(state, item.href)
        verify(state, 'navigation')
    })
}

test('a redirected or unrelated destination discards pending source', () => {
    const state = reconcileSidebarOrigin(selectSidebarOrigin('/home', 'shortcuts', tithes), members.href)
    verify(state, 'navigation')
})

test('a removed Shortcut cannot suppress the original route', () => {
    assert.equal(getSelectedShortcutKey(selectSidebarOrigin(tithes.href, 'shortcuts', tithes), undefined), undefined)
})
