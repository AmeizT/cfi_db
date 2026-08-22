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
import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { UrlObject } from "url"
import { NavGroup, NavItem } from "../navigation/types"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { NavIcon } from "./AppNavIcon";

type SidebarNavigationProps = NavItem[] | NavGroup[]

function isNavGroup(item: NavItem | NavGroup): item is NavGroup {
    return "items" in item
}

export function SidebarNavigation({ menu }: { menu: SidebarNavigationProps }) {
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
                                            "group/menu-button font-[450] transition-colors duration-75 flex items-center",
                                        )}
                                    >
                                        {item.icon && (
                                            <span className="relative size-6 shrink-0">
                                                <NavIcon
                                                    icon={item.icon}
                                                    className="absolute inset-0 transition-opacity duration-150 group-hover/menu-button:opacity-0"
                                                />


                                                <ChevronRight strokeWidth={2.5} className={cn(
                                                    "size-4.5! text-current",
                                                    "pointer-events-none absolute",
                                                    "opacity-0",
                                                    "origin-center transform-gpu",
                                                    "transition-all duration-[3000] ease-out",
                                                    "inset-0 m-auto",
                                                    "group-hover/menu-button:opacity-100",
                                                    "group-data-[state=open]/collapsible:rotate-90",
                                                    "transition-transform group-data-[state=open]:rotate-90"
                                                )}/>
                                            </span>
                                        )}

                                        <span>{item.label}</span>
                                        <span className="sr-only">Toggle</span>
                                    </SidebarMenuButton>
                                </CollapsibleTrigger>
                                
                                <CollapsibleContent className="
                                    overflow-hidden
                                    transition-all
                                    data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down
                                ">
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
                                                                {subItem.icon ? (
                                                                    <NavIcon icon={subItem.icon} />
                                                                ) : null}
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
                                    item.disabled && "opacity-50"
                                )}
                            >
                                {item.disabled ? (
                                    <span>
                                        <NavIcon icon={item.icon} />
                                        <span>{item.label}</span>
                                    </span>
                                ) : (
                                    <Link href={item.href as unknown as UrlObject}>
                                        <NavIcon icon={item.icon} />
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
                                <SidebarGroupLabel className="px-2 text-xs font-semibold text-user-theme-500">
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
