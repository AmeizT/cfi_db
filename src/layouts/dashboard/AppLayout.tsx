"use client"

import React from "react"
import { AppSidebar } from "./AppSidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { BottomNav } from "./BottomNav"
import { useUser } from "@/hooks/query/use-user";
import { ScreenLoader } from "@/components/ui/screen-loader";
import { themeVariant } from "../utils/get-oklch-gradient";
import AppWorkbench from "./AppWorkbench";

export default function DashboardAppLayout({ children }: { children: Readonly<React.ReactNode> }) {
    const { data: user, isPending } = useUser()

    React.useLayoutEffect(() => {
        document.documentElement.style.setProperty(
            "--user-theme",
            user?.avatar_fallback ?? "var(--color-indigo-500)"
        )

        document.documentElement.style.setProperty(
            "--user-theme-highlight",
            themeVariant(user?.avatar_fallback ?? "var(--color-indigo-500", { lightness: 0.8 })
        )
    }, [user?.avatar_fallback])

    if(isPending){
        return <ScreenLoader />
    }

    return (
        <SidebarProvider>
            <AppSidebar />
            {/* To change the shadow use - md:peer-data-[variant=inset]:shadow-none */}
            <SidebarInset className="h-[calc(100dvh-12px)] bg-background md:peer-data-[variant=inset]:shadow-none md:peer-data-[variant=inset]:border md:peer-data-[variant=inset]:border-white">
                {/* <AppNavbar /> */}
                <div className="@container/main h-screen flex flex-1 flex-col gap-2 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                    {children}
                </div>
            </SidebarInset>
            <AppWorkbench />
            <BottomNav />
        </SidebarProvider>
    )
}
