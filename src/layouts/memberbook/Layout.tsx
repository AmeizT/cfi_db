"use client"

import React from "react"
import { AppSidebar } from "../dashboard/AppSidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

export function MemberBookLayout({ children }: { children: Readonly<React.ReactNode> }) {
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset className="flex-row">
                <div className="w-64 h-dvh bg-inherit dark:bg-neutral-900 border-r dark:border-neutral-700">

                </div>

                <div className="w-full">
                    {children}
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}


// export function MemberBookLayout({ children }: { children: Readonly<React.ReactNode> }) {
//     return (
//         <SidebarProvider
//             style={{
//                 "--sidebar-width": "calc(var(--spacing) * 64)",
//                 "--header-height": "calc(var(--spacing) * 12)",
//             } as React.CSSProperties}
//         >
//             <AppSidebar variant="inset" />

//             <SidebarInset className="bg-inherit md:peer-data-[variant=inset]:border-none dark:md:peer-data-[variant=inset]:border-none">
//                 <div className="@container/main h-full flex gap-2">
//                     {children}
//                 </div>
//             </SidebarInset>
//         </SidebarProvider>
//     )
// }
