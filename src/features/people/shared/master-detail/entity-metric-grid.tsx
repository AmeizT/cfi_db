import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

export function EntityMetricGrid({ children, className }: { children: ReactNode; className?: string }) {
    return <div className={cn("grid gap-3 sm:grid-cols-2 xl:grid-cols-4", className)}>{children}</div>
}

export function EntityMetricCard({ label, value, hint }: { label: string; value: ReactNode; hint?: ReactNode }) {
    return (
        <div className="rounded-lg border border-border-subtle bg-card px-4 py-3">
            <div className="text-xs font-medium text-muted-foreground">{label}</div>
            <div className="mt-1 text-xl font-semibold tracking-tight text-foreground">{value}</div>
            {hint ? <div className="mt-1 text-xs text-muted-foreground">{hint}</div> : null}
        </div>
    )
}
