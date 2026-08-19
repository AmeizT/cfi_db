"use client"

import * as React from "react"
import { usePathname } from "next/navigation"

import { workspaceNavigation, type NavigationItem } from "@/config/workspace-navigation"

export type RecentVisit = {
    href: string
    label: string
    category: string
    visitedAt: string
}

const STORAGE_KEY = "cfi-workspace-recent-visits"
const CHANGE_EVENT = "cfi-recent-visits-change"

function candidates() {
    const rows: Array<{ item: NavigationItem; category: string }> = []
    const walk = (items: NavigationItem[], category: string) => {
        for (const item of items) {
            rows.push({ item, category })
            walk(item.children ?? [], category)
        }
    }
    for (const section of workspaceNavigation) walk(section.items, section.title ?? "Workspace")
    return rows
}

function readVisits(): RecentVisit[] {
    if (typeof window === "undefined") return []
    try {
        const value = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "[]")
        return Array.isArray(value) ? value.slice(0, 5) : []
    } catch {
        return []
    }
}

export function RecentVisitsTracker() {
    const pathname = usePathname()

    React.useEffect(() => {
        if (pathname === "/" || pathname === "/ai") return
        const match = candidates()
            .filter(({ item }) => pathname === item.href || pathname.startsWith(`${item.href}/`))
            .sort((a, b) => b.item.href.length - a.item.href.length)[0]
        if (!match) return

        const next: RecentVisit[] = [
            {
                href: match.item.href,
                label: match.item.label,
                category: match.category,
                visitedAt: new Date().toISOString(),
            },
            ...readVisits().filter((visit) => visit.href !== match.item.href),
        ].slice(0, 5)
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
        window.dispatchEvent(new Event(CHANGE_EVENT))
    }, [pathname])

    return null
}

export function useRecentVisits() {
    const [visits, setVisits] = React.useState<RecentVisit[]>([])

    React.useEffect(() => {
        const update = () => setVisits(readVisits())
        update()
        window.addEventListener("storage", update)
        window.addEventListener(CHANGE_EVENT, update)
        return () => {
            window.removeEventListener("storage", update)
            window.removeEventListener(CHANGE_EVENT, update)
        }
    }, [])

    return visits
}
