import { Skeleton } from "@/components/ui/skeleton";

function CashflowRowSkeleton(){
    return (
        <div className="px-4 w-full min-h-20 flex justify-between items-center">
            <div className="w-fit flex flex-col gap-y-2">
                <Skeleton className="w-48 h-6" />
                <Skeleton className="w-40 h-5" />
            </div>

            <div className="w-fit flex flex-col items-end gap-2">
                <Skeleton className="w-[100px] h-7" />
                <Skeleton className="w-[100px] h-1 rounded-full" />
            </div>
        </div>
    )
}

export function CashflowListSkeleton(){
    return (
        <div className="w-full flex flex-col">
            <div className="p-2 ">
                {Array.from({ length: 5 }).map((_, index) => (
                    <CashflowRowSkeleton key={index} />
                ))}
            </div>

            <div className="px-6 w-full min-h-20 flex justify-between items-center border-t-2 border-slate-100">
                <Skeleton className="w-48 h-6" />
                <Skeleton className="w-48 h-6" />
            </div>
        </div>
    )
}