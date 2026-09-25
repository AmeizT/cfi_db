"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import { Plus } from "lucide-react"
import { CameraAddIcon } from '@solar-icons/react/bold-duotone/camera-add'

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
import { getActiveShortcutKey } from "@/features/workspace/sidebar/shortcuts"
import { SidebarShortcuts } from "@/features/workspace/sidebar/SidebarShortcuts"
import { useSidebarShortcuts } from "@/features/workspace/sidebar/useSidebarShortcuts"
import { usesRegionalShell } from "@/features/regional-shell/scope"
import { ZoneSwitcher } from "@/features/regional-shell/ZoneSwitcher"
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
import {
    getSelectedShortcutKey,
    reconcileSidebarOrigin,
    selectSidebarOrigin,
    type SidebarNavigationItem,
    type SidebarNavigationOrigin,
} from "./sidebar/navigation-origin"

export function ContextSidebar({
    className,
    variant = "floating",
    ...props
}: React.ComponentProps<typeof Sidebar>) {
    const pathname = usePathname()
    const { data: user } = useUser()
    const regionalShell = usesRegionalShell(user)
    const { setOpenMobile } = useSidebar()
    const sections = React.useMemo(
        () => filterNavigationSections(getWorkspaceNavigationSections(user, pathname), user),
        [user, pathname]
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
    const matchingShortcutKey = getActiveShortcutKey(
        activeKey, sections, [...shortcuts.pinned, ...shortcuts.recent],
    )
    // Item keys identify the canonical group; source distinguishes its Shortcut copy.
    // Session-only state intentionally falls back to canonical navigation on reload.
    const [origin, setOrigin] = React.useState<SidebarNavigationOrigin>(() => ({ pathname, selection: null }))
    const currentOrigin = reconcileSidebarOrigin(origin, pathname)
    if (currentOrigin !== origin) setOrigin(currentOrigin)
    const activeShortcutKey = regionalShell ? undefined : getSelectedShortcutKey(currentOrigin, matchingShortcutKey)
    const navigateOriginal = (item: SidebarNavigationItem) => {
        setOrigin(selectSidebarOrigin(pathname, "navigation", item))
        setOpenMobile(false)
    }
    const navigateShortcut = (item: SidebarNavigationItem) => {
        setOrigin(selectSidebarOrigin(pathname, "shortcuts", item))
        setOpenMobile(false)
    }
    const closeMobile = React.useCallback(
        () => setOpenMobile(false),
        [setOpenMobile]
    )

    return (
        <Sidebar
            {...props}
            variant={variant}
            className={cn(
                "*:data-[slot=sidebar-inner]:border-0 *:data-[slot=sidebar-inner]:shadow-none",
                className
            )}
        >
            <SidebarHeader className="shrink-0 gap-2.5 border-b-0 border-(--shell-sidebar-border) px-2 py-2">
                <div className="w-full flex justify-between min-w-0 items-center gap-2">
                    <SidebarTrigger
                        aria-label="Close workspace navigation"
                        className="size-8 shrink-0 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground **:data-[slot=separator]:bg-current md:hidden"
                    />
                    <div className="min-w-0 flex-1">
                        {regionalShell ? <ZoneSwitcher /> : <AssemblySwitcher variant="sidebar" />}
                    </div>

                    <QuickCreate
                        onAction={closeMobile}
                        trigger={(
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                aria-label="Create new"
                                className="size-8 shrink-0 rounded-full border-0 border-sidebar-border pill-hover text-assembly-theme-600 hover:bg-background hover:text-assembly-theme-700 dark:bg-neutral-800 dark:text-assembly-theme-500 dark:hover:bg-neutral-700 dark:hover:text-assembly-theme-400 sm:size-10"
                            >
                                <Plus className="size-5" aria-hidden="true" />
                            </Button>
                        )}
                    />
                </div>

                <AppSearch variant="sidebar" />
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
                hover:scrollbar-thumb-assembly-theme-500
                md:pb-2
            ">
                <UnifiedSidebarNavigation
                    sections={leadingSections}
                    activeKey={activeKey}
                    suppressActive={Boolean(activeShortcutKey)}
                    onNavigate={navigateOriginal}
                    shortcutActions={regionalShell ? undefined : shortcuts}
                />

                {!regionalShell && <SidebarShortcuts
                    pinned={shortcuts.pinned}
                    recent={shortcuts.recent}
                    activeKey={activeShortcutKey}
                    onNavigate={navigateShortcut}
                    onUnpin={shortcuts.unpin}
                />}

                <UnifiedSidebarNavigation
                    sections={groupedSections}
                    activeKey={activeKey}
                    suppressActive={Boolean(activeShortcutKey)}
                    onNavigate={navigateOriginal}
                    collapsibleSections
                    shortcutActions={regionalShell ? undefined : shortcuts}
                />

                {administration ? (
                    <UnifiedSidebarNavigation
                        sections={[administration]}
                        activeKey={activeKey}
                        suppressActive={Boolean(activeShortcutKey)}
                        onNavigate={navigateOriginal}
                        shortcutActions={regionalShell ? undefined : shortcuts}
                    />
                ) : null}
            </SidebarContent>

            <SidebarFooter className="absolute inset-x-0 bottom-0 z-10 shrink-0 border-0 bg-linear-to-t from-sidebar via-sidebar/90 to-transparent px-2 pt-6 pb-[calc(0.5rem+env(safe-area-inset-bottom))] backdrop-blur-md md:static md:z-auto md:border-t-0 md:border-(--shell-sidebar-border) md:bg-transparent md:bg-none md:p-2 md:backdrop-blur-none">
                <ProfileDropdown variant="sidebar" />
            </SidebarFooter>
        </Sidebar>
    )
}
