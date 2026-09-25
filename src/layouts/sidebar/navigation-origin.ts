export type SidebarNavigationItem = { key: string; href: string }
export type SidebarNavigationSource = 'navigation' | 'shortcuts'
export type SidebarNavigationOrigin = {
    pathname: string
    selection: {
        source: SidebarNavigationSource
        itemKey: string
        pathname: string
        pending: boolean
    } | null
}

export function selectSidebarOrigin(
    pathname: string,
    source: SidebarNavigationSource,
    item: SidebarNavigationItem,
): SidebarNavigationOrigin {
    const target = item.href.split(/[?#]/, 1)[0]
    return {
        pathname,
        selection: { source, itemKey: item.key, pathname: target, pending: target !== pathname },
    }
}

/** Retain a click across its own route transition, never an unrelated navigation. */
export function reconcileSidebarOrigin(state: SidebarNavigationOrigin, pathname: string): SidebarNavigationOrigin {
    if (state.pathname === pathname) return state
    const selection = state.selection?.pending && state.selection.pathname === pathname
        ? { ...state.selection, pending: false }
        : null
    return { pathname, selection }
}

export function getSelectedShortcutKey(
    state: SidebarNavigationOrigin,
    matchingShortcutKey: string | undefined,
) {
    const selection = state.selection
    return selection?.source === 'shortcuts'
        && selection.pathname === state.pathname
        && selection.itemKey === matchingShortcutKey
        ? matchingShortcutKey
        : undefined
}
