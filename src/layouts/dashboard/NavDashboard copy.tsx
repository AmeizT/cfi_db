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
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronRight } from "lucide-react"

interface NavDashboardProps {
    menu: NavItem[]
}

export function NavDashboard({ menu }: NavDashboardProps) {
    const pathname = usePathname()

    const reportsMenu = menu.find(
        item => item.label.toLowerCase() === "reports"
    )

    const mainMenu = menu.filter(
        item => item.label.toLowerCase() !== "reports"
    )

    return (
        <SidebarGroup className="p-0">
            <SidebarMenu>
                {mainMenu.map((item) => {
                    const itemSegment = item?.href?.split("/")[1] ?? ""
                    const currentSegment = pathname?.split("/")[1] ?? ""

                    const isActive = itemSegment !== "" && currentSegment === itemSegment

                    return (
                        <SidebarMenuItem key={item.label} className="flex justify-center">
                            <SidebarMenuButton asChild tooltip={item.label} data-active={isActive} className="group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:size-9! group-data-[collapsible=icon]:rounded-lg group-data-[collapsible=icon]:p-0! [&>span]:group-data-[collapsible=icon]:hidden [&>span]:group-data-[collapsible=icon]:invisible font-[450] hover:bg-gray-50 transition-colors duration-75">
                                <Link href={item.href as unknown as UrlObject}>
                                    <HugeiconsIcon icon={item.icon} strokeWidth={2} />
                                    <span>{item.label}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    )
                })}

                {reportsMenu && (
                    <Collapsible className="group/collapsible">
                        <SidebarMenuItem>
                            <CollapsibleTrigger asChild>
                                <SidebarMenuButton tooltip={reportsMenu.label}>
                                    <HugeiconsIcon icon={reportsMenu.icon} strokeWidth={2} />
                                    <span>{reportsMenu.label}</span>
                                    <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90"/>
                                </SidebarMenuButton>
                            </CollapsibleTrigger>

                            <CollapsibleContent>
                                <SidebarMenuSub>
                                    {reportsMenu.children?.map(child => {
                                        const isActive = pathname === child.href

                                        return (
                                            <SidebarMenuSubItem key={child.label}>
                                                <SidebarMenuSubButton
                                                    asChild
                                                    data-active={isActive}
                                                >
                                                    <Link href={child.href || "#"}>
                                                        <span>{child.label}</span>
                                                    </Link>
                                                </SidebarMenuSubButton>
                                            </SidebarMenuSubItem>
                                        )
                                    })}
                                </SidebarMenuSub>
                            </CollapsibleContent>
                        </SidebarMenuItem>
                    </Collapsible>
                )}
            </SidebarMenu>
        </SidebarGroup>
    )
}
