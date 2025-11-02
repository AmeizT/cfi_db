import { Skeleton } from "@/components/ui/skeleton";

export function AvatarButtonSkeleton() {
    return (
        <div className="flex items-center gap-2 bg-gradient-to-b hover:from-white hover:to-zinc-50 border border-transparent hover:border-zinc-200/70 p-2 rounded-lg transition-colors duration-200">
            <div className="space-y-2">
                <Skeleton className="size-8 rounded-full bg-zinc-200" />
            </div>

            <div className="w-full flex flex-col items-start gap-1">
                <Skeleton className="h-3 w-full bg-zinc-200 dark:bg-accent" />
                <Skeleton className="h-3 w-2/3 bg-zinc-200 dark:bg-accent" />
            </div>
        </div>
    )
}