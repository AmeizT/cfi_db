"use client"

import {
    SidebarGroup,
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
import { NavItem } from "../navigation/types"
import React from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronRight } from "lucide-react";

export function NavReports({ menu }: { menu: NavItem[] }) {
    const pathname = usePathname()

    return (
        <SidebarGroup className="p-0">
            <SidebarMenu>
                {menu.map((item) => {
                    const baseHref = String(item.href).split("?")[0]
                    const isActive = pathname.startsWith(baseHref)
                    const isExpandable = item?.children ?? false

                    return (
                        <React.Fragment key={item.label}>
                            {isExpandable ? (
                                <React.Fragment>
                                    <Collapsible
                                            asChild
                                            defaultOpen={isActive}
                                            className="group/collapsible"
                                        >
                                            <SidebarMenuItem>
                                            <CollapsibleTrigger asChild>
                                                <SidebarMenuButton tooltip={item.label}>
                                                {item.icon && <HugeiconsIcon icon={item.icon} strokeWidth={2} />}
                                                <span>{item.label}</span>
                                                <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                                </SidebarMenuButton>
                                            </CollapsibleTrigger>
                                            <CollapsibleContent>
                                                <SidebarMenuSub>
                                                {item?.children?.map((subItem) => (
                                                    <SidebarMenuSubItem key={subItem.label}>
                                                    <SidebarMenuSubButton asChild>
                                                        <a href={subItem.href}>
                                                        <span>{subItem.label}</span>
                                                        </a>
                                                    </SidebarMenuSubButton>
                                                    </SidebarMenuSubItem>
                                                ))}
                                                </SidebarMenuSub>
                                            </CollapsibleContent>
                                            </SidebarMenuItem>
                                        </Collapsible>
                                </React.Fragment>
                            ) : (
                                <SidebarMenuItem key={item.label} className="flex justify-center">
                                    <SidebarMenuButton asChild tooltip={item.label} data-active={isActive} className="group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:size-9! group-data-[collapsible=icon]:rounded-lg group-data-[collapsible=icon]:p-0! [&>span]:group-data-[collapsible=icon]:hidden [&>span]:group-data-[collapsible=icon]:invisible font-[450] transition-colors duration-75">
                                        <Link href={item.href as unknown as UrlObject}>
                                            <HugeiconsIcon icon={item.icon} strokeWidth={2} />
                                            <span>{item.label}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            )}
                        </React.Fragment>
                        
                    )
                })}
            </SidebarMenu>
        </SidebarGroup>
    )
}
