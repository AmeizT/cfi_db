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
// import { Button } from "@/components/ui/button"
import { MenuItem } from "@/layouts/types/menu-item"

export function NavCore({items}: {items: MenuItem[]} ) {
    return (
        <SidebarGroup>
            <SidebarGroupLabel className="text-zinc-400 dark:text-body-muted">
                Platform
            </SidebarGroupLabel>
            <SidebarMenu>
                <SidebarMenuItem className="items-center gap-2">
                    <SidebarMenuButton
                    tooltip="Quick Create"
                    className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear">
                        <span>Quick Create</span>
                    </SidebarMenuButton>

                    {/* <Button
                    size="icon"
                    className="size-8 group-data-[collapsible=icon]:opacity-0"
                    variant="outline">
                        <Plus />
                        <span className="sr-only">Create</span>
                    </Button> */}
                </SidebarMenuItem>

                {items.map((item) => (
                    <React.Fragment key={item.name}>
                        {item?.children ? (
                            <Collapsible key={item?.name} asChild>
                                <SidebarMenuItem className="peer [&>svg]:data-[state=open]:rotate-90">
                                    <SidebarMenuButton asChild>
                                        <CollapsibleTrigger className="group/collapse w-full justify-between hover:bg-zinc-200">
                                            <div className="flex items-center gap-x-2 [&>svg]:size-4">
                                                <item.icon strokeWidth={2} className="text-zinc-600 dark:text-body-muted group-hover/collapse:text-charcoal-600 dark:group-hover/collapse:text-white" />
                                                <span>{item.name}</span>
                                            </div>

                                            <ChevronRight 
                                                strokeWidth={2.5}
                                                className="size-4 opacity-0 invisible group-hover/collapse:opacity-100 group-hover/collapse:visible group-has-data-[state=open]/menu-item:rotate-90 transition-all duration-200 text-body-muted" 
                                            />
                                            <span className="sr-only">Toggle</span>
                                        </CollapsibleTrigger>
                                    </SidebarMenuButton>

                                    {item.children?.length ? (
                                        <CollapsibleContent>
                                            <SidebarMenuSub>
                                                {item.children?.map((subItem) => (
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
                                <SidebarMenuButton asChild className="rounded">
                                    <Link href={item.pathname || "#"} className="group/link hover:bg-neutral-950">
                                        <item.icon strokeWidth={2.25} className="size-4 text-zinc-500 group-hover/link:text-charcoal-600 dark:group-hover/link:text-white" />
                                        <span>{item.name}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        )}
                    </React.Fragment>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    )
}
