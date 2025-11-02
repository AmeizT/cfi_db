"use client"

import { ChevronRight } from "lucide-react"

import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuAction,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import React from "react"
import Link from "next/link"

interface MenuItem {
    id: string
    name: string
    description: string
    path?: string
    type?: "link" | "button"
    icons?: {
        active: React.JSX.Element
        inactive?: React.JSX.Element
    }
    subItems?: MenuItem[]
    actionButton?: {
        path: string
    }
}

export function NavCore({items}: {items: MenuItem[]} ) {
    return (
        <SidebarGroup>
            <SidebarGroupLabel className="text-body-muted">Platform</SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) => (
                    <Collapsible key={item?.name} asChild>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild tooltip={item?.description}>
                                <Link href={item?.path as unknown as string || "/"}>
                                    {item?.icons?.active}
                                    <span>{item.name}</span>
                                </Link>
                            </SidebarMenuButton>
                            {item.subItems?.length ? (
                                <React.Fragment>
                                    <CollapsibleTrigger asChild>
                                        <SidebarMenuAction className="data-[state=open]:rotate-90 text-muted">
                                            <ChevronRight />
                                            <span className="sr-only">Toggle</span>
                                        </SidebarMenuAction>
                                    </CollapsibleTrigger>
                                    <CollapsibleContent>
                                        <SidebarMenuSub>
                                            {item.subItems?.map((subItem) => (
                                                <SidebarMenuSubItem key={subItem.name}>
                                                    <SidebarMenuSubButton asChild>
                                                        <a href={subItem.path}>
                                                            <span>{subItem.name}</span>
                                                        </a>
                                                    </SidebarMenuSubButton>
                                                </SidebarMenuSubItem>
                                            ))}
                                        </SidebarMenuSub>
                                    </CollapsibleContent>
                                </React.Fragment>
                            ) : null}
                        </SidebarMenuItem>
                    </Collapsible>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    )
}
