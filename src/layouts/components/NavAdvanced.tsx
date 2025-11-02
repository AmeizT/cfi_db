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
import { MenuItem } from "@/layouts/types/menu-item"

export function NavAdvanced({ items }: { items: MenuItem[] }) {
    return (
        <SidebarGroup>
            <SidebarGroupLabel className="text-body-muted">
                Analytics
            </SidebarGroupLabel>
            
            <SidebarMenu>
                {items.map((item) => (
                    <Collapsible key={item?.name} asChild>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild tooltip={item?.description}>
                                <a href={item?.pathname}>
                                    <item.icon className="size-4 text-body-muted" />
                                    <span>{item.name}</span>
                                </a>
                            </SidebarMenuButton>
                            {item.children?.length ? (
                                <React.Fragment>
                                    <CollapsibleTrigger asChild>
                                        <SidebarMenuAction className="data-[state=open]:rotate-90">
                                            <ChevronRight />
                                            <span className="sr-only">Toggle</span>
                                        </SidebarMenuAction>
                                    </CollapsibleTrigger>
                                    <CollapsibleContent>
                                        <SidebarMenuSub>
                                            {item.children?.map((subItem) => (
                                                <SidebarMenuSubItem key={subItem.name}>
                                                    <SidebarMenuSubButton asChild>
                                                        <a href={subItem.pathname}>
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
