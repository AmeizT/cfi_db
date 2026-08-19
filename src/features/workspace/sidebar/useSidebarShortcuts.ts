"use client"

import * as React from "react"
import { toast } from "sonner"

import type { User } from "@/features/auth/schemas/user"
import {
    EMPTY_SHORTCUT_PREFERENCES,
    MAX_PINNED_PAGES,
    buildWorkspaceShortcutRegistry,
    parseShortcutPreferences,
    pinShortcut,
    recordShortcutVisit,
    resolveShortcutDestination,
    resolveShortcutLists,
    sanitizeShortcutPreferences,
    unpinShortcut,
} from "./shortcuts"
import type { NavigationSection } from "@/config/workspace-navigation"

const STORAGE_PREFIX = "cfi:workspace-sidebar-shortcuts:v1"
const SHORTCUTS_EVENT = "cfi-workspace-shortcuts-change"
const EMPTY_SERIALIZED = JSON.stringify(EMPTY_SHORTCUT_PREFERENCES)

export function getShortcutStorageKey(user: User | null | undefined) {
    if (!user?.user_id || !user.church) return null
    return `${STORAGE_PREFIX}:${user.user_id}:${user.church}`
}

function subscribe(storageKey: string | null, callback: () => void) {
    if (!storageKey) return () => undefined

    const onStorage = (event: StorageEvent) => {
        if (event.key === storageKey) callback()
    }
    const onShortcutChange = (event: Event) => {
        if ((event as CustomEvent<string>).detail === storageKey) callback()
    }
    window.addEventListener("storage", onStorage)
    window.addEventListener(SHORTCUTS_EVENT, onShortcutChange)
    return () => {
        window.removeEventListener("storage", onStorage)
        window.removeEventListener(SHORTCUTS_EVENT, onShortcutChange)
    }
}

function readSerialized(storageKey: string | null) {
    if (!storageKey || typeof window === "undefined") return EMPTY_SERIALIZED
    try {
        return window.localStorage.getItem(storageKey) ?? EMPTY_SERIALIZED
    } catch {
        return EMPTY_SERIALIZED
    }
}

function writePreferences(storageKey: string, preferences: typeof EMPTY_SHORTCUT_PREFERENCES) {
    try {
        window.localStorage.setItem(storageKey, JSON.stringify(preferences))
        window.dispatchEvent(new CustomEvent(SHORTCUTS_EVENT, { detail: storageKey }))
    } catch {
        toast.error("Shortcuts could not be saved in this browser.")
    }
}

export function useSidebarShortcuts({
    pathname,
    sections,
    user,
}: {
    pathname: string
    sections: NavigationSection[]
    user: User | null | undefined
}) {
    const storageKey = getShortcutStorageKey(user)
    const registry = React.useMemo(
        () => buildWorkspaceShortcutRegistry(sections),
        [sections],
    )
    const registrySignature = registry.map((item) => item.key).join("|")
    const serialized = React.useSyncExternalStore(
        React.useCallback((callback) => subscribe(storageKey, callback), [storageKey]),
        React.useCallback(() => readSerialized(storageKey), [storageKey]),
        () => EMPTY_SERIALIZED,
    )
    const preferences = React.useMemo(
        () => parseShortcutPreferences(serialized),
        [serialized],
    )
    const registryByKey = React.useMemo(
        () => new Map(registry.map((item) => [item.key, item])),
        [registry],
    )

    React.useEffect(() => {
        if (!storageKey) return
        const current = parseShortcutPreferences(readSerialized(storageKey))
        const sanitized = sanitizeShortcutPreferences(current, new Set(registry.map((item) => item.key)))
        if (JSON.stringify(current) !== JSON.stringify(sanitized)) {
            writePreferences(storageKey, sanitized)
        }
    }, [registry, registrySignature, storageKey])

    React.useEffect(() => {
        if (!storageKey) return
        const destination = resolveShortcutDestination(registry, pathname)
        if (!destination) return
        const current = parseShortcutPreferences(readSerialized(storageKey))
        writePreferences(storageKey, recordShortcutVisit(current, destination.key, Date.now()))
    }, [pathname, registry, registrySignature, storageKey])

    const { pinned, pinnedKeys, recent } = resolveShortcutLists(preferences, registry)

    function pin(key: string) {
        if (!storageKey || !registryByKey.has(key)) return
        const current = parseShortcutPreferences(readSerialized(storageKey))
        const result = pinShortcut(current, key)
        if (result.limitReached) {
            toast.error(`You can pin up to ${MAX_PINNED_PAGES} pages. Remove a pinned page first.`)
            return
        }
        writePreferences(storageKey, result.preferences)
    }

    function unpin(key: string) {
        if (!storageKey) return
        const current = parseShortcutPreferences(readSerialized(storageKey))
        writePreferences(storageKey, unpinShortcut(current, key))
    }

    return {
        pinned,
        recent,
        pinnedKeys,
        eligibleKeys: new Set(registry.map((item) => item.key)),
        pin,
        unpin,
        canManageShortcuts: Boolean(storageKey),
    }
}
