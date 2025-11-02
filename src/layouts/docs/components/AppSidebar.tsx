import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import React from "react"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { docsMenu } from "../constants/docsMenu"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"


export function DocsAppSidebar() {
    return (
        <Sidebar data-custom-sidebar="true" className="px-6 pt-18 [&>*[data-sidebar=sidebar]]:bg-inherit dark:[&>*[data-sidebar=sidebar]]:bg-inherit [&_div.group-data-[variant=floating]]:border-0 dark:[&>*[data-sidebar=sidebar]]:border-r-0">
            <SidebarHeader />
                
            <SidebarContent>
                <SidebarMenu>
                    {docsMenu.main.map((menu, index) => (
                        <React.Fragment key={index}>
                            {menu.subItems ? (
                                <Collapsible className="group/collapsible">
                                    <SidebarMenuItem>
                                        <CollapsibleTrigger asChild>
                                            <SidebarMenuButton className="group justify-between">
                                                {menu.name}

                                                <span className="block">
                                                    <ChevronRight className="w-4 h-4 text-body-muted transition-transform group-data-[state=open]:rotate-90" />
                                                    <span className="sr-only">Toggle</span>
                                                </span>
                                            </SidebarMenuButton>
                                        </CollapsibleTrigger>
                                        <CollapsibleContent>
                                            <SidebarMenuSub>
                                                {menu.subItems.map((subItem, index) => (
                                                    <SidebarMenuSubItem key={index} className="group">
                                                        <SidebarMenuButton asChild tooltip={subItem?.description}>
                                                            <Link
                                                                href={{
                                                                    pathname: subItem.path,
                                                                }}
                                                                prefetch={true}
                                                                className="w-full block cursor-default dark:hover:text-white group-data-[active=true]:text-primary">
                                                                {subItem.name}
                                                            </Link>
                                                        </SidebarMenuButton>
                                                    </SidebarMenuSubItem>
                                                ))}
                                            </SidebarMenuSub>
                                        </CollapsibleContent>
                                    </SidebarMenuItem>
                                </Collapsible>
                            ) : (
                                <SidebarMenuItem>
                                    <SidebarMenuButton asChild tooltip={menu?.description}>
                                        <Link
                                        href={{
                                            pathname: menu.path,
                                        }}
                                        prefetch={true}
                                        className="cursor-default">
                                            {menu.name}
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            )}
                        </React.Fragment>
                    ))}
                </SidebarMenu>
                <SidebarGroup />
            </SidebarContent>
            <SidebarFooter />
        </Sidebar>
    )
}