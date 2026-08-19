import type { ReactNode } from "react"
import { Badge } from "@/components/ui/badge"

type ProfileFact = { label: string; value: ReactNode }

type EntityProfileHeaderProps = {
    avatar: ReactNode
    title: string
    status: string
    statusVariant?: "default" | "secondary" | "outline" | "destructive"
    facts?: ProfileFact[]
    actions?: ReactNode
}

export function EntityProfileHeader({ avatar, title, status, statusVariant = "secondary", facts = [], actions }: EntityProfileHeaderProps) {
    return (
        <header className="border-b border-border-subtle px-4 py-5 sm:px-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                <div className="shrink-0">{avatar}</div>
                <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                        <h1 className="min-w-0 truncate text-xl font-semibold text-foreground sm:text-2xl">{title}</h1>
                        <Badge variant={statusVariant}>{status}</Badge>
                    </div>
                    {facts.length ? (
                        <dl className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm">
                            {facts.map((fact) => (
                                <div key={fact.label} className="min-w-0">
                                    <dt className="sr-only">{fact.label}</dt>
                                    <dd className="max-w-64 truncate text-muted-foreground" title={typeof fact.value === "string" ? fact.value : undefined}>{fact.value}</dd>
                                </div>
                            ))}
                        </dl>
                    ) : null}
                </div>
                {actions ? <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div> : null}
            </div>
        </header>
    )
}
