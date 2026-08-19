import { formatEntityDate } from "./entity-master-detail.utils"

export type EntityActivityItem = {
    id: string
    title: string
    description?: string
    date?: string | null
}

export function EntityActivityTimeline({ title = "Recent activity", items }: { title?: string; items: EntityActivityItem[] }) {
    return (
        <section className="rounded-lg border border-border-subtle bg-card p-4">
            <h2 className="font-semibold text-foreground">{title}</h2>
            {items.length ? (
                <ol className="mt-4 space-y-0">
                    {items.map((item, index) => (
                        <li key={item.id} className="relative flex gap-3 pb-4 last:pb-0">
                            {index < items.length - 1 ? <span aria-hidden="true" className="absolute left-[5px] top-3 h-full w-px bg-border" /> : null}
                            <span aria-hidden="true" className="relative mt-1.5 size-3 shrink-0 rounded-full border-2 border-primary bg-background" />
                            <div className="min-w-0">
                                <div className="text-sm font-medium text-foreground">{item.title}</div>
                                {item.description ? <p className="mt-0.5 text-sm text-muted-foreground">{item.description}</p> : null}
                                <time className="mt-1 block text-xs text-muted-foreground">{formatEntityDate(item.date)}</time>
                            </div>
                        </li>
                    ))}
                </ol>
            ) : <p className="mt-4 text-sm text-muted-foreground">No activity is available for this record.</p>}
        </section>
    )
}
