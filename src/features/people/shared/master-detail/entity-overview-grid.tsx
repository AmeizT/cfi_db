import type { ReactNode } from "react"

export function EntityOverviewGrid({ children }: { children: ReactNode }) {
    return <div className="grid min-w-0 gap-4 xl:grid-cols-2">{children}</div>
}
