import { Button } from "@/components/ui/button"
import { IconPlus } from "@tabler/icons-react"

export default function EmptyCompare() {
    return (
        <div className="w-full h-full relative flex flex-col justify-center items-center gap-6">
            <div className="relative w-[100px] h-[130px] mx-auto group transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] hover:scale-[1.06] hover:-translate-y-2">
                <div className="p-4 absolute inset-0 bg-slate-50 border-t border-x border-slate-200 rounded-3xl transform translate-x-[-50px] translate-y-[-20px] shadow-xl transition-transform duration-500 ease-out group-hover:translate-x-[-50px] group-hover:translate-y-[-3px]">
                    {Array.from({ length: 5 }).map((_, index, arr) => {
                        const isLastTwo = index >= arr.length - 2
                        return (
                            <div
                                key={index}
                                className={`h-2 rounded-full mb-2 ${isLastTwo ? "bg-slate-200" : "bg-slate-300"
                                    } ${index === arr.length - 1 ? "mb-0 w-1/2" : ""}`}
                            />
                        )
                    })}
                </div>

                <div className="hidden absolute inset-0 border-t border-r border-slate-200 bg-slate-100 rounded-3xl transform rotate-[2deg] translate-x-[5px] translate-y-[-4px] shadow-xl transition-transform duration-500 ease-out group-hover:translate-x-[8px] group-hover:translate-y-[-7px]" />

                <div className="hidden absolute inset-0 border-t border-slate-200 bg-white rounded-3xl transform rotate-[-4deg] translate-x-[-10px] translate-y-[-8px] shadow-xl transition-transform duration-500 ease-out group-hover:translate-x-[-13px] group-hover:translate-y-[-11px]" />

                <div className="absolute inset-0 border-x border-t border-slate-200 bg-white rounded-3xl shadow-2xl p-4 flex flex-col transition-transform duration-500 ease-out group-hover:translate-y-[-3px] group-hover:scale-[1.03]">
                    {Array.from({ length: 5 }).map((_, index, arr) => {
                        const isLastTwo = index >= arr.length - 2
                        return (
                            <div
                                key={index}
                                className={`h-2 rounded-full mb-2 ${isLastTwo ? "bg-slate-100" : "bg-slate-300"
                                    } ${index === arr.length - 1 ? "mb-0 w-1/2" : ""}`}
                            />
                        )
                    })}
                </div>
            </div>

            <div className="mt-4 text-center">
                <h3 className="text-sm font-bold text-slate-900">
                    No comparison data
                </h3>

                <p className="text-xs text-muted-foreground">
                    Compare with another month <br /> to view trends and insights.
                </p>
            </div>

            <div className="hidden">
                <Button className="h-9 bg-neutral-900 hover:bg-neutral-800 text-white font-medium rounded-[10px] shadow-none hover:scale-[1.03] active:scale-95 ease-[cubic-bezier(0.25,1,0.5,1)] transition-transform">
                    <IconPlus strokeWidth={2} /> Create Report
                </Button>
            </div>
        </div>
    )
}