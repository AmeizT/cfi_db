"use client"

import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { HugeiconsIcon } from '@hugeicons/react'
import { UrlObject } from "url"
import { NavGroup, NavItem } from "../navigation/types"
import React from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils"

type NavReportsMenu = NavItem[] | NavGroup[]

function isNavGroup(item: NavItem | NavGroup): item is NavGroup {
    return "items" in item
}

export function NavReports({ menu }: { menu: NavReportsMenu }) {
    const pathname = usePathname()

    function isHrefActive(href: string | undefined, exact?: boolean) {
        const baseHref = href?.split("?")[0] ?? ""

        if (!baseHref) {
            return false
        }

        return exact
            ? pathname === baseHref
            : pathname === baseHref || pathname.startsWith(`${baseHref}/`)
    }

    function renderItems(items: NavItem[]) {
        return items.filter((item) => !item.hidden).map((item) => {
            const children = item.children?.filter((child) => !child.hidden) ?? []
            const isChildActive = children.some((child) =>
                isHrefActive(child.href, child.exact)
            )
            const isActive = isHrefActive(item.href, item.exact) || isChildActive
            const isExpandable = children.length > 0

            return (
                <React.Fragment key={item.label}>
                    {isExpandable ? (
                        <Collapsible
                            asChild
                            defaultOpen={isActive}
                            className="group/collapsible"
                        >
                            <SidebarMenuItem>
                                <CollapsibleTrigger asChild>
                                    <SidebarMenuButton
                                        tooltip={item.label}
                                        isActive={isActive}
                                        className={cn(
                                            "group/collapsible font-[450] transition-colors duration-75",
                                            isActive && "bg-theme-50 text-theme-700 hover:bg-theme-100 dark:bg-primary/10 dark:text-primary"
                                        )}
                                    >
                                        {item.icon && <HugeiconsIcon icon={item.icon} strokeWidth={2} />}
                                        <span>{item.label}</span>
                                        <ChevronRight className="group-hover/collapsible:visible invisible size-4! text-muted-foreground! ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                    </SidebarMenuButton>
                                </CollapsibleTrigger>
                                
                                <CollapsibleContent>
                                    <SidebarMenuSub>
                                        {children.map((subItem) => {
                                            const isSubActive = isHrefActive(
                                                subItem.href,
                                                subItem.exact
                                            )

                                            return (
                                                <SidebarMenuSubItem key={subItem.label}>
                                                    <SidebarMenuSubButton
                                                        asChild={!subItem.disabled && Boolean(subItem.href)}
                                                        isActive={isSubActive}
                                                        aria-disabled={subItem.disabled}
                                                        className={cn(
                                                            subItem.disabled && "opacity-50"
                                                        )}
                                                    >
                                                        {subItem.disabled || !subItem.href ? (
                                                            <span>{subItem.label}</span>
                                                        ) : (
                                                            <Link href={subItem.href}>
                                                                <span>{subItem.label}</span>
                                                            </Link>
                                                        )}
                                                    </SidebarMenuSubButton>
                                                </SidebarMenuSubItem>
                                            )
                                        })}
                                    </SidebarMenuSub>
                                </CollapsibleContent>
                            </SidebarMenuItem>
                        </Collapsible>
                    ) : (
                        <SidebarMenuItem key={item.label} className="flex justify-center">
                            <SidebarMenuButton
                                asChild={!item.disabled}
                                tooltip={item.label}
                                isActive={isActive}
                                aria-disabled={item.disabled}
                                className={cn(
                                    "group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:size-9! group-data-[collapsible=icon]:rounded-lg group-data-[collapsible=icon]:p-0! [&>span]:group-data-[collapsible=icon]:hidden [&>span]:group-data-[collapsible=icon]:invisible font-[450] transition-colors duration-75",
                                    isActive && "bg-theme-50 text-theme-700 hover:bg-theme-100 dark:bg-primary/10 dark:text-primary",
                                    item.disabled && "opacity-50"
                                )}
                            >
                                {item.disabled ? (
                                    <span>
                                        <HugeiconsIcon icon={item.icon} strokeWidth={1.75} />
                                        <span>{item.label}</span>
                                    </span>
                                ) : (
                                    <Link href={item.href as unknown as UrlObject}>
                                        <HugeiconsIcon  icon={item.icon} strokeWidth={1.75} />
                                        <span>{item.label}</span>
                                    </Link>
                                )}
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    )}
                </React.Fragment>
            )
        })
    }

    const grouped = menu.length > 0 && isNavGroup(menu[0])

    if (grouped) {
        return (
            <div className="flex w-full flex-col gap-2">
                {(menu as NavGroup[]).map((group) => (
                    <div key={group.id} className="flex flex-col items-center">
                        <SidebarGroup  className="p-0">
                            {group.label ? (
                                <SidebarGroupLabel className="px-2 text-xs font-semibold text-muted-foreground">
                                    {group.label}
                                </SidebarGroupLabel>
                            ) : null}
                            <SidebarMenu>
                                {renderItems(group.items)}
                            </SidebarMenu>
                        </SidebarGroup>
                    </div>
                ))}
            </div>
        )
    }

    return (
        <SidebarGroup className="p-0">
            <SidebarMenu>
                {renderItems(menu as NavItem[])}
            </SidebarMenu>
        </SidebarGroup>
    )
}
