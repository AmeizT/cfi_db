"use client"

import Link from "next/link"
import { History, Pin } from "lucide-react"

import {
    SidebarMenu,
    SidebarMenuAction,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import { SidebarNavigationGroup } from "@/layouts/sidebar/SidebarNavigationGroup"
import type { ShortcutDestination } from "./shortcuts"

export function SidebarShortcuts({
    pinned,
    recent,
    activeKey,
    onNavigate,
    onUnpin,
}: {
    pinned: ShortcutDestination[]
    recent: ShortcutDestination[]
    activeKey: string | undefined
    onNavigate: () => void
    onUnpin: (key: string) => void
}) {
    const isEmpty = pinned.length === 0 && recent.length === 0

    return (
        <SidebarNavigationGroup title="Shortcuts">
            <SidebarMenu>
                {pinned.map((item) => (
                    <SidebarMenuItem
                        key={`pinned-${item.key}`}
                        className="group/shortcut-item"
                    >
                        <SidebarMenuButton
                            asChild
                            isActive={activeKey === item.key}
                            tooltip={item.accessibleLabel}
                        >
                            <Link
                                href={item.href}
                                onClick={onNavigate}
                                aria-label={item.accessibleLabel}
                            >
                                <Pin aria-hidden="true" className="rotate-45 fill-current" />
                                <span>{item.label}</span>
                            </Link>
                        </SidebarMenuButton>
                        <SidebarMenuAction
                            type="button"
                            aria-label={`Remove ${item.label} from shortcuts`}
                            title="Remove from shortcuts"
                            className="opacity-100 md:opacity-0 md:group-hover/shortcut-item:opacity-100 md:group-focus-within/shortcut-item:opacity-100"
                            onClick={(event) => {
                                event.preventDefault()
                                event.stopPropagation()
                                onUnpin(item.key)
                            }}
                        >
                            <Pin aria-hidden="true" className="rotate-45 fill-current" />
                        </SidebarMenuAction>
                    </SidebarMenuItem>
                ))}

                {recent.map((item) => (
                    <SidebarMenuItem key={`recent-${item.key}`}>
                        <SidebarMenuButton
                            asChild
                            isActive={activeKey === item.key}
                            tooltip={item.accessibleLabel}
                        >
                            <Link
                                href={item.href}
                                onClick={onNavigate}
                                aria-label={item.accessibleLabel}
                            >
                                <History aria-hidden="true" />
                                <span>{item.label}</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}

                {isEmpty ? (
                    <li className="px-2 py-1 text-xs text-(--shell-sidebar-muted-foreground)">
                        Pin a page to keep it close at hand.
                    </li>
                ) : null}
            </SidebarMenu>
        </SidebarNavigationGroup>
    )
}
