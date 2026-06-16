"use client"

import React from "react"
import type { Route } from "next"
import Link from "next/link"
import { UrlObject } from "url"
import { motion } from "motion/react"
import { IconPlus } from "@tabler/icons-react"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
import { getNavigation } from "../navigation/config/get-navigation"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { NavItem, QueryParams } from "../navigation/types"

export function NavBar() {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const period = searchParams.get("period") ?? undefined
    const currentTab = searchParams.get("tab") ?? undefined
    const mode = searchParams.get("mode") ?? undefined
    const defaultMode = mode?.includes("default") ?? false
    const navigation = getNavigation(undefined, searchParams as unknown as QueryParams)
    const menuGroups = Object.values(navigation).flat()

    const activePage = React.useMemo(() => {
        return menuGroups.find(item => {
            const currentPath = new URL(pathname ?? "", "http://localhost").pathname
            const itemPath = new URL(item.href || "/", "http://localhost").pathname
            return currentPath === itemPath || currentPath.startsWith(`${itemPath}/`)
        })
    }, [pathname, menuGroups])

    const navbarTabs = React.useMemo(() => {
        if (!activePage || !pathname) return []

        const children = activePage.children as NavItem[] | undefined
        if (!children?.length) return []

        const currentPath = new URL(pathname, "http://localhost").pathname

        const hasGrandChildren = children.some(
            (child) => child.children?.length
        )

        if (hasGrandChildren) {
            const activeChild = children.find((child) => {
                const childPath = new URL(child.href as string, "http://localhost").pathname
                return currentPath === childPath || currentPath.startsWith(`${childPath}/`)
            })

            if (activeChild?.children?.length) {
                return activeChild.children
            }

            return []
        }

        // =========================
        // CASE B: 2-Level Menu
        // =========================
        // No grandchildren anywhere → children become tabs
        return children

    }, [activePage, pathname])

    const emptyPages = navbarTabs.length === 0

    const replacementPathname = React.useMemo(() => {
        if (!pathname || !activePage) return ""
        const isParentPath = pathname === activePage.href
        const matcher = ["spaces", "insights", "attendance", "congregation", "finance"]
        const isMatch = matcher.includes(activePage?.label?.toLowerCase() || "")
        const defaultTab = activePage.children?.[0]?.href
        return isParentPath && isMatch && defaultTab ? defaultTab : ""
    }, [pathname, activePage])

    React.useEffect(() => {
        if (replacementPathname) {
            router.replace(replacementPathname as Route)
        }
    }, [replacementPathname, router])

    const currentPageName = React.useMemo(() => {
        if (!activePage || !pathname) return "Overview"

        const children = activePage.children as NavItem[] | undefined
        if (!children?.length) {
            return activePage.label
        }

        const currentPath = new URL(pathname, "http://localhost").pathname

        // Check if ANY child has grandchildren (3-level menu)
        const hasGrandChildren = children.some(
            (child) => child.children?.length
        )

        // CASE A: 3-level menu
        if (hasGrandChildren) {
            const activeChild = children.find((child) => {
                const childPath = new URL(child.href as string, "http://localhost").pathname
                return currentPath === childPath || currentPath.startsWith(`${childPath}/`)
            })

            // For items with grandchildren, the CHILD label becomes the page name
            return activeChild?.label ?? activePage.label
        }

        // CASE B: 2-level menu
        // No grandchildren anywhere → parent label becomes page name
        return activePage.label
    }, [activePage, pathname])

    if (replacementPathname) {
        return (
            <div className="mt-6 mb-4 flex w-full h-fit items-center gap-2 transition-[width,height] ease-linear">
                <div className="px-4 lg:px-8 flex flex-col w-full gap-4 lg:gap-2">
                    <div className="w-full flex flex-col gap-4 lg:gap-2">
                        <h3 className="text-2xl lg:text-3xl font-bold">
                            {currentPageName}
                        </h3>

                        <div className="h-8 lg:h-8 flex items-center space-x-2 border-b-0 border-solid border-gray-300 dark:border-neutral-700 overflow-y-hidden overflow-x-auto lg:overflow-x-hidden no-scrollbar">
                            {Array.from({ length: 4 }).map((_, index) => (
                                <div key={index} className="">
                                    <Skeleton className="h-5 w-24 rounded-lg bg-gray-200/70" />
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
        <React.Fragment>
            <div className="mt-18 lg:mt-6 mb-4 flex w-full h-fit items-center gap-2 transition-[width,height] ease-linear">
                <div className="flex flex-col w-full gap-4 px-4 lg:px-0 lg:gap-2">
                    <div className="lg:px-8 w-full h-auto flex items-center gap-4">
                        <button className="hidden size-8 center rounded-xl bg-white border border-border  transition-all duration-150 ease-out">
                            <IconPlus strokeWidth={1.5} className="size-6" />
                        </button>

                        <Separator orientation="vertical" className="hidden data-[orientation=vertical]:h-5 bg-border" />

                        <h3 className="text-2xl lg:text-[28px] font-bold">
                            {currentPageName}
                        </h3>
                    </div>

                    {!emptyPages && !defaultMode ? (
                        <div className="lg:px-6">
                            <div className="h-8 lg:h-7 flex items-center space-x-2 lg:space-x-1 overflow-y-hidden overflow-x-auto lg:overflow-y-visible lg:overflow-x-visible no-scrollbar">
                                {navbarTabs.map((tab) => {
                                    const isActive = (() => {
                                        if (!tab?.href) return false

                                        // Special handling for Reports grandchildren: use ?tab=
                                        if (activePage?.label?.toLowerCase() === "reports") {
                                            return currentTab === tab.label.toLowerCase()
                                        }

                                        if (!pathname) return false
                                        const tabPath = new URL(tab.href, "http://localhost").pathname
                                        const currentPath = new URL(pathname, "http://localhost").pathname
                                        return tabPath === currentPath
                                    })()

                                    return (
                                        <Link
                                            key={tab.label}
                                            href={tab?.href as unknown as UrlObject || "#"}
                                            className={`px-4 lg:px-2 h-full inline-flex justify-center items-center relative z-0 text-sm font-semibold whitespace-nowrap rounded-full lg:rounded-lg ${isActive ? "text-white lg:text-primary lg:hover:bg-primary/5 dark:hover:bg-neutral-700" : "dark:text-white lg:hover:bg-gray-100 dark:hover:bg-neutral-700"}`}
                                        >
                                            {tab?.label}
                                            {isActive ? (
                                                <motion.span
                                                    id="active-pill"
                                                    layoutId="active-pill"
                                                    className={`w-full lg:w-[calc(100%-1rem)] h-full lg:h-0.5 absolute inset-x-0 lg:left-2 lg:-bottom-[5.5px] -z-10 rounded-full ${isActive ? "block bg-gray-800 lg:bg-primary lg:dark:bg-primary" : "hidden"} transition-discrete`}
                                                />
                                            ) : null}
                                        </Link>
                                    )
                                })}
                            </div>

                            {!emptyPages && (
                                <div className="px-2 mt-1 hidden lg:flex">
                                    <Separator className="w-full bg-border dark:bg-neutral-700" />
                                </div>
                            )}
                        </div>
                    ) : null}
                </div>
            </div>
        </React.Fragment>
    )
}