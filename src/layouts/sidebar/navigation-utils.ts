import type { User } from "@/features/auth/schemas/user"
import type {
    NavigationItem,
    NavigationSection,
    WorkspacePermission,
} from "@/config/workspace-navigation"

function hasPermission(
    permission: WorkspacePermission | undefined,
    user: User | null | undefined
) {
    if (!permission) return true

    const permissions: Record<WorkspacePermission, boolean> = {
        manageAssemblies: Boolean(user?.is_admin || user?.is_region_staff),
        viewRegionalReports: Boolean(user?.is_region_staff),
        viewZone: Boolean(user?.is_db_zone_staff),
    }

    return permissions[permission]
}

export function filterNavigationSections(
    sections: NavigationSection[],
    user: User | null | undefined
) {
    function filterItems(items: NavigationItem[]): NavigationItem[] {
        return items.flatMap((item) => {
            if (!hasPermission(item.permission, user)) return []

            return [{
                ...item,
                children: item.children ? filterItems(item.children) : undefined,
            }]
        })
    }

    return sections
        .map((section) => ({ ...section, items: filterItems(section.items) }))
        .filter((section) => section.items.length > 0)
}

export function flattenNavigationItems(items: NavigationItem[]): NavigationItem[] {
    return items.flatMap((item) => [
        item,
        ...flattenNavigationItems(item.children ?? []),
    ])
}

export function getNavigationMatchScore(pathname: string, item: NavigationItem) {
    return [item.href, ...(item.match ?? [])].reduce((score, path) => {
        const matches = pathname === path || pathname.startsWith(`${path}/`)
        return matches ? Math.max(score, path.length) : score
    }, -1)
}

export function getActiveNavigationKey(
    pathname: string,
    sections: NavigationSection[]
) {
    const items = sections.flatMap((section) =>
        flattenNavigationItems(section.items)
    )

    return items.reduce<{ key: string; score: number } | null>((active, item) => {
        const score = getNavigationMatchScore(pathname, item)
        if (score < 0) return active

        // A leaf wins ties with a parent that points to its first destination.
        return score >= (active?.score ?? -1) ? { key: item.key, score } : active
    }, null)?.key
}

export function containsActiveNavigationItem(
    item: NavigationItem,
    activeKey: string | undefined
): boolean {
    return item.key === activeKey || Boolean(
        item.children?.some((child) =>
            containsActiveNavigationItem(child, activeKey)
        )
    )
}

export function getActiveParentKey(
    sections: NavigationSection[],
    activeKey: string | undefined
) {
    return sections
        .flatMap((section) => section.items)
        .find((item) =>
            item.children?.some((child) =>
                containsActiveNavigationItem(child, activeKey)
            )
        )?.key
}
