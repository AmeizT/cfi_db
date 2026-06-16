"use client"

import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { HugeiconsIcon } from '@hugeicons/react'
import { UrlObject } from "url"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronRight } from "lucide-react"
import { NavItem } from "../navigation/types"

interface NavDashboardProps {
    navigation: NavItem[]
}

export function NavForms({ navigation }: NavDashboardProps) {
    const pathname = usePathname()

    return (
        <Collapsible
            key={"forms"}
            title={"Forms"}
            defaultOpen
            className="group/collapsible w-full"
        >
            <SidebarGroup className="p-0">
                <SidebarGroupLabel
                asChild
                className="group/teamspaces flex items-center gap-6 justify-between hover:bg-gray-100"
                >
                <CollapsibleTrigger>
                    Forms
                    <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                </CollapsibleTrigger>
                </SidebarGroupLabel>
                <CollapsibleContent>
                <SidebarGroupContent>
                    <SidebarMenu>
                        {navigation.map((item) => {
                            const itemSegment = item?.href?.split("/")[1] ?? ""
                            const currentSegment = pathname?.split("/")[1] ?? ""

                            const isActive = itemSegment !== "" && currentSegment === itemSegment

                            return (
                                <SidebarMenuItem key={item.label} className="flex justify-center">
                                    <SidebarMenuButton asChild tooltip={item.label} data-active={isActive} className="group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:size-9! group-data-[collapsible=icon]:rounded-lg group-data-[collapsible=icon]:p-0! [&>span]:group-data-[collapsible=icon]:hidden [&>span]:group-data-[collapsible=icon]:invisible font-[450] rounded-lg hover:bg-gray-50 transition-colors duration-75">
                                        <Link href={item.href as unknown as UrlObject}>
                                            <HugeiconsIcon icon={item.icon} strokeWidth={2} />
                                            <span>{item.label}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            )
                        })}
                    </SidebarMenu>
                </SidebarGroupContent>
                </CollapsibleContent>
            </SidebarGroup>
            </Collapsible>
        
    )
}



<SidebarGroup className="p-0">
    <SidebarGroupLabel className="group/teamspaces flex items-center gap-6 justify-between hover:bg-gray-100">
        Forms
    </SidebarGroupLabel>

    <SidebarMenu>
        
    </SidebarMenu>
</SidebarGroup>
