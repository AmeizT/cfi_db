"use client"

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
import { cn } from "@/lib/utils"
import { sidebarIconButton } from "./constants/sidebarIconButton"
import { oklchLinearGradient } from "../utils/get-oklch-gradient"
import { getTextColor } from "../utils/get-text-color"
import { HugeiconsIcon } from "@hugeicons/react"
import { Settings01Icon } from "@hugeicons/core-free-icons"
import { SignoutButton } from "./components/SignoutButton"
import { ThemeMenuItem } from "./components/ThemeMenuItem"

export function ProfileDropdown() {
    const { data: user } = useUser()

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="outline"
                    className={cn(sidebarIconButton())}
                >
                    <Avatar className="rounded-xl">
                        <AvatarImage src={user?.avatar || undefined} />
                        <AvatarFallback 
                            className="font-semibold rounded-lg" 
                            style={{
                                background: oklchLinearGradient(user?.avatar_fallback || "oklch(87.2% 0.007 219.6)"),
                                color: getTextColor(user?.avatar_fallback || "oklch(45% 0.017 213.2)")
                            }}
                        >
                            {user?.first_name?.charAt(0) || "U"}
                        </AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
                side="right"
                align="end"
                className="w-64 shadow-card bg-white/90 backdrop-blur-xl border-mist-300"
            >
                {/* User header */}
                <DropdownMenuLabel className="flex items-center gap-3 py-3">
                    <Avatar className="rounded-xl">
                        <AvatarImage src={user?.avatar || undefined} />
                        <AvatarFallback
                            className="font-semibold rounded-lg"
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

                <div className="px-3">
                    <DropdownMenuSeparator />
                </div>

                <DropdownMenuGroup>
                    <DropdownMenuItem>
                        <HugeiconsIcon 
                            icon={Settings01Icon} 
                            strokeWidth={2} 
                            className="size-6" 
                        />

                        Settings
                    </DropdownMenuItem>
                </DropdownMenuGroup>

                <ThemeMenuItem />

                <SignoutButton />
            </DropdownMenuContent>
        </DropdownMenu>
    )
}