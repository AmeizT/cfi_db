"use client"

import React from "react"
import { AppBar } from "../components/AppBar"
import { User } from "@/features/auth/types/user"
import { BottomNav } from "../dashboard/BottomNav"
// import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"

interface HomeLayoutProps {
    isAuthenticated?: boolean
    children: Readonly<React.ReactNode>
    user?: User | null
}

export function HomeLayout({ children, isAuthenticated, user }: HomeLayoutProps) {
    return (
        <React.Fragment>
            <AppBar isAuthenticated={isAuthenticated} user={user || undefined} />

            <main>
                {children}
            </main>

            <BottomNav />
        </React.Fragment>
    )
}