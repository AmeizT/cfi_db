"use client"

import type { ReactNode } from "react"
import { ChevronDown } from "lucide-react"

import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/animate-ui/primitives/radix/collapsible"
import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"

export function SidebarNavigationGroup({
    title,
    children,
    defaultOpen = true,
    className,
}: {
    title: string
    children: ReactNode
    defaultOpen?: boolean
    className?: string
}) {
    return (
        <Collapsible
            asChild
            defaultOpen={defaultOpen}
            className="group/sidebar-section"
        >
            <SidebarGroup className={cn("p-0", className)}>
                <CollapsibleTrigger asChild>
                    <SidebarGroupLabel asChild>
                        <button
                            type="button"
                            className="w-full justify-between text-(--shell-sidebar-muted-foreground) hover:bg-sidebar-accent hover:text-sidebar-foreground"
                            aria-label={`Toggle ${title} navigation`}
                        >
                            <span>{title}</span>
                            <ChevronDown
                                aria-hidden="true"
                                className="transition-transform duration-200 group-data-[state=open]/sidebar-section:rotate-180"
                            />
                        </button>
                    </SidebarGroupLabel>
                </CollapsibleTrigger>

                <CollapsibleContent
                    initial={false}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="mt-0.5"
                >
                    <SidebarGroupContent>{children}</SidebarGroupContent>
                </CollapsibleContent>
            </SidebarGroup>
        </Collapsible>
    )
}
