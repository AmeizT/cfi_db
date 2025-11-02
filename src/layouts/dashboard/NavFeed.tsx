"use client"

import {
    SidebarGroup,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import Link from "next/link"
import { MenuItem } from "./dashboardMenu"
import { usePathname } from "next/navigation"
import { HugeiconsIcon } from '@hugeicons/react'

interface NavDashboardProps {
    menu: MenuItem[]
}

export function NavFeed({ menu }: NavDashboardProps) {
    const pathname = usePathname()

    return (
        <SidebarGroup className="p-0">
            <SidebarMenu>
                {menu.map((item, index) => {
                    // const itemSegment = item?.pathname?.split("/")[1] ?? ""
                    // const currentSegment = pathname?.split("/")[1] ?? ""

                    const isActive = item?.pathname === "/" ? pathname === "/" : pathname !== "/" && pathname?.includes(item?.pathname?.split("/")[1] ?? "")

                    return (
                        <SidebarMenuItem key={item.name} className="flex justify-center">
                            <SidebarMenuButton asChild tooltip={item.name} data-active={isActive} className={`group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:size-9! group-data-[collapsible=icon]:rounded-lg group-data-[collapsible=icon]:p-0! [&>span]:group-data-[collapsible=icon]:hidden [&>span]:group-data-[collapsible=icon]:invisible text-muted-foreground hover:bg-gray-50 transition-colors duration-75 ${index === 1 ? "!bg-white !border border-gray-200 text-red-500" : ""}`}>
                                <Link href={item.pathname || "/"}>
                                    <HugeiconsIcon icon={item.icon} strokeWidth={2.2} />
                                    <span>{item.name}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    )
                })}
            </SidebarMenu>
        </SidebarGroup>
    )
}
