"use client"

import Link from "next/link"
import { motion } from "motion/react"
import { Separator } from "@/components/ui/separator"
import { Notification01Icon, Search01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon, IconSvgElement } from "@hugeicons/react"
import { Input } from "@/components/ui/input"
import AppWorkbench from "./AppWorkbench";
import { AssemblySwitcher } from "./AssemblySwitcher";

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
    return (
        <header className="flex h-16 w-full shrink-0 items-center bg-[var(--shell-chrome-background)] text-[var(--shell-chrome-foreground)] lg:h-(--navbar-height)">
            <div className="px-4 lg:px-1.5 h-full w-full flex justify-between items-center gap-1">
                <div className="min-w-auto">
                    <AssemblySwitcher />
                </div>

                <div className="hidden lg:flex items-center gap-3">
                    <div className="px-2 w-xs h-8.5 flex items-center gap-2 rounded-full border border-[var(--shell-sidebar-border)] bg-[var(--shell-sidebar-hover)] shadow-sm">
                        <HugeiconsIcon icon={Search01Icon} className="size-5 text-[var(--shell-chrome-muted-foreground)]" />
                        <Input className="p-0 w-full h-full border-none bg-transparent font-medium text-[var(--shell-chrome-foreground)] caret-[var(--shell-chrome-foreground)] placeholder:text-[var(--shell-chrome-muted-foreground)] focus-visible:ring-0" placeholder="Search..." />
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Separator
                        orientation="vertical"
                        className="mx-2 bg-[var(--shell-sidebar-border)] data-[orientation=vertical]:h-4"
                    />

                    {navigationShortcuts.map((item) =>
                        item.href ? (
                            <Link
                                href={item.href}
                                key={item.title}
                                className="size-8 hidden lg:flex justify-center items-center text-[var(--shell-chrome-foreground)] hover:bg-[var(--shell-chrome-hover)] transition-colors rounded-lg group"
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
                                className="size-8 hidden lg:flex justify-center items-center text-[var(--shell-chrome-foreground)] hover:bg-[var(--shell-chrome-hover)] transition-colors rounded-lg group"
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
