"use client"

import Link from "next/link"
import { motion } from "motion/react"
// import UserMenu from "./UserMenu"
import { useUser } from "@/hooks/query/use-user"
import { CreateDropdown } from "./CreateDropdown"
import { Separator } from "@/components/ui/separator"
import { Home08Icon, Notification01Icon, Search01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon, IconSvgElement } from "@hugeicons/react"
import { Input } from "@/components/ui/input"
import AppWorkbench from "./AppWorkbench";

export interface NavigationShortcut {
    title: string
    icon: IconSvgElement
    href?: string
}

export const navigationShortcuts: NavigationShortcut[] = [
    {
        title: "Notifications",
        icon: Notification01Icon,
    },
]

export function AppNavbar() {
    const { data: user } = useUser()
    const assemblies = user?.assemblies || []
    const activeAssembly = assemblies?.find(assembly => assembly?.id === Number(user?.church))
    console.log(activeAssembly)

    return (
        <header className="lg:gap-2 lg:px-0 w-full flex shrink-0 items-center transition-[width,height] ease-linear">
            <div className="px-4 lg:px-6 h-16 lg:h-14 flex w-full items-center gap-1 lg:border-b-0 border-gray-200 dark:border-neutral-700">
                <div className="w-full hidden lg:flex items-center gap-3">
                    <div className="px-2 w-1/3 h-9 flex items-center gap-2 ring-0 border border-border shadow-xs rounded-[10px] placeholder:text-gray-500 bg-surface">
                        <HugeiconsIcon icon={Search01Icon} />
                        <Input className="p-0 w-full h-full active:ring-0 focus-visible:ring-0 border-none bg-transparent font-medium placeholder:text-gray-500 caret-user-theme" placeholder="Search people, reports, assemblies..." />
                    </div>
                </div>
                
                <div className="block">
                    {/* <UserMenu /> */}
                </div>

                {/* <div className="p-1 hidden justify-center items-center gap-x-2 rounded-full bg-gray-100">
                    <AvatarGroupDemo />
                    <div className="flex flex-col gap-3.5">
                        <span className="text-sm font-semibold">
                            {activeAssembly?.name}
                        </span>

                        <small className="hidden leading-0">
                            {activeAssembly?.country}
                        </small>
                    </div>

                    <button className="size-7 flex justify-center items-center rounded-full bg-white">
                        <IconChevronsDown className="size-5" />
                    </button>
                </div> */}

                <div className="ml-auto flex items-center gap-2">
                    

                    <Separator
                        orientation="vertical"
                        className="mx-2 data-[orientation=vertical]:h-4 bg-gray-300"
                    />

                    {navigationShortcuts.map((item) =>
                        item.href ? (
                            <Link
                                href={item.href}
                                key={item.title}
                                className="size-8 hidden lg:flex justify-center items-center text-gray-800 dark:text-white hover:text-neutral-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors rounded-lg group"
                            >
                                {item.title === "Notifications" ? (
                                    <motion.span
                                        whileHover={{ scale: 1.2, y: -2 }}
                                        transition={{ type: "spring", stiffness: 300 }}
                                    >
                                        <HugeiconsIcon icon={item.icon} strokeWidth={2} className="size-5" />
                                    </motion.span>
                                ) : (
                                    <span className="transition-transform group-hover:scale-102">
                                        <HugeiconsIcon icon={item.icon} strokeWidth={2} className="size-5" />
                                    </span>
                                )}
                            </Link>
                        ) : (
                            <button
                                key={item.title}
                                className="size-8 hidden lg:flex justify-center items-center text-gray-800 dark:text-white hover:text-neutral-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors rounded-lg group"
                            >
                                {item.title === "Notifications" ? (
                                    <motion.span
                                        whileHover={{ scale: 1.2, y: -2 }}
                                        transition={{ type: "spring", stiffness: 300 }}
                                    >
                                        <HugeiconsIcon icon={item.icon} strokeWidth={2} className="size-5" />
                                    </motion.span>
                                ) : (
                                    <span className="transition-transform group-hover:scale-110">
                                        <HugeiconsIcon icon={item.icon} strokeWidth={2} className="size-5" />
                                    </span>
                                )}
                            </button>
                        )
                    )}

                    <div className="ml-2 h-8 flex items-center">
                        <AppWorkbench />
                    </div>
                </div>
            </div>
        </header>
    )
}

