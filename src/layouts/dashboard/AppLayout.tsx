"use client"

import React from "react"
import { AppSidebar } from "./AppSidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { BottomNav } from "./BottomNav"
import { useUser } from "@/hooks/query/use-user";

export default function DashboardAppLayout({ children }: { children: Readonly<React.ReactNode> }) {
    const {data: user} = useUser()
    React.useEffect(() => {
        document.documentElement.style.setProperty(
            "--user-theme",
            user?.avatar_fallback ?? "color-indigo-500"
        )
    }, [user?.avatar_fallback])

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset className="p-px h-full bg-gray-100 md:peer-data-[variant=inset]:shadow-none border-0">
                <div className="@container/main h-screen flex flex-1 flex-col gap-2">
                    {children}
                </div>
            </SidebarInset>
            <BottomNav />
        </SidebarProvider>
    )
}


