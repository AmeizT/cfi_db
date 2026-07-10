"use client"

import type { ReactNode } from "react"

export function ReportModuleDataTable({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-0 flex-1 rounded-lg border-0 border-border">
            {children}
        </div>
    )
}
