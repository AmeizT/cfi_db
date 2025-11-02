"use client"

import React from "react"
import { dashboardMenu } from "./dashboardMenu"
import { Skeleton } from "@/components/ui/skeleton"
import { usePathname, useRouter } from "next/navigation"
import { DashboardTabs } from "./DashboardTabs"
import { Separator } from "@/components/ui/separator"

export function TabBar() {
    const pathname = usePathname()
    const router = useRouter()

    const menuGroups = Object.values(dashboardMenu).flat()

    const activePage = React.useMemo(() => {
        return menuGroups.find(item => {
            const currentPath = new URL(pathname ?? "", "http://localhost").pathname
            const itemPath = new URL(item.pathname || "/", "http://localhost").pathname
            return currentPath === itemPath || currentPath.startsWith(`${itemPath}/`)
        })
    }, [pathname, menuGroups])

    const replacementPathname = React.useMemo(() => {
        if (!pathname || !activePage) return ""
        const isParentPath = pathname === activePage.pathname
        const matcher = ["reports", "groups", "insights", "attendance", "congregation", "finance"]
        const isMatch = matcher.includes(activePage.name.toLowerCase())
        const defaultTab = activePage.pages?.[0]?.pathname
        return isParentPath && isMatch && defaultTab ? defaultTab : ""
    }, [pathname, activePage])

    React.useEffect(() => {
        if (replacementPathname) {
            router.replace(replacementPathname)
        }
    }, [replacementPathname, router])

    // const currentPath = new URL(pathname ?? "/", "http://localhost").pathname

    // const index = activePage?.pages?.findIndex(item => {
    //     const tabPath = new URL(item.pathname || "/", "http://localhost").pathname
    //     return tabPath === currentPath
    // })

    // const isOverviewTab =
    //     index !== undefined &&
    //     index !== -1 &&
    //     activePage?.pages?.[index].name.toLowerCase() === "overview"

    // const currentTabName =
    //     isOverviewTab && activePage?.name
    //         ? `${activePage.name}`
    //         : pathname?.includes("editor") ? "Editor"
    //             : index !== undefined && index !== -1 && activePage?.pages
    //                 ? activePage.pages[index].name
    //                 : activePage?.name

    const currentPageName = activePage?.name || "Dashboard"

    if (replacementPathname) {
        return (
            <div className="mt-6 mb-4 flex w-full h-fit items-center gap-2 transition-[width,height] ease-linear">
                <div className="px-4 lg:px-8 flex flex-col w-full gap-4 lg:gap-2">
                    <div className="w-full flex flex-col gap-4 lg:gap-2">
                        <h3 className="text-2xl lg:text-[1.75rem] font-bold">
                            {currentPageName}
                        </h3>

                        <div className="h-8 lg:h-8 flex items-center space-x-2 border-b-0 border-solid border-gray-300 dark:border-neutral-700 overflow-y-hidden overflow-x-auto lg:overflow-x-hidden no-scrollbar">
                            {Array.from({ length: 4 }).map((_, index) => (
                                <div key={index} className="">
                                    <Skeleton className="h-4 w-24 rounded-lg" />
                                </div>
                            ))}
                        </div>
                    </div>

                    <Separator className="w-full bg-gray-200 dark:bg-neutral-700" />
                </div>
            </div>
        )
    }

    return (
        <div className="mt-18 lg:mt-6 mb-4 flex w-full h-fit items-center gap-2 transition-[width,height] ease-linear">
            <div className="flex flex-col w-full gap-4 px-4 lg:px-0 lg:gap-2">
                <h3 className="lg:px-8 text-2xl lg:text-[1.75rem] font-bold">
                    {currentPageName}
                </h3>

                <div className="lg:px-6">
                    <DashboardTabs />
                </div>
            </div>
        </div>
    )
}