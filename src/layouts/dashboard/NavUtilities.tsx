"use client"

import {
    SidebarGroup,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import Link from "next/link"
import { MenuItem } from "./dashboardMenu"

interface NavProps {
    menu: MenuItem[]
}

export function NavUtilities({ menu }: NavProps) {
    return (
        <SidebarGroup className="p-0 px-2">
            <SidebarMenu>
                {menu.map((item) => (
                    <SidebarMenuItem key={item.name} className="flex justify-center">
                        <SidebarMenuButton asChild tooltip={item.name} className="group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:size-11! group-data-[collapsible=icon]:rounded-lg group-data-[collapsible=icon]:p-0! [&>span]:group-data-[collapsible=icon]:hidden [&>span]:group-data-[collapsible=icon]:invisible text-muted-foreground">
                            <Link href={item.pathname || "/"}>
                                {item.icon && item?.icon}
                                <span>{item.name}</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    )
}
