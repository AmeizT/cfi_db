"use client"

import React from "react"
import Link from "next/link"
import { motion } from "motion/react"
import { dashboardMenu } from "./dashboardMenu"
import { usePathname } from "next/navigation"
import { Separator } from "@/components/ui/separator"

export function DashboardTabs() {
    const pathname = usePathname()
    const menuGroups = Object.values(dashboardMenu).flat()

    const activePage = React.useMemo(() => {
        return menuGroups.find(item => {
            const currentPath = new URL(pathname ?? "", "http://localhost").pathname
            const itemPath = new URL(item.pathname || "/", "http://localhost").pathname
            return currentPath === itemPath || currentPath.startsWith(`${itemPath}/`)
        })
    }, [pathname, menuGroups])

    return (
        <React.Fragment>
            <div className="h-8 lg:h-7 flex items-center space-x-2 lg:space-x-1 border-b-0 border-solid border-gray-300 dark:border-neutral-700 overflow-y-hidden overflow-x-auto lg:overflow-y-visible lg:overflow-x-visible no-scrollbar">
                {activePage?.pages?.map((tab) => {
                    const isActive = (() => {
                        if (!tab?.pathname || !pathname) return false
                        const tabPath = new URL(tab.pathname, "http://localhost").pathname
                        const currentPath = new URL(pathname, "http://localhost").pathname
                        return tabPath === currentPath
                    })()

                    return (
                        <Link
                            key={tab.name}
                            href={tab?.pathname || "#"}
                            className={`px-4 lg:px-2 h-full inline-flex justify-center items-center relative z-0 text-sm font-semibold whitespace-nowrap bg-gray-100 dark:bg-neutral-800 lg:bg-transparent rounded-full lg:rounded-lg ${isActive ? "text-white lg:text-primary lg:hover:bg-primary/5" : "text-neutral-900 dark:text-white lg:hover:bg-gray-100"}`}
                        >
                            {tab?.name}
                            {isActive ? (
                                <motion.span
                                    id="active-pill"
                                    layoutId="active-pill"
                                    className={`w-full lg:w-[calc(100%-1rem)] h-full lg:h-[2px] absolute inset-x-0 lg:left-2 lg:-bottom-[5.5px] -z-10 rounded-full ${isActive ? "block bg-neutral-800 lg:bg-primary dark:bg-primary" : "hidden"} transition-discrete`}
                                />
                            ) : null}
                        </Link>
                    )
                })}
            </div>

            <div className="px-2 mt-1 hidden lg:flex">
                <Separator className="w-full bg-gray-200 dark:bg-neutral-700" />
            </div>
        </React.Fragment>
    )
}