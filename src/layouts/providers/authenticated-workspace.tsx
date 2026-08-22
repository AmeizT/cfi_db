"use client"

import type { ReactNode } from "react"

import { JethroSessionProvider } from "@/features/jethro/JethroSessionProvider"

/** Shared client providers for every authenticated workspace shell. */
export function AuthenticatedWorkspaceProviders({ children }: { children: ReactNode }) {
    return <JethroSessionProvider>{children}</JethroSessionProvider>
}
