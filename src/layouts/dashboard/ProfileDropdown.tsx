"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { useUser } from "@/hooks/query/use-user"
import { oklchLinearGradient } from "../utils/get-oklch-gradient"
import { getTextColor } from "../utils/get-text-color"
import { SignoutButton } from "./components/SignoutButton"
import { ThemeMenuItem } from "./components/ThemeMenuItem"
import { SettingsIcon } from '@solar-icons/react/line-duotone/settings'
import { ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"

export function ProfileDropdown({
    variant = "topbar",
}: {
    variant?: "topbar" | "sidebar"
}) {
    const { data: user } = useUser()
    const isSidebar = variant === "sidebar"

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    type="button"
                    variant="ghost"
                    size={isSidebar ? "default" : "icon"}
                    aria-label="Open user account menu"
                    className={cn(
                        "shadow-none",
                        isSidebar
                            ? "h-auto w-full justify-start gap-3 rounded-xl bg-transparent text-(--shell-sidebar-foreground) hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                            : "rounded-full text-(--shell-chrome-foreground) hover:text-(--shell-chrome-foreground)"
                    )}
                >
                    <Avatar className={cn("size-9", isSidebar && "size-9")}>
                        <AvatarImage src={user?.avatar || undefined} />
                        <AvatarFallback 
                            className="font-semibold"
                            style={{
                                background: oklchLinearGradient(user?.avatar_fallback || "oklch(87.2% 0.007 219.6)"),
                                color: getTextColor(user?.avatar_fallback || "oklch(45% 0.017 213.2)")
                            }}
                        >
                            {user?.first_name?.charAt(0) || "U"}
                        </AvatarFallback>
                    </Avatar>
                    {isSidebar ? (
                        <>
                            <span className="min-w-0 flex-1 text-left">
                                <span className="block truncate text-sm font-semibold leading-tight">
                                    {user?.full_name || user?.first_name || "Account"}
                                </span>
                                <span className="block truncate text-xs font-normal text-(--shell-sidebar-muted-foreground)">
                                    {user?.roles?.[0]?.name || user?.email}
                                </span>
                            </span>
                            <ChevronsUpDown className="size-4 text-(--shell-sidebar-muted-foreground)" />
                        </>
                    ) : null}
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
                align={isSidebar ? "start" : "end"}
                side={isSidebar ? "top" : "bottom"}
                className="w-[calc(100dvw-1rem)] lg:w-64 p-1.5 border border-border rounded-2xl bg-popover/80 shadow-card backdrop-blur-xl dark:border-neutral-900"
            >
                {/* User header */}
                <DropdownMenuLabel className="flex items-center gap-3 py-2 rounded-[10px] shadow-elevation-sm dark:bg-linear-to-l dark:from-neutral-900 dark:to-neutral-950 dark:border dark:border-neutral-800/80">
                    <Avatar className="">
                        <AvatarImage src={user?.avatar || undefined} />
                        <AvatarFallback
                            className="text-sm font-bold"
                            style={{
                                background: oklchLinearGradient(user?.avatar_fallback || "oklch(87.2% 0.007 219.6)"),
                                color: getTextColor(user?.avatar_fallback || "oklch(45% 0.017 213.2)")
                            }}
                        >
                            {user?.first_name?.charAt(0) || "U"}
                        </AvatarFallback>
                    </Avatar>

                    <div className="flex flex-col leading-none">
                        <span className="font-medium">{user?.first_name}</span>
                        <span className="text-xs text-muted-foreground">
                            {user?.email}
                        </span>
                    </div>
                </DropdownMenuLabel>

                <div className="px-3 hidden">
                    <DropdownMenuSeparator className="bg-border-subtle" />
                </div>

                <DropdownMenuGroup className="mt-1">
                    <DropdownMenuItem asChild disabled className="disabled:cursor-not-allowed">
                        <Link href="/settings">
                            <SettingsIcon strokeWidth={2} className="size-5.5" />

                            Settings
                        </Link>
                    </DropdownMenuItem>

                    <ThemeMenuItem />
                </DropdownMenuGroup>

                <div className="px-3">
                    <DropdownMenuSeparator className="bg-border-subtle" />
                </div>

                <SignoutButton />
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
