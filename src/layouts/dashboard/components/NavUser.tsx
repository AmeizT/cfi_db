"use client"

import {
    IconActivity,
    IconMoonStars,
    IconPower,
    IconUserCircle,
} from "@tabler/icons-react"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
    SidebarMenu,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar"
import { ProfileButton } from "@/layouts/components/AvatarButton"
import { useUser } from "@/hooks/query/use-user"
import { ModeToggle } from "@/layouts/components/ModeToggle"
import { LogoutButton } from "@/layouts/components/LogoutButton"

export function NavUser() {
    const { isMobile } = useSidebar()
    const { data: user, isLoading } = useUser()

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <ProfileButton
                            displayName={user?.first_name || ""}
                            avatarColor={user?.avatar_fallback}
                            avatarSrc={user?.avatar || undefined}
                            isLoading={isLoading}
                        />
                    </DropdownMenuTrigger>

                    <DropdownMenuContent
                        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                        side={isMobile ? "bottom" : "right"}
                        align="end"
                        sideOffset={4}
                    >
                        {/* <DropdownMenuLabel className="p-0 font-normal">
                            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                <Avatar className="size-8">
                                    <AvatarImage 
                                        src={user?.avatar || undefined} alt={user?.first_name} 
                                    />
                                    <AvatarFallback className="rounded-full text-white" style={{ backgroundColor: user?.avatar_fallback }}>
                                        {user?.first_name?.charAt(0)}{user?.last_name?.charAt(0)}
                                    </AvatarFallback>
                                </Avatar>

                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-medium">
                                        {user?.first_name}
                                    </span>

                                    <span className="text-muted-foreground truncate text-xs">
                                        {user?.email}
                                    </span>
                                </div>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator /> */}
                        <DropdownMenuGroup>
                            <DropdownMenuItem className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <IconMoonStars size="4.5" />
                                    Dark Mode
                                </div>

                                <ModeToggle />
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <DropdownMenuItem>
                                <IconUserCircle />
                                Account
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <IconActivity />
                                Activity
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>

                            <IconPower />
                            <LogoutButton userId={String(user?.id)} />
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}



