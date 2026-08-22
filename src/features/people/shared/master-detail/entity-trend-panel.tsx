import { ChartNoAxesCombinedIcon } from "lucide-react"

export function EntityTrendPanel({ title = "Attendance trend" }: { title?: string }) {
    return (
        <section className="rounded-lg border border-border-subtle bg-card p-4">
            <h2 className="font-semibold text-foreground">{title}</h2>
            <div className="mt-4 flex min-h-40 flex-col items-center justify-center rounded-md border border-dashed border-border bg-muted/20 px-6 text-center">
                <ChartNoAxesCombinedIcon aria-hidden="true" className="size-7 text-muted-foreground" />
                <p className="mt-2 text-sm font-medium text-foreground">No trend data available</p>
                <p className="mt-1 text-xs text-muted-foreground">Attendance history is not exposed by the current profile API.</p>
            </div>
        </section>
    )
}
