import type { ReactNode } from "react"

export type EntityInfoItem = { label: string; value: ReactNode }

export function EntityInfoPanel({ title, items, actions }: { title: string; items: EntityInfoItem[]; actions?: ReactNode }) {
    return (
        <section className="rounded-lg border border-border-subtle bg-card p-4">
            <div className="flex items-center justify-between gap-3">
                <h2 className="font-semibold text-foreground">{title}</h2>
                {actions}
            </div>
            <dl className="mt-4 grid gap-x-6 gap-y-4 sm:grid-cols-2">
                {items.map((item) => (
                    <div key={item.label} className="min-w-0">
                        <dt className="text-xs font-medium text-muted-foreground">{item.label}</dt>
                        <dd className="mt-1 break-words text-sm text-foreground">{item.value}</dd>
                    </div>
                ))}
            </dl>
        </section>
    )
}
