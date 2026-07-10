import type { ReactNode } from "react"

export function EmptyState({ children }: { children: ReactNode }) {
    return (
        <div className="flex min-h-56 items-center justify-center rounded-lg border border-dashed border-border bg-muted/20 px-6 py-10 text-center text-sm text-muted-foreground">
            {children}
        </div>
    )
}
