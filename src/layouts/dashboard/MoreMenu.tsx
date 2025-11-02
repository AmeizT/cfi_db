"use client"

import React from "react"
import Link from "next/link"
import { Drawer } from "vaul"
import { IconDots } from "@tabler/icons-react"
import { dashboardMenu, MenuItem, STROKE_WIDTH } from "./dashboardMenu"
import { usePathname } from "next/navigation"
import { HugeiconsIcon } from "@hugeicons/react"

export function MoreMenu() {
    const pathname = usePathname()
    const [isOpen, setIsOpen] = React.useState<boolean>(false)

    function getExtraMenuItems(platform: MenuItem[], tools: MenuItem[]): MenuItem[] {
        const combined = [
            ...platform.filter(item => !item.showInBottomNav),
            ...tools,
        ]

        const unique = Array.from(new Map(combined.map(item => [item.name, item])).values())

        return unique
    }

    const extraMenu = getExtraMenuItems(dashboardMenu.platform, dashboardMenu.tools)

    return (
        <Drawer.Root shouldScaleBackground open={isOpen} onOpenChange={setIsOpen}>
            <Drawer.Trigger className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                <IconDots />
                <span className="text-[0.625rem] font-medium">
                    More
                </span>
            </Drawer.Trigger>
            <Drawer.Portal>
                <Drawer.Overlay className="fixed inset-0 bg-black/40 z-40" />
                <Drawer.Content className="bg-gray-100 dark:bg-neutral-800 flex flex-col rounded-t-3xl h-fit pb-0 mt-0 fixed bottom-0 left-0 right-0 z-50">
                    <div className="px-4 pt-2 pb-8 rounded-t-3xl flex-1">
                        <div className="mx-auto w-12 h-1 flex-shrink-0 rounded-full bg-gray-200 dark:bg-neutral-600 mb-8" />
                        <div className="max-w-md mx-auto">
                            <Drawer.Title hidden className="font-medium mb-4" />

                            <div className="mb-6 rounded-3xl bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 p-4 text-xs">
                              As part of a compliance audit, all assemblies must update their reports through <strong>August 31, 2025</strong>, by <strong>September 7, 2025</strong>. Assemblies registered after April 2025 are exempt. A list of non-compliant assemblies will be forwarded to the Overseer’s Office for review.
                            </div>

                            <ul className="px-0 grid grid-cols-4 gap-4">
                                {extraMenu?.map(item => {
                                    const isActive = item?.pathname === "/" ? pathname === "/" : pathname !== "/" && pathname?.includes(item?.pathname?.split("/")[1] ?? "")

                                    return (
                                        <li key={item.name}>
                                            <Link onClick={() => setIsOpen(!isOpen)} href={item?.pathname || "/"} className={`px-0 w-full h-fit flex flex-col justify-center items-center gap-y-2 ${isActive ? "text-primary" : "text-gray-500 dark:text-gray-400"}`}>
                                                <span className="w-full h-20 flex justify-center items-center bg-white dark:bg-neutral-700/60 rounded-3xl">
                                                    {isActive ? <item.activeIcon size={32} strokeWidth={STROKE_WIDTH} /> : <HugeiconsIcon icon={item.icon} size={32} strokeWidth={STROKE_WIDTH} />}
                                                </span>

                                                <span className={`text-xs`}>
                                                    {item.name}
                                                </span>
                                            </Link>
                                        </li>
                                    )
                                })}
                            </ul>
                        </div>
                    </div>
                </Drawer.Content>
            </Drawer.Portal>
        </Drawer.Root>
    );
}
