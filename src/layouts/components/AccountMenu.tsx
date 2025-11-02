"use client"

import React from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { AlarmClockCheck, Bug, LogOut, Settings, type LucideIcon } from "lucide-react"
import { User } from "@/features/auth/types/user"
import { signOut } from "@/features/auth/actions/sign-out"


interface AccountMenuProps {
    user: User
}

interface AccountMenuItem {
    name: string
    icon: LucideIcon
    onClick?: () => void
}

export function AccountMenu({ user }: AccountMenuProps){   
    const AccountMenuItems: AccountMenuItem[] = [
        {
            name: "Settings",
            icon: Settings,
        },
        {
            name: "Tasks & Activity",
            icon: AlarmClockCheck,
        },
        {
            name: "Report a problem",
            icon: Bug,
        },
        {
            name: "Log out",
            icon: LogOut,
            onClick: async () => {
                try {
                    await signOut(String(user?.id))
                } catch (error) {
                    console.error("Sign out failed:", error)
                }
            }
        }
    ]
    
    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <Avatar className="size-8">
                    <AvatarImage src={user?.avatar as unknown as string} alt={user?.first_name} />
                    <AvatarFallback className="text-white text-sm font-semibold" style={{ background: user?.avatar_fallback }}>
                        {user?.first_name.charAt(0)}{user?.last_name.charAt(0)}
                    </AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[15rem] flex flex-col items-center rounded-xl border border-zinc-100 dark:border-t-0 dark:border-charcoal-600/75 bg-white dark:bg-charcoal-800/75 backdrop-blur-2xl shadow-inset-light">
                {AccountMenuItems.map((item, index) => (
                    <React.Fragment key={item.name}>
                        {/* Add separator before the second-to-last item */}
                        {index === AccountMenuItems.length - 2 && AccountMenuItems.length > 2 && (
                            <DropdownMenuSeparator key={`separator-before-${index}`} className="w-[calc(15rem-1rem)] bg-[#ffffff10]" />
                        )}

                        {/* Add separator before the last item */}
                        {index === AccountMenuItems.length - 1 && AccountMenuItems.length > 1 && (
                            <DropdownMenuSeparator key={`separator-after-${index}`} className="w-[calc(15rem-1rem)] bg-[#ffffff10]" />
                        )}

                        <DropdownMenuItem key={item.name} className="py-2 px-3 rounded-lg hover:bg-[#ffffff12]!">
                            <button onClick={item.onClick} className="flex items-center gap-x-2 dark:text-white text-sm font-[475]">
                                <item.icon strokeWidth={2.25} className="size-4" /> {item.name}
                            </button>
                        </DropdownMenuItem>
                    </React.Fragment>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}