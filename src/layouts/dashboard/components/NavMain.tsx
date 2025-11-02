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
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { MenuItem } from "../dashboardMenu"
import { getReadablePath } from "@/layouts/utils/get-readable-path"

interface NavGroupProps {
    items: MenuItem[], 
    styles: string
}

export function NavCore({ items, styles }: NavGroupProps) {
    const pathname = usePathname()

    return (
        <SidebarGroup className="py-0 px-0">
            <SidebarGroupLabel className="hidden text-body-muted">
                Platform
            </SidebarGroupLabel>

            <SidebarMenu>
                {items.map((item) => {
                    const isActive = item.pathname?.includes(getReadablePath(pathname))

                    return (
                        <React.Fragment key={item.name}>
                            {item?.pages ? (
                                <Collapsible>
                                    <SidebarMenuItem className="peer [&>svg]:data-[state=open]:rotate-90">
                                        <SidebarMenuButton asChild isActive={isActive} className={styles}>
                                            <CollapsibleTrigger className="group/collapse w-full justify-between">
                                                <div className="flex items-center gap-x-2 [&>svg]:size-4.5">
                                                    {item.icon && item?.icon}
                                                    <span>{item.name}</span>
                                                </div>

                                                <ChevronRight
                                                    strokeWidth={2.5}
                                                    className="hidden size-4 opacity-0 invisible group-hover/collapse:opacity-100 group-hover/collapse:visible group-has-data-[state=open]/menu-item:rotate-90 transition-all duration-200 text-body-muted"
                                                />
                                                <span className="sr-only">Toggle</span>
                                            </CollapsibleTrigger>
                                        </SidebarMenuButton>

                                        {item.pages?.length ? (
                                            <CollapsibleContent>
                                                <SidebarMenuSub>
                                                    {item.pages?.map((subItem) => (
                                                        <SidebarMenuSubItem key={subItem.name}>
                                                            <SidebarMenuSubButton asChild>
                                                                <Link href={subItem.pathname || "#"}>
                                                                    <span>{subItem.name}</span>
                                                                </Link>
                                                            </SidebarMenuSubButton>
                                                        </SidebarMenuSubItem>
                                                    ))}
                                                </SidebarMenuSub>
                                            </CollapsibleContent>
                                        ) : null}

                                    </SidebarMenuItem>
                                </Collapsible>
                            ) : (
                                <SidebarMenuItem>
                                    <SidebarMenuButton asChild className={styles}>
                                        <Link href={item.pathname || "#"} className="group/link">
                                            {item.icon && item?.icon}
                                            {/* <item.icon strokeWidth={2.25} className="size-4 text-zinc-500 group-hover/link:text-charcoal-600 dark:group-hover/link:text-white" /> */}
                                            <span>{item.name}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            )
                        }
                    </React.Fragment>
                )})}
            </SidebarMenu>
        </SidebarGroup>
    )
}
