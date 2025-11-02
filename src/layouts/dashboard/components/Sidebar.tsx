"use client"

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import { NavCore } from "./NavMain"
import { NavUser } from "./NavUser"
import { NavUtilies } from "./NavTools"
import { dashboardMenu } from "../dashboardMenu"
import { WorkspaceSwitcher } from "./WorkspaceSwitcher"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const menu = dashboardMenu

    const sidebarButtonStyles = "rounded-md hover:bg-zinc-200/60 data-[active=true]:border-[1.25px] data-[active=true]:border-zinc-200/70 dark:data-[active=true]:border-neutral-700 data-[active=true]:shadow-none data-[active=true]:[&>svg]:text-neutral-700 dark:data-[active=true]:[&>svg]:text-white data-[active=true]:font-normal data-[active=true]:from-white data-[active=true]:to-zinc-50 dark:data-[active=true]:from-neutral-800 dark:data-[active=true]:to-neutral-900 bg-gradient-to-b hover:bg-zinc-100 dark:hover:bg-neutral-800 transition-colors duration-200"

    return (
        <Sidebar collapsible="icon" {...props} variant="inset" className="px-3">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <WorkspaceSwitcher />
                        
                        <SidebarMenuButton size="lg" asChild>
                            <a href="#">
                                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">

                                </div>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-semibold">CFI Database</span>
                                    <span className="truncate text-xs">Orwetoveni, Namibia</span>
                                </div>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent className="px-0 gap-2 h-full flex flex-col justify-between scrollbar-thin scrollbar-thumb-zinc-200 scrollbar-track-zinc-100 dark:scrollbar-thumb-charcoal-700 dark:scrollbar-track-charcoal-950 overflow-y-auto">
                <NavCore items={menu.platform} styles={sidebarButtonStyles} />
                <NavUtilies items={menu?.tools} styles={sidebarButtonStyles} />
            </SidebarContent>

            <SidebarFooter className="px-0 border-t border-dashed border-zinc-200 dark:border-neutral-700">
                <NavUser />
            </SidebarFooter>

            {/* <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
                <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src={undefined} alt={"Tawanda"} />
                    <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">Tawanda</span>
                    <span className="truncate text-xs">{"tawanda@cfi.church"}</span>
                </div>
                <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton> */}
        </Sidebar>
    )
}