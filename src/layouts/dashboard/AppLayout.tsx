"use client"

import React from "react"
import { TabBar } from "./TabBar"
import { AppSidebar } from "./AppSidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { BottomNav } from "./BottomNav"

export default function DashboardAppLayout({ children }: { children: Readonly<React.ReactNode> }) {
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <TabBar />

                <div className="px-8 @container/main flex flex-1 flex-col gap-2">
                    {children}
                </div>
            </SidebarInset>
            <BottomNav />
        </SidebarProvider>
    )
}
