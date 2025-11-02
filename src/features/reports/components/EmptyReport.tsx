import { CreateReportDialog } from "./CreateReportDialog"

interface EmptyReportProps {
    params: {
        month: string | null
        year: string | null
    }
}

export default function EmptyReport({ params }: EmptyReportProps) {
    return (
        <div className="w-full h-full relative flex flex-col justify-center items-center gap-6">
            <div className="relative w-[100px] h-[130px] mx-auto group transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] hover:scale-[1.06] hover:-translate-y-2">
                <div className="absolute inset-0 bg-slate-100 border-t border-l border-slate-200 rounded-3xl transform rotate-[-8deg] translate-x-[-20px] translate-y-[-15px] shadow-xl transition-transform duration-500 ease-out group-hover:translate-x-[-24px] group-hover:translate-y-[-18px]" />

                <div className="absolute inset-0 border-t border-r border-slate-200 bg-slate-100 rounded-3xl transform rotate-[2deg] translate-x-[5px] translate-y-[-4px] shadow-xl transition-transform duration-500 ease-out group-hover:translate-x-[8px] group-hover:translate-y-[-7px]" />

                <div className="absolute inset-0 border border-slate-200 bg-white rounded-3xl transform rotate-[-4deg] translate-x-[-10px] translate-y-[-8px] shadow-xl transition-transform duration-500 ease-out group-hover:translate-x-[-13px] group-hover:translate-y-[-11px]" />

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
                    No report found for <span className="capitalize">{params.month}</span> {params.year}
                </h3>

                <p className="text-xs text-muted-foreground">
                    You can create a new report or navigate to a different month.
                </p>
            </div>

            <CreateReportDialog />
        </div>
    )
}


