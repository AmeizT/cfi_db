"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import { ChevronDown } from "lucide-react"

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarTrigger,
    useSidebar,
} from "@/components/ui/sidebar"
import {
    getWorkspaceNavigationSections,
} from "@/config/workspace-navigation"
import { useUser } from "@/hooks/query/use-user"
import { SidebarShortcuts } from "@/features/workspace/sidebar/SidebarShortcuts"
import { useSidebarShortcuts } from "@/features/workspace/sidebar/useSidebarShortcuts"
import { AssemblySwitcher } from "@/layouts/dashboard/AssemblySwitcher"
import { ProfileDropdown } from "@/layouts/dashboard/ProfileDropdown"
import { QuickCreate } from "@/layouts/quick-create"
import { UnifiedSidebarNavigation } from "@/layouts/sidebar/UnifiedSidebarNavigation"
import {
    filterNavigationSections,
    getActiveNavigationKey,
} from "@/layouts/sidebar/navigation-utils"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { AppSearch } from "./AppSearch"
import { AddCircleIcon } from '@solar-icons/react/line-duotone/add-circle'

export function ContextSidebar({
    className,
    variant = "floating",
    ...props
}: React.ComponentProps<typeof Sidebar>) {
    const pathname = usePathname()
    const { data: user } = useUser()
    const { setOpenMobile } = useSidebar()
    const sections = React.useMemo(
        () => filterNavigationSections(getWorkspaceNavigationSections(), user),
        [user]
    )
    const activeKey = getActiveNavigationKey(pathname, sections)
    const administration = sections.find(
        (section) => section.title === "Administration"
    )
    const primarySections = sections.filter(
        (section) => section.title !== "Administration"
    )
    const leadingSections = primarySections.filter(
        (section) => !section.title || section.title === "AI Assistant"
    )
    const groupedSections = primarySections.filter(
        (section) => section.title && section.title !== "AI Assistant"
    )
    const shortcuts = useSidebarShortcuts({ pathname, sections, user })
    const closeMobile = React.useCallback(
        () => setOpenMobile(false),
        [setOpenMobile]
    )

    return (
        <Sidebar
            {...props}
            variant={variant}
            className={cn(
                "*:data-[slot=sidebar-inner]:border-0",
                className
            )}
        >
            <SidebarHeader className="shrink-0 gap-2.5 border-b-0 border-(--shell-sidebar-border) px-2 py-3">
                <div className="w-full flex justify-between min-w-0 items-center gap-3">
                    <SidebarTrigger
                        aria-label="Close workspace navigation"
                        className="size-8 shrink-0 md:hidden"
                    />
                    <div className="min-w-0 lg:flex-1">
                        <AssemblySwitcher />
                    </div>
                </div>

                <AppSearch variant="sidebar" />

                <QuickCreate
                    onAction={closeMobile}
                    trigger={(
                        <Button
                            type="button"
                            variant="ghost"
                            className="h-7 w-full justify-start gap-2 rounded-md px-0 text-(--shell-sidebar-foreground) hover:bg-sidebar-accent hover:text-sidebar-accent-foreground has-[>svg]:px-2"
                        >
                            <AddCircleIcon className="size-5 text-primary" aria-hidden="true" />
                            <span>Create</span>
                            <ChevronDown aria-hidden="true" className="ml-auto" />
                        </Button>
                    )}
                />
            </SidebarHeader>

            <SidebarContent className="
                relative
                overflow-x-hidden
                overflow-y-auto
                px-2
                py-2
                pb-24
                scrollbar-thin
                scrollbar-track-transparent
                scrollbar-thumb-transparent
                hover:scrollbar-thumb-user-theme-500
                md:pb-2
            ">
                <UnifiedSidebarNavigation
                    sections={leadingSections}
                    activeKey={activeKey}
                    onNavigate={closeMobile}
                    shortcutActions={shortcuts}
                />

                <SidebarShortcuts
                    pinned={shortcuts.pinned}
                    recent={shortcuts.recent}
                    activeKey={activeKey}
                    onNavigate={closeMobile}
                    onUnpin={shortcuts.unpin}
                />

                <UnifiedSidebarNavigation
                    sections={groupedSections}
                    activeKey={activeKey}
                    onNavigate={closeMobile}
                    collapsibleSections
                    shortcutActions={shortcuts}
                />

                {administration ? (
                    <UnifiedSidebarNavigation
                        sections={[administration]}
                        activeKey={activeKey}
                        onNavigate={closeMobile}
                        shortcutActions={shortcuts}
                    />
                ) : null}
            </SidebarContent>

            <SidebarFooter className="absolute inset-x-0 bottom-0 z-10 shrink-0 border-0 bg-linear-to-t from-sidebar via-sidebar/90 to-transparent px-2 pt-6 pb-[calc(0.5rem+env(safe-area-inset-bottom))] backdrop-blur-md md:static md:z-auto md:border-t md:border-(--shell-sidebar-border) md:bg-transparent md:bg-none md:p-2 md:backdrop-blur-none">
                <ProfileDropdown variant="sidebar" />
            </SidebarFooter>
        </Sidebar>
    )
}
