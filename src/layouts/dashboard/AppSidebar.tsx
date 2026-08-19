"use client"

import type * as React from "react"

import { Sidebar } from "@/components/ui/sidebar"
import { ContextSidebar } from "@/layouts/ContextSidebar"

/** Compatibility wrapper for layouts that still import AppSidebar. */
export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
    return <ContextSidebar {...props} />
}
