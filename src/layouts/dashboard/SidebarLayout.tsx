"use client"

import React from "react"
import { BottomNav } from "./BottomNav"
import { AppSidebar } from "./AppSidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

export default function HeadlessSidebarLayout({ children }: { children: Readonly<React.ReactNode> }) {
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <div className="px-6 @container/main flex flex-1 flex-col gap-2">
                    {children}
                </div>
            </SidebarInset>
            <BottomNav />
        </SidebarProvider>
    )
}
