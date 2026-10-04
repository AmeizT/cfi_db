"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
    FileText,
    Home,
    UserRound,
    Users,
    Wallet,
} from "lucide-react"

import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"

import {
    getWorkspaceNavigationSections,
    type NavigationItem,
} from "@/config/workspace-navigation"

import {
    filterNavigationSections,
    flattenNavigationItems,
    getActiveNavigationKey,
    getMobileNavigationGroups,
} from "@/layouts/sidebar/navigation-utils"

import { useUser } from "@/hooks/query/use-user"
import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"

import { NavIcon } from "./dashboard/AppNavIcon"
import { ProfileDrawerContent } from "./dashboard/ProfileDropdown"

const dockItems = [
    {
        key: "home",
        label: "Home",
        icon: Home,
    },
    {
        key: "reports",
        label: "Reports",
        icon: FileText,
    },
    {
        key: "finance",
        label: "Finance",
        icon: Wallet,
    },
    {
        key: "engagement",
        label: "Engagement",
        icon: Users,
    },
    {
        key: "profile",
        label: "Profile",
        icon: UserRound,
    },
] as const

export default function BottomMenu() {
    const pathname = usePathname()

    const { data: user } = useUser()
    const mobile = useIsMobile()

    const [openGroup, setOpenGroup] = React.useState<string | null>(null)

    const sections = filterNavigationSections(
        getWorkspaceNavigationSections(user, pathname),
        user
    )

    const items = sections.flatMap((section) => section.items)

    const groups: Record<string, NavigationItem[]> =
        getMobileNavigationGroups(sections)

    const activeKey = getActiveNavigationKey(pathname, sections)

    const home =
        items.find((item) => item.key === "home") ??
        items[0]

    const buttonClass = cn(
        "flex min-w-0 flex-1 flex-col items-center justify-center",
        "gap-0.5 rounded-full px-2 py-1",
        "text-[11px] font-medium text-muted-foreground",
        "outline-none",
        "focus-visible:ring-2 focus-visible:ring-ring",
        "disabled:opacity-40"
    )

    return (
        <nav
            aria-label="Mobile workspace navigation"
            className={cn(
                "fixed inset-x-4",
                "bottom-[calc(0.75rem+env(safe-area-inset-bottom))]",
                "z-40 mx-auto",
                "flex h-16 max-w-md items-stretch gap-1",
                "rounded-full",
                "border border-border/70",
                "bg-background/70",
                "p-1.5",
                "shadow-lg",
                "backdrop-blur-2xl",
                "backdrop-saturate-100",
                "md:hidden"
            )}
        >
            {dockItems.map(({ key, label, icon: Icon }) => {
                const active =
                    key === "home"
                        ? activeKey === home?.key
                        : key === "profile"
                            ? openGroup === key
                            : groups[key]?.some((item) =>
                                flattenNavigationItems([item]).some(
                                    (child) => child.key === activeKey
                                )
                            )

                const content = (
                    <>
                        <Icon
                            aria-hidden="true"
                            className="size-5"
                        />

                        <span className="hidden max-w-full truncate">
                            {label}
                        </span>
                    </>
                )

                if (key === "home") {
                    return (
                        <Link
                            key={key}
                            href={home?.href ?? "/"}
                            aria-label={label}
                            aria-current={active ? "page" : undefined}
                            onClick={() => setOpenGroup(null)}
                            className={cn(
                                buttonClass,
                                active && "bg-assembly-theme-600/5 text-assembly-theme-700 dark:bg-assembly-theme-400/10 dark:text-assembly-theme-400"
                            )}
                        >
                            {content}
                        </Link>
                    )
                }

                return (
                    <Drawer
                        key={key}
                        open={mobile && openGroup === key}
                        onOpenChange={(open) => {
                            setOpenGroup(open ? key : null)
                        }}
                    >
                        <DrawerTrigger asChild>
                            <button
                                type="button"
                                disabled={
                                    key !== "profile" &&
                                    !groups[key]?.length
                                }
                                className={cn(
                                    buttonClass,
                                    (active || openGroup === key) &&
                                    "bg-assembly-theme-600/5 text-assembly-theme-700 dark:bg-assembly-theme-400/10 dark:text-assembly-theme-400"
                                )}
                                aria-label={`Open ${label}`}
                            >
                                {content}
                            </button>
                        </DrawerTrigger>

                        <DrawerContent
                            className={cn(
                                "data-[vaul-drawer-direction=bottom]:rounded-t-3xl",
                                "pb-[max(1rem,env(safe-area-inset-bottom))]"
                            )}
                        >
                            <DrawerTitle className="px-5 py-4">
                                {label}
                            </DrawerTitle>

                            <DrawerDescription className="sr-only">
                                {key === "profile"
                                    ? "Manage your account and appearance."
                                    : `Choose a ${label.toLowerCase()} destination.`}
                            </DrawerDescription>

                            <div className="min-h-0 overflow-y-auto overscroll-contain px-3">
                                {key === "profile" ? (
                                    <ProfileDrawerContent />
                                ) : (
                                    groups[key]?.map((item) => (
                                        <Link
                                            key={item.key}
                                            href={item.href}
                                            onClick={(event) => {
                                                if (item.disabled) {
                                                    event.preventDefault()
                                                    return
                                                }

                                                setOpenGroup(null)
                                            }}
                                            aria-disabled={item.disabled}
                                            tabIndex={
                                                item.disabled
                                                    ? -1
                                                    : undefined
                                            }
                                            aria-current={
                                                activeKey === item.key
                                                    ? "page"
                                                    : undefined
                                            }
                                            className={cn(
                                                "flex min-h-12 items-center gap-3",
                                                "rounded-xl px-3 py-3",
                                                "text-sm",
                                                "hover:bg-accent",
                                                "focus-visible:ring-2 focus-visible:ring-ring",
                                                activeKey === item.key &&
                                                "bg-accent/60",
                                                item.disabled &&
                                                "pointer-events-none opacity-40"
                                            )}
                                        >
                                            <NavIcon
                                                icon={
                                                    activeKey === item.key
                                                        ? item.activeIcon
                                                        : item.icon
                                                }
                                                className="size-5"
                                                aria-hidden="true"
                                            />

                                            <span className="min-w-0 truncate">
                                                {item.label}
                                            </span>
                                        </Link>
                                    ))
                                )}
                            </div>
                        </DrawerContent>
                    </Drawer>
                )
            })}
        </nav>
    )
}