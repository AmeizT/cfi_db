"use client"

import * as React from "react"
import Link from "next/link"
import { Pin, Triangle } from "lucide-react"

import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/animate-ui/primitives/radix/collapsible"
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuAction,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import type {
    NavigationItem,
    NavigationSection,
} from "@/config/workspace-navigation"
import { NavIcon } from "@/layouts/dashboard/AppNavIcon"
import { SidebarNavigationGroup } from "@/layouts/sidebar/SidebarNavigationGroup"
import { cn } from "@/lib/utils"
import {
    containsActiveNavigationItem,
    getActiveParentKey,
} from "./navigation-utils"
import { useActionSounds } from "@/hooks/use-action-sounds";

type UnifiedSidebarNavigationProps = {
    sections: NavigationSection[]
    suppressActive?: boolean
    activeKey: string | undefined
    onNavigate: (item: { key: string; href: string }) => void
    collapsibleSections?: boolean
    shortcutActions?: {
        canManageShortcuts: boolean
        eligibleKeys: ReadonlySet<string>
        pinnedKeys: ReadonlySet<string>
        pin: (key: string) => void
        unpin: (key: string) => void
    }
}

export function UnifiedSidebarNavigation({
    sections,
    activeKey,
    suppressActive = false,
    onNavigate,
    collapsibleSections = false,
    shortcutActions,
}: UnifiedSidebarNavigationProps) {
    const { playClick, playDisabledClick } = useActionSounds()
    const activeParentKey = getActiveParentKey(sections, activeKey)
    const [expandedKey, setExpandedKey] = React.useState<string | null>(
        activeParentKey ?? null
    )

    function iconFor(item: NavigationItem, active: boolean) {
        return active ? item.activeIcon : item.icon
    }

    function renderPinAction(
        item: NavigationItem,
        scope: "menu-item" | "menu-sub-item" = "menu-item",
    ) {
        if (
            !shortcutActions?.canManageShortcuts
            || !shortcutActions.eligibleKeys.has(item.key)
        ) return null

        const isPinned = shortcutActions.pinnedKeys.has(item.key)
        const localHoverClass = scope === "menu-item"
            ? "md:group-hover/menu-item:opacity-100 md:group-focus-within/menu-item:opacity-100"
            : "md:group-hover/menu-sub-item:opacity-100 md:group-focus-within/menu-sub-item:opacity-100"

        return (
            <SidebarMenuAction
                type="button"
                aria-label={isPinned
                    ? `Remove ${item.label} from shortcuts`
                    : `Pin ${item.label} to shortcuts`}
                title={isPinned ? "Remove from shortcuts" : "Pin to shortcuts"}
                className={cn(
                    "transition-opacity duration-150",
                    isPinned ? "opacity-100" : "opacity-100 md:opacity-0",
                    !isPinned && localHoverClass,
                )}
                onClick={(event) => {
                    event.preventDefault()
                    event.stopPropagation()
                    if (isPinned) shortcutActions.unpin(item.key)
                    else shortcutActions.pin(item.key)
                }}
            >
                <Pin
                    aria-hidden="true"
                    className={cn(
                        "rotate-45 fill-transparent transition-colors",
                        isPinned && "fill-current",
                    )}
                    strokeWidth={1.75}
                />
            </SidebarMenuAction>
        )
    }

    function renderLeaf(item: NavigationItem, nested = false) {
        const active = !suppressActive && activeKey === item.key
        const Icon = iconFor(item, active)
        const content = item.disabled ? (
            <>
                <NavIcon icon={Icon} strokeWidth={2} />
                <span>{item.label}</span>
                <span className="ml-auto text-[10px] font-normal uppercase tracking-wide">
                    Soon
                </span>
            </>
        ) : (
            <Link
                href={item.href}
                onNavigate={() => onNavigate(item)}
                aria-current={active ? "page" : undefined}
            >
                <NavIcon icon={Icon} strokeWidth={2} />
                <span>{item.label}</span>
            </Link>
        )

        if (nested) {
            return (
                <SidebarMenuSubItem key={item.key}>
                    <SidebarMenuSubButton
                        size="sm"
                        asChild={!item.disabled}
                        isActive={active}
                        data-connector-target={!item.disabled && activeKey === item.key}
                        aria-disabled={item.disabled || undefined}
                        className={cn(
                            "text-sm font-medium",
                            shortcutActions?.eligibleKeys.has(item.key) && "pr-8",
                            item.disabled && "cursor-not-allowed opacity-55"
                        )}
                    >
                        {content}
                    </SidebarMenuSubButton>
                    {renderPinAction(item, "menu-sub-item")}
                </SidebarMenuSubItem>
            )
        }

        return (
            <SidebarMenuItem key={item.key}>
                <SidebarMenuButton
                    asChild={!item.disabled}
                    isActive={active}
                    disabled={item.disabled}
                    tooltip={item.label}
                    className={cn(
                        "text-sm font-medium",
                        item.disabled && "cursor-not-allowed opacity-55"
                    )}
                >
                    {content}
                </SidebarMenuButton>
                {renderPinAction(item)}
            </SidebarMenuItem>
        )
    }

    function renderItem(item: NavigationItem) {
        const children = item.children ?? []
        if (!children.length || item.disabled) return renderLeaf(item)

        const branchActive = !suppressActive && containsActiveNavigationItem(item, activeKey)
        const open = expandedKey === item.key

        return (
            <Collapsible
                key={item.key}
                asChild
                open={open}
                onOpenChange={(nextOpen) =>
                    setExpandedKey(nextOpen ? item.key : null)
                }
                className="group/collapsible"
            >
                <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                        <SidebarMenuButton
                            tooltip={item.label}
                            aria-label={`Toggle ${item.label} navigation`}
                            aria-expanded={open}
                            onClick={() => { playClick() }}
                            className={cn(
                                "group/nav-item text-sm font-medium",
                                "data-[state=open]:bg-transparent",
                                "data-[state=open]:font-medium",
                                "data-[state=open]:text-(--shell-sidebar-foreground)",
                                branchActive && "text-(--shell-sidebar-foreground)"
                            )}
                        >
                            {/* Icon / chevron slot */}
                            <span className="relative size-5 shrink-0">
                                <span
                                    className={cn(
                                        "absolute inset-0 flex items-center justify-center",
                                        "",
                                        // "group-hover/nav-item:scale-90",
                                        "group-hover/nav-item:opacity-0"
                                    )}
                                >
                                    <NavIcon
                                        icon={iconFor(item, branchActive)}
                                        strokeWidth={2}
                                    />
                                </span>

                                <Triangle
                                    aria-hidden="true"
                                    className={cn(
                                        "size-2! mx-auto my-auto",
                                        "fill-current",
                                        "absolute inset-0 size-5",
                                        "rotate-90 scale-90 opacity-0",
                                        "transition-all duration-150",
                                        "group-hover/nav-item:scale-100",
                                        "group-hover/nav-item:opacity-100",
                                        open && "rotate-180"
                                    )}
                                />
                            </span>

                            <span>{item.label}</span>
                        </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                        <SidebarMenuSub
                            className="assembly-sidebar-branch"
                            ref={(group) => {
                                if (!group) return

                                const rowSelector = '[data-sidebar="menu-sub-button"]'
                                const rowFor = (target: EventTarget | null) => {
                                    if (!(target instanceof Element)) return null
                                    const row = target.closest('[data-sidebar="menu-sub-item"]')
                                    const button = row?.querySelector<HTMLElement>(rowSelector)
                                    return button && group.contains(button)
                                        && button.getAttribute("aria-disabled") !== "true" ? button : null
                                }
                                const activeChild = group.querySelector<HTMLElement>(
                                    `${rowSelector}[data-connector-target="true"]`,
                                )
                                let hovered = rowFor(group.querySelector(`${rowSelector}:hover`))
                                let focused = rowFor(document.activeElement)
                                const updateConnector = () => {
                                    const target = hovered ?? focused ?? activeChild
                                    if (!target) {
                                        delete group.dataset.connectorTargeted
                                        return
                                    }
                                    const bounds = group.getBoundingClientRect()
                                    const child = target.getBoundingClientRect()
                                    const icon = target.querySelector("svg")?.getBoundingClientRect()
                                    // End before the icon: the former 28px reach ran underneath it.
                                    const left = parseFloat(getComputedStyle(group).getPropertyValue("--sidebar-connector-left")) || 18
                                    const width = icon ? Math.max(14, icon.left - bounds.left - left - 4) : 18
                                    group.style.setProperty("--sidebar-connector-end", `${child.top - bounds.top + child.height / 2}px`)
                                    group.style.setProperty("--sidebar-connector-width", `${width}px`)
                                    group.dataset.connectorTargeted = "true"
                                }
                                const onPointerOver = (event: PointerEvent) => {
                                    if (event.pointerType === "touch") return
                                    hovered = rowFor(event.target)
                                    updateConnector()
                                }
                                const onPointerLeave = () => {
                                    hovered = null
                                    updateConnector()
                                }
                                const onFocusIn = (event: FocusEvent) => {
                                    focused = rowFor(event.target)
                                    updateConnector()
                                }
                                const onFocusOut = (event: FocusEvent) => {
                                    focused = rowFor(event.relatedTarget)
                                    updateConnector()
                                }
                                group.addEventListener("pointerover", onPointerOver)
                                group.addEventListener("pointerleave", onPointerLeave)
                                group.addEventListener("focusin", onFocusIn)
                                group.addEventListener("focusout", onFocusOut)
                                updateConnector()
                                const observer = new ResizeObserver(updateConnector)
                                observer.observe(group)
                                for (const child of group.children) observer.observe(child)
                                return () => {
                                    observer.disconnect()
                                    group.removeEventListener("pointerover", onPointerOver)
                                    group.removeEventListener("pointerleave", onPointerLeave)
                                    group.removeEventListener("focusin", onFocusIn)
                                    group.removeEventListener("focusout", onFocusOut)
                                }
                            }}
                        >
                            {children.map((child) => renderLeaf(child, true))}
                        </SidebarMenuSub>
                    </CollapsibleContent>
                </SidebarMenuItem>
            </Collapsible>
        )
    }

    return sections.map((section, index) => {
        const key = section.title ?? `section-${index}`
        const menu = <SidebarMenu>{section.items.map(renderItem)}</SidebarMenu>

        if (section.title && collapsibleSections) {
            return (
                <SidebarNavigationGroup key={key} title={section.title}>
                    {menu}
                </SidebarNavigationGroup>
            )
        }

        return (
            <SidebarGroup key={key} className="p-0">
                {section.title ? (
                    <SidebarGroupLabel className="px-2 text-(--shell-sidebar-muted-foreground)">
                        {section.title}
                    </SidebarGroupLabel>
                ) : null}
                {menu}
            </SidebarGroup>
        )
    })
}
