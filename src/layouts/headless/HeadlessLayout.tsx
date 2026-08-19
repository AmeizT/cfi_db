"use client"

import * as React from "react"

import { ScreenLoader } from "@/components/ui/screen-loader"
import { applyChurchTheme } from "@/features/appearance/lib/apply-church-theme"
import { useShellColorMode } from "@/features/appearance/hooks/use-shell-color-mode"
import { JethroLauncher } from "@/features/jethro/components/JethroLauncher"
import { useUser } from "@/hooks/query/use-user"

export function HeadlessLayout({ children }: { children: Readonly<React.ReactNode> }) {
    const { data: user, isPending } = useUser()
    useShellColorMode()

    React.useLayoutEffect(() => {
        applyChurchTheme(user?.assembly?.avatar_fallback)
    }, [user?.assembly?.avatar_fallback])

    if (isPending) return <ScreenLoader />

    return (
        <div className="flex min-h-dvh w-full flex-col overflow-hidden bg-surface text-(--shell-chrome-foreground) [--navbar-height:3.5rem] md:h-dvh md:[--navbar-height:3rem]">
            <div className="@container/main flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain pb-[env(safe-area-inset-bottom)] scrollbar-thin scrollbar-track-transparent scrollbar-thumb-zinc-300">
                {children}
            </div>

            <JethroLauncher />
        </div>
    )
}

export default HeadlessLayout
