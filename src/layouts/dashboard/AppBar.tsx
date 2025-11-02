"use client"

import React from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import UserMenu from "./UserMenu"
import { useUser } from "@/hooks/query/use-user"
import { CreateDropdown } from "./CreateDropdown"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { IconCheck, IconChevronDown, IconCircleCheckFilled } from "@tabler/icons-react"
import { Home08Icon, Notification01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon, IconSvgElement } from "@hugeicons/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export interface NavigationShortcut {
    title: string
    icon: IconSvgElement
    href?: string
}

export const navigationShortcuts: NavigationShortcut[] = [
    {
        title: "Notifications",
        icon: Notification01Icon,
    },
]

export function AppBar() {
    const { data: user } = useUser()
    const assemblies = user?.assemblies || []
    const activeAssembly = assemblies?.find(assembly => assembly?.id === Number(user?.church))
    console.log(activeAssembly)

    return (
        <header className="lg:gap-2 lg:px-0 w-full flex shrink-0 items-center fixed lg:static top-0 lg:top-2 lg:right-2 z-40 lg:rounded-t-2xl bg-white dark:bg-neutral-950/80 backdrop-blur-xl transition-[width,height] ease-linear">
            <div className="px-4 lg:px-6 h-16 lg:h-14 flex w-full items-center gap-1 lg:border-b-0 border-gray-200 dark:border-neutral-700">
                <div className="w-full hidden lg:flex items-center gap-3">
                    <div className="flex justify-center items-center gap-2">
                        {/* <Link href="/reports/compliance" className="size-8 relative flex justify-center items-center gap-1 text-green-100 bg-green-600 hover:bg-green-700 transition-colors rounded-[10px]">
                            <IconCheck className="size-4.5" />
                            <span className="sr-only">Compliant</span>
                        </Link> */}

                        <Link href="/dashboard" className="size-8 flex justify-center items-center text-gray-800 dark:text-white hover:text-neutral-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors rounded-lg">
                            <HugeiconsIcon icon={Home08Icon} strokeWidth={2} className="size-5" />
                            <span className="sr-only">Dashboard</span>
                        </Link>
                    </div>

                    {/* <Separator
                        orientation="vertical"
                        className="data-[orientation=vertical]:h-4"
                    /> */}

                    <div className="w-1/4">
                        <Input className="w-full h-8 ring-0 border-none border-gray-300 shadow-none rounded-full placeholder:text-gray-500 caret-primary bg-gray-100" placeholder="Search..." />
                    </div>
                </div>
                
                <div className="block lg:hidden">
                    <UserMenu />
                </div>

                {/* <div className="p-1 hidden justify-center items-center gap-x-2 rounded-full bg-gray-100">
                    <AvatarGroupDemo />
                    <div className="flex flex-col gap-3.5">
                        <span className="text-sm font-semibold">
                            {activeAssembly?.name}
                        </span>

                        <small className="hidden leading-0">
                            {activeAssembly?.country}
                        </small>
                    </div>

                    <button className="size-7 flex justify-center items-center rounded-full bg-white">
                        <IconChevronsDown className="size-5" />
                    </button>
                </div> */}

                <div className="ml-auto flex items-center gap-2">
                    

                    <Separator
                        orientation="vertical"
                        className="mx-2 data-[orientation=vertical]:h-4 bg-gray-300"
                    />

                    {navigationShortcuts.map((item) =>
                        item.href ? (
                            <Link
                                href={item.href}
                                key={item.title}
                                className="size-8 hidden lg:flex justify-center items-center text-gray-800 dark:text-white hover:text-neutral-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors rounded-lg group"
                            >
                                {item.title === "Notifications" ? (
                                    <motion.span
                                        whileHover={{ scale: 1.2, y: -2 }}
                                        transition={{ type: "spring", stiffness: 300 }}
                                    >
                                        <HugeiconsIcon icon={item.icon} strokeWidth={2} className="size-5" />
                                    </motion.span>
                                ) : (
                                    <span className="transition-transform group-hover:scale-102">
                                        <HugeiconsIcon icon={item.icon} strokeWidth={2} className="size-5" />
                                    </span>
                                )}
                            </Link>
                        ) : (
                            <button
                                key={item.title}
                                className="size-8 hidden lg:flex justify-center items-center text-gray-800 dark:text-white hover:text-neutral-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors rounded-lg group"
                            >
                                {item.title === "Notifications" ? (
                                    <motion.span
                                        whileHover={{ scale: 1.2, y: -2 }}
                                        transition={{ type: "spring", stiffness: 300 }}
                                    >
                                        <HugeiconsIcon icon={item.icon} strokeWidth={2} className="size-5" />
                                    </motion.span>
                                ) : (
                                    <span className="transition-transform group-hover:scale-110">
                                        <HugeiconsIcon icon={item.icon} strokeWidth={2} className="size-5" />
                                    </span>
                                )}
                            </button>
                        )
                    )}

                    <div className="ml-2 h-8 flex items-center">
                        <CreateDropdown />
                    </div>
                </div>
            </div>
        </header>
    )
}




// import {
//     Avatar,
//     AvatarFallback,
//     AvatarImage,
// } from '@/components/ui/avatar';
// import {
//     AvatarGroup,
//     AvatarGroupTooltip,
// } from '@/components/animate-ui/components/avatar-group';
// import { useUser } from "@/hooks/query/use-user"
// import UserMenu from "./UserMenu"
// import { CreateDropdown } from "./CreateDropdown"
// import { Separator } from "@/components/ui/separator"
// import { SidebarTrigger } from "@/components/ui/sidebar"

// export function AvatarGroupDemo() {
//     const { data: user } = useUser()
//     const assignedAssemblies = user?.assemblies || []

//     return (
//         <AvatarGroup className="h-fit -space-x-3">
//             {assignedAssemblies?.slice(-4)?.map((assembly, index) => (
//                 <Avatar key={index} className="size-7 border-[1.5px] border-white">
//                     <AvatarImage src={assembly?.avatar} />
//                     <AvatarFallback className="text-white text-sm font-medium" style={{ backgroundColor: assembly?.avatar_fallback }}>
//                         {assembly?.name?.charAt(0)}
//                     </AvatarFallback>
//                     <AvatarGroupTooltip>
//                         <p>{assembly?.name}</p>
//                     </AvatarGroupTooltip>
//                 </Avatar>
//             ))}
//         </AvatarGroup>
//     );
// }
