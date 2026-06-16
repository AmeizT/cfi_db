"use client"

import React from "react"
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
import { UrlObject } from "url"
import { Add01Icon } from "@hugeicons/core-free-icons"

interface NavDashboardProps {
    menu: MenuItem[]
}

export function NavFeed({ menu }: NavDashboardProps) {
    const pathname = usePathname()
    // const currentDate = new Date()
    // const currentMonth = String(currentDate.getMonth() + 1).padStart(2, '0')
    // const currentYear = currentDate.getFullYear()

    return (
        <SidebarGroup className="p-0">
            <SidebarMenu>
                <SidebarMenuItem className="flex justify-center">
                    <SidebarMenuButton asChild tooltip={"Manage"} className={`group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:size-9! group-data-[collapsible=icon]:rounded-lg group-data-[collapsible=icon]:p-0! [&>span]:group-data-[collapsible=icon]:hidden [&>span]:group-data-[collapsible=icon]:invisible text-muted-foreground hover:bg-gray-50 transition-colors duration-75`}>
                        <Link href={`/manage?mode=reports&form=attendance`}>
                            <HugeiconsIcon icon={Add01Icon} strokeWidth={2.2} />
                            <span>Create</span>
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>

                <React.Fragment>
                    {menu.map((item, index) => {
                        const isActive = item?.pathname === "/" ? pathname === "/" : pathname !== "/" && pathname?.includes(item?.pathname?.split("/")[1] ?? "")

                        return (
                            <SidebarMenuItem key={item.name} className="flex justify-center">
                                <SidebarMenuButton asChild tooltip={item.name} data-active={isActive} className={`group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:size-9! group-data-[collapsible=icon]:rounded-lg group-data-[collapsible=icon]:p-0! [&>span]:group-data-[collapsible=icon]:hidden [&>span]:group-data-[collapsible=icon]:invisible text-muted-foreground hover:bg-gray-50 transition-colors duration-75 ${index === 1 ? "bg-white! border! border-gray-200 text-red-500" : ""}`}>
                                    <Link href={item.pathname as unknown as UrlObject || "/"}>
                                        <HugeiconsIcon icon={item.icon} strokeWidth={2.2} />
                                        <span>{item.name}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        )
                    })}
                </React.Fragment>
            </SidebarMenu>
        </SidebarGroup>
    )
}
