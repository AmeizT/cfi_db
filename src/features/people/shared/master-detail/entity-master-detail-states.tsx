import { AlertCircleIcon, InboxIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { getErrorMessage } from "./entity-master-detail.utils"

export function EntityListSkeleton() {
    return (
        <div aria-label="Loading directory" className="divide-y divide-border-subtle">
            {Array.from({ length: 7 }).map((_, index) => (
                <div key={index} className="flex items-center gap-3 px-4 py-3">
                    <Skeleton className="size-10 rounded-full" />
                    <div className="flex-1 space-y-2"><Skeleton className="h-3 w-2/3" /><Skeleton className="h-3 w-4/5" /></div>
                </div>
            ))}
        </div>
    )
}

export function EntityDetailSkeleton() {
    return (
        <div aria-label="Loading profile" className="space-y-5 p-6">
            <div className="flex gap-4"><Skeleton className="size-16 rounded-full" /><div className="flex-1 space-y-3"><Skeleton className="h-6 w-48" /><Skeleton className="h-4 w-72 max-w-full" /></div></div>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{Array.from({ length: 4 }).map((_, index) => <Skeleton key={index} className="h-24" />)}</div>
            <Skeleton className="h-64" />
        </div>
    )
}

export function EntityNeutralDetail() {
    return (
        <div className="flex min-h-[28rem] flex-col items-center justify-center px-6 text-center">
            <InboxIcon aria-hidden="true" className="size-10 text-muted-foreground" />
            <h2 className="mt-4 text-base font-semibold text-foreground">Select a record</h2>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">Choose an item from the directory to view its profile and history.</p>
        </div>
    )
}

export function EntityMasterDetailEmpty({ children }: { children: React.ReactNode }) {
    return <div className="flex min-h-80 items-center justify-center p-6 text-center">{children}</div>
}

export function EntityMasterDetailError({ error, onRetry }: { error: unknown; onRetry?: () => void }) {
    return (
        <div className="flex min-h-80 flex-col items-center justify-center p-6 text-center">
            <AlertCircleIcon aria-hidden="true" className="size-9 text-destructive" />
            <h2 className="mt-3 font-semibold text-foreground">Unable to load directory</h2>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">{getErrorMessage(error)}</p>
            {onRetry ? <Button type="button" className="mt-4" variant="outline" onClick={onRetry}>Try again</Button> : null}
        </div>
    )
}

export function EntityUnavailablePanel({ title, description }: { title: string; description: string }) {
    return (
        <section className="rounded-lg border border-border-subtle bg-card p-6">
            <h2 className="font-semibold text-foreground">{title}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{description}</p>
        </section>
    )
}
