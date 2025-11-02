import React from "react"
import { AppBar } from "./components/AppBar"
import { AppSidebar } from "./components/Sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { BottomNav } from "./BottomNav"

export function DashboardLayout({ children }: { children: Readonly<React.ReactNode> }) {
    return (
        <SidebarProvider
            style={{
                "--sidebar-width": "calc(var(--spacing) * 60)",
                "--header-height": "calc(var(--spacing) * 12)",
            } as React.CSSProperties}
        >
            <AppSidebar />
            
            <SidebarInset className="dark:border-neutral-700/70 dark:bg-neutral-950 md:peer-data-[variant=inset]:m-0 md:peer-data-[variant=inset]:peer-data-[state=collapsed]:ml-0">
                <AppBar />
                <div className="@container/main flex flex-1 flex-col gap-2">
                    {children}
                </div>
                <BottomNav />
            </SidebarInset>
        </SidebarProvider>
    )
}
