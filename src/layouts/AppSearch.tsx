"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useRouter } from "next/navigation"
import { cn } from "@/utils/cn"
import { MinimalisticMagnifierIcon } from '@solar-icons/react/line-duotone/minimalistic-magnifier'
import { NavIcon } from "./dashboard/AppNavIcon"
import { workspaceNavigation, type NavigationItem } from "@/config/workspace-navigation"
import { Separator } from "@/components/ui/separator";

function flattenSearchItems(items: NavigationItem[]): NavigationItem[] {
    return items.flatMap((item) => [
        item,
        ...flattenSearchItems(item.children ?? []),
    ])
}

const searchGroups = workspaceNavigation
    .map((section, index) => ({
        area: section.title ?? (index === 0 ? "Home" : "Library"),
        items: flattenSearchItems(section.items).filter(
        (item) => !item.disabled && !item.permission,
        ),
    }))
    .filter((group) => group.items.length > 0)

export function AppSearch({
    variant = "topbar",
}: {
    variant?: "topbar" | "sidebar"
} = {}) {
    const router = useRouter();
    const [searchOpen, setSearchOpen] = React.useState(false);
    const isSidebar = variant === "sidebar"

    function navigate(href: string) {
        setSearchOpen(false);
        router.push(href);
    }
    return (
        <Popover open={searchOpen} onOpenChange={setSearchOpen}>
            <PopoverTrigger asChild>
                <Button
                    type="button"
                    variant="ghost"
                    aria-label="Search CFI Workspace"
                    className={cn(
                        "size-10 shrink-0 justify-center",
                        isSidebar ? [
                            "h-9 w-full justify-start rounded-full px-3",
                            "bg-sidebar-accent text-(--shell-sidebar-muted-foreground)",
                            "hover:bg-sidebar-accent-active hover:text-sidebar-foreground",
                        ] : [
                            "text-(--shell-chrome-foreground)",
                            "hover:bg-(--shell-chrome-hover)",
                            "hover:text-(--shell-chrome-foreground)",
                            "md:flex md:h-8 md:w-full md:max-w-xs md:justify-start",
                            "md:rounded-full md:bg-(--shell-sidebar-hover) md:px-3",
                            "md:text-(--shell-chrome-muted-foreground)",
                        ]
                    )}
                >
                    <MinimalisticMagnifierIcon className="size-5 md:size-4.5" />
                    <span className={cn("font-normal", !isSidebar && "hidden md:inline")}>
                        Find anything...
                    </span>
                </Button>
            </PopoverTrigger>

            <PopoverContent
                side="bottom"
                align="center"
                alignOffset={-20}
                sideOffset={-36}
                collisionPadding={6}
                className="w-[min(42rem,calc(100vw-1rem))] overflow-hidden p-0 rounded-3xl border-border bg-transparent"
            >
                <Command className="
                    bg-background/80 
                    backdrop-blur-2xl 
                    backdrop-saturate-150
                    border 
                    border-white/10 shadow-2xl"
                >
                    <div className="">
                        <CommandInput
                        placeholder="Search navigation..."
                        className="h-12"
                    />

                    <Separator className="data-[orientation=horizontal]:w-[calc(100%-2rem)] mx-auto border-b border-border" />
                    </div>

                    <CommandList className="max-h-[min(28rem,70dvh)] p-2">
                        <CommandEmpty>No destination found.</CommandEmpty>

                        {searchGroups.map((group) => (
                        <CommandGroup
                            key={group.area}
                            heading={
                            group.area
                            }
                        >
                            {group.items.map((item) => {
                            const Icon = item.icon;

                            return (
                                <CommandItem
                                key={`${group.area}-${item.key}`}
                                value={`${group.area} ${item.label}`}
                                onSelect={() => navigate(item.href)}
                                className="cursor-pointer"
                                >
                                <NavIcon icon={Icon} aria-hidden="true" />
                                {item.label}
                                </CommandItem>
                            );
                            })}
                        </CommandGroup>
                        ))}
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
