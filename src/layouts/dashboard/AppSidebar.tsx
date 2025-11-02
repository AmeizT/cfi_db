"use client"

import { 
    Sidebar, 
    SidebarContent, 
    SidebarFooter, 
    SidebarHeader,
} from "@/components/ui/sidebar"
import { NavFeed } from "./NavFeed"
import { NavUser } from "./NavUser"
import { NavUtilities } from "./NavUtilities"
import { NavDashboard } from "./NavDashboard"
import { dashboardMenu } from "./dashboardMenu"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const menu = dashboardMenu

    return (
        <Sidebar collapsible="icon" {...props} className="border-none">
            <SidebarHeader className="p-0 px-3 gap-0 h-14 flex justify-center items-center">
                <NavUser/>
            </SidebarHeader>

            <SidebarContent className="px-3 flex-col items-center gap-1">
                <NavFeed menu={menu.feed} />
                <NavDashboard menu={menu.platform} />
            </SidebarContent>
            
            <SidebarFooter className="hidden p-0 gap-0 pb-4">
                <NavUtilities menu={menu.tools} />
            </SidebarFooter>
        </Sidebar>
    )
}



