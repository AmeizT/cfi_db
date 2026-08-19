import type { NavigationIcon, NavigationSection } from "@/config/workspace-navigation"

export const MAX_PINNED_PAGES = 5
export const MAX_RECENT_PAGES = 5
export const SHORTCUT_PREFERENCES_VERSION = 1

export type ShortcutDestination = {
    key: string
    label: string
    areaLabel: string
    accessibleLabel: string
    href: string
    icon: NavigationIcon
    activeIcon: NavigationIcon
}

export type SidebarShortcutPreferences = {
    version: 1
    pinnedKeys: string[]
    recent: Array<{ key: string; visitedAt: number }>
}

export const EMPTY_SHORTCUT_PREFERENCES: SidebarShortcutPreferences = {
    version: SHORTCUT_PREFERENCES_VERSION,
    pinnedKeys: [],
    recent: [],
}

export function canonicalNavigationPath(href: string) {
    const pathname = href.split(/[?#]/, 1)[0] || "/"
    return pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname
}

export function buildWorkspaceShortcutRegistry(sections: NavigationSection[]) {
    const destinations: ShortcutDestination[] = []

    function visit(
        items: NavigationSection["items"],
        sectionTitle?: string,
        parentLabel?: string,
    ) {
        items.forEach((item) => {
            if (item.disabled) return
            if (item.children?.length) {
                visit(item.children, sectionTitle, item.label)
                return
            }

            const areaLabel = parentLabel ?? sectionTitle ?? "Workspace"
            destinations.push({
                key: item.key,
                label: item.label,
                areaLabel,
                accessibleLabel: `${areaLabel} / ${item.label}`,
                href: canonicalNavigationPath(item.href),
                icon: item.icon,
                activeIcon: item.activeIcon,
            })
        })
    }

    sections.forEach((section) => visit(section.items, section.title))
    return destinations
}

export function parseShortcutPreferences(value: string | null): SidebarShortcutPreferences {
    if (!value) return EMPTY_SHORTCUT_PREFERENCES

    try {
        const parsed = JSON.parse(value) as Partial<SidebarShortcutPreferences>
        if (parsed.version !== SHORTCUT_PREFERENCES_VERSION) return EMPTY_SHORTCUT_PREFERENCES

        const pinnedKeys = Array.isArray(parsed.pinnedKeys)
            ? parsed.pinnedKeys.filter((key): key is string => typeof key === "string")
            : []
        const recent = Array.isArray(parsed.recent)
            ? parsed.recent.filter((item): item is { key: string; visitedAt: number } => (
                Boolean(item)
                && typeof item.key === "string"
                && Number.isFinite(item.visitedAt)
            ))
            : []

        return {
            version: SHORTCUT_PREFERENCES_VERSION,
            pinnedKeys: [...new Set(pinnedKeys)].slice(0, MAX_PINNED_PAGES),
            recent: recent
                .filter((item, index, all) => all.findIndex((candidate) => candidate.key === item.key) === index)
                .sort((left, right) => right.visitedAt - left.visitedAt)
                .slice(0, MAX_RECENT_PAGES),
        }
    } catch {
        return EMPTY_SHORTCUT_PREFERENCES
    }
}

export function sanitizeShortcutPreferences(
    preferences: SidebarShortcutPreferences,
    validKeys: ReadonlySet<string>,
) {
    return {
        version: SHORTCUT_PREFERENCES_VERSION,
        pinnedKeys: preferences.pinnedKeys.filter((key) => validKeys.has(key)).slice(0, MAX_PINNED_PAGES),
        recent: preferences.recent.filter((item) => validKeys.has(item.key)).slice(0, MAX_RECENT_PAGES),
    } satisfies SidebarShortcutPreferences
}

export function pinShortcut(preferences: SidebarShortcutPreferences, key: string) {
    if (preferences.pinnedKeys.includes(key)) {
        return { preferences, limitReached: false }
    }
    if (preferences.pinnedKeys.length >= MAX_PINNED_PAGES) {
        return { preferences, limitReached: true }
    }

    return {
        preferences: {
            ...preferences,
            pinnedKeys: [...preferences.pinnedKeys, key],
        },
        limitReached: false,
    }
}

export function unpinShortcut(preferences: SidebarShortcutPreferences, key: string) {
    return {
        ...preferences,
        pinnedKeys: preferences.pinnedKeys.filter((candidate) => candidate !== key),
    }
}

export function recordShortcutVisit(
    preferences: SidebarShortcutPreferences,
    key: string,
    visitedAt: number,
) {
    return {
        ...preferences,
        recent: [
            { key, visitedAt },
            ...preferences.recent.filter((item) => item.key !== key),
        ].slice(0, MAX_RECENT_PAGES),
    }
}

export function resolveShortcutDestination(
    registry: ShortcutDestination[],
    pathname: string,
) {
    const canonicalPathname = canonicalNavigationPath(pathname)
    return registry.find((destination) => destination.href === canonicalPathname)
}

export function resolveShortcutLists(
    preferences: SidebarShortcutPreferences,
    registry: ShortcutDestination[],
) {
    const registryByKey = new Map(registry.map((item) => [item.key, item]))
    const pinned = preferences.pinnedKeys
        .map((key) => registryByKey.get(key))
        .filter((item): item is ShortcutDestination => Boolean(item))
    const pinnedKeys = new Set(pinned.map((item) => item.key))
    const recent = preferences.recent
        .filter((item) => !pinnedKeys.has(item.key))
        .map((item) => registryByKey.get(item.key))
        .filter((item): item is ShortcutDestination => Boolean(item))

    return { pinned, pinnedKeys, recent }
}
