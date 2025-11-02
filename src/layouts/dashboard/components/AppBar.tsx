"use client"

import React from "react"
// import { Bell, Plus } from "lucide-react"
import { Separator } from "@/components/ui/separator"
// import { useRouter } from "next/navigation"
import { SidebarTrigger } from "@/components/ui/sidebar"

export function AppBar(){
    // const router = useRouter()
    // const [isCreateOpen, setIsCreateOpen] = React.useState(false)
    // const [isNotificationsOpen, setIsNotificationsOpen] = React.useState(false)
    
    // function handleCreateClick(){
    //     router.push("/editor?category=bookkeeping")
    //     setIsCreateOpen(prev => !prev)
    // }

    // function handleNotificationClick() {
    //     setIsNotificationsOpen(prev => !prev)
    // }

    return (
        <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b-0 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height">
            <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
                <SidebarTrigger className="-ml-1" />
                
                <Separator
                    orientation="vertical"
                    className="mx-2 data-[orientation=vertical]:h-4 bg-zinc-200 dark:bg-neutral-700"
                />

                <div className="ml-auto flex items-center gap-2">
                    bell icon

                    <Separator
                        orientation="vertical"
                        className="data-[orientation=vertical]:h-4 bg-zinc-200 dark:bg-neutral-700"
                    />
                    
                    Plus Icon
                </div>
            </div>
        </header>
    )
}