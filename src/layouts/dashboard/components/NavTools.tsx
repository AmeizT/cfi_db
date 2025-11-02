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
import { usePathname } from "next/navigation"
import { MenuItem } from "../dashboardMenu"
import Link from "next/link"
import { getReadablePath } from "@/layouts/utils/get-readable-path"
import { cn } from "@/lib/utils"

interface NavGroupProps {
    items: MenuItem[],
    styles: string
}

export function NavUtilies({ items, styles }: NavGroupProps) {
    const pathname = usePathname()

    return (
        <SidebarGroup className="py-2 px-0">
            <SidebarGroupLabel className="hidden text-body-muted">
                Utilies
            </SidebarGroupLabel>

            {/* <FlashMessage
                id="#1234"
                title="What's New"
                message="The all-new database editor is here to help you create reports with ease and precision."
                variant="default"
            /> */}

            {/* <div className="p-3 mb-2 w-full flex flex-col gap-1 rounded-xl bg-gradient-to-b from-white to-white dark:from-neutral-800 dark:to-neutral-900 border border-dashed border-zinc-200/80 dark:border-neutral-700">
                <h5 className="text-sm font-semibold">
                    What&apos;s new?
                </h5>

                <p className="text-xs text-body-muted">
                    
                </p>
            </div> */}
            
            <SidebarMenu className="gap-0.5">
                {items.map((item) => {
                    const isActive = item.pathname?.includes(getReadablePath(pathname)) 

                    return (
                        <Collapsible key={item?.name} asChild>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild tooltip={item?.description} isActive={isActive} className={cn(styles)}>
                                    <Link href={item?.pathname || "#"}>
                                        {item.icon && item?.icon}
                                        <span>{item.name}</span>
                                    </Link>
                                </SidebarMenuButton>
                                {item.pages?.length ? (
                                    <React.Fragment>
                                        <CollapsibleTrigger asChild>
                                            <SidebarMenuAction className="data-[state=open]:rotate-90">
                                                <ChevronRight />
                                                <span className="sr-only">Toggle</span>
                                            </SidebarMenuAction>
                                        </CollapsibleTrigger>
                                        <CollapsibleContent>
                                            <SidebarMenuSub>
                                                {item.pages?.map((subItem) => (
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
                    )
                })}
            </SidebarMenu>
        </SidebarGroup>
    )
}
