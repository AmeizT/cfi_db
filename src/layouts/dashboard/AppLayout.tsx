"use client"

import React from "react"

import { AppSidebar } from "./AppSidebar"
import { AppNavbar } from "./AppNavbar"
import { BottomNav } from "./BottomNav"

import {
    SidebarInset,
    SidebarProvider,
} from "@/components/ui/sidebar"

import { useUser } from "@/hooks/query/use-user"
import { ScreenLoader } from "@/components/ui/screen-loader"
import { applyChurchTheme } from "@/features/appearance/lib/apply-church-theme"
import { JethroLauncher } from "@/features/jethro/components/JethroLauncher"
import { useShellColorMode } from "@/features/appearance/hooks/use-shell-color-mode"

export default function DashboardAppLayout({
    children,
}: {
    children: Readonly<React.ReactNode>
}) {
    const { data: user, isPending } = useUser()
    useShellColorMode()

    React.useLayoutEffect(() => {
        applyChurchTheme(user?.assembly?.avatar_fallback)
    }, [user?.assembly?.avatar_fallback])

    if (isPending) {
        return <ScreenLoader />
    }

    return (
        <div
            className="
                flex h-dvh w-full flex-col overflow-hidden
                [--navbar-height:4rem]
                lg:[--navbar-height:3rem]
                bg-[var(--shell-chrome-background)] text-[var(--shell-chrome-foreground)]
                bg-crosshatch
            "
        >
            <AppNavbar />

            <SidebarProvider className="min-h-0 flex-1 overflow-hidden">
                <AppSidebar />

                <SidebarInset
                    className="
                        min-h-0 min-w-0 overflow-hidden
                        bg-background
                        md:peer-data-[variant=inset]:border-0
                        md:peer-data-[variant=inset]:border-l-0
                        md:peer-data-[variant=inset]:border-olive-200
                        md:peer-data-[variant=inset]:shadow-none
                    "
                >
                    <div
                        className="
                            @container/main
                            flex min-h-0 flex-1 flex-col
                            overflow-y-auto overscroll-contain
                            scrollbar-thin
                            scrollbar-track-transparent
                            scrollbar-thumb-olive-300
                        "
                    >
                        {children}
                    </div>
                </SidebarInset>

                <BottomNav />
                <JethroLauncher />
            </SidebarProvider>
        </div>
    )
}
