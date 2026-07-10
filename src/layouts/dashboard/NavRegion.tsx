"use client"

import {
    SidebarGroup,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { HugeiconsIcon } from '@hugeicons/react'
import { UrlObject } from "url"
import { NavItem } from "../navigation/types"

interface NavProps {
    menu: NavItem[]
}

export function NavRegion({ menu }: NavProps) {
    const pathname = usePathname()
    
    const mainMenu = menu.filter(
        item => item.label.toLowerCase() !== "reports"
    )

    return (
        <SidebarGroup className="p-0">
            <SidebarMenu>
                {menu.map((item) => {
                    const baseHref = String(item.href).split("?")[0]
                    const isActive = pathname.startsWith(baseHref)

                    return (
                        <SidebarMenuItem key={item.label} className="flex justify-center">
                            <SidebarMenuButton asChild tooltip={item.label} data-active={isActive} className="group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:size-9! group-data-[collapsible=icon]:rounded-lg group-data-[collapsible=icon]:p-0! [&>span]:group-data-[collapsible=icon]:hidden [&>span]:group-data-[collapsible=icon]:invisible font-[450] transition-colors duration-75">
                                <Link href={item.href as unknown as UrlObject}>
                                    <HugeiconsIcon icon={item.icon} strokeWidth={2} />
                                    <span>{item.label}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    )
                })}
            </SidebarMenu>
        </SidebarGroup>
    )
}
