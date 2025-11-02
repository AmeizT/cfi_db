import { dashboardMenu } from "@/layouts/dashboard/dashboardMenu"

export function getCurrentPageName(pathname: string): string | null {
    const menuGroups = Object.values(dashboardMenu).flat()

    for (const item of menuGroups) {
        if (item.pages) {
            for (const page of item.pages) {
                if (!page.pathname) continue
                const pagePath = new URL(page.pathname, "http://localhost").pathname
                const currentPath = new URL(pathname, "http://localhost").pathname

                if (currentPath === pagePath || currentPath.startsWith(pagePath)) {
                    if (pagePath.includes("/overview")) {
                        return item.name
                    }
                    return page.name
                }
            }
        }

        if (item.pathname) {
            const itemPath = new URL(item.pathname, "http://localhost").pathname
            const currentPath = new URL(pathname, "http://localhost").pathname
            if (currentPath === itemPath || currentPath.startsWith(itemPath)) {
                return item.name
            }
        }
    }

    return null
}