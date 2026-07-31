"use client"

import * as React from "react"

export type ShellColorMode = "light" | "full"

const STORAGE_KEY = "cfi-shell-color-mode"

function isShellColorMode(value: string | null): value is ShellColorMode {
    return value === "light" || value === "full"
}

export function useShellColorMode() {
    const [mode, setModeState] = React.useState<ShellColorMode>(() => {
        if (typeof window === "undefined") return "light"
        const storedMode = window.localStorage.getItem(STORAGE_KEY)
        return isShellColorMode(storedMode) ? storedMode : "light"
    })

    React.useLayoutEffect(() => {
        document.documentElement.dataset.shellColorMode = mode
    }, [mode])

    const setMode = React.useCallback((nextMode: ShellColorMode) => {
        setModeState(nextMode)
        window.localStorage.setItem(STORAGE_KEY, nextMode)
        document.documentElement.dataset.shellColorMode = nextMode
    }, [])

    return { mode, setMode }
}
