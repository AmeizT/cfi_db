import { CreateReportDialog } from "./CreateReportDialog"

interface ReportEmptyStateProps {
    params: {
        month: string | null
        year: string | null
    }
}

export default function ReportEmptyState({ params }: ReportEmptyStateProps) {
    return (
        <div className="w-full min-h-[80dvh] relative flex flex-col justify-center items-center gap-6">
            <div className="relative w-[100px] h-[130px] mx-auto group transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] hover:scale-[1.06] hover:-translate-y-2">
                <div className="absolute inset-0 bg-gray-100 border-t border-l border-gray-200 rounded-3xl transform rotate-[-8deg] -translate-x-5 translate-y-[-15px] shadow-xl transition-transform duration-500 ease-out group-hover:-translate-x-6 group-hover:translate-y-[-18px]" />

                <div className="absolute inset-0 border-t border-r border-gray-200 bg-gray-100 rounded-3xl transform rotate-2 translate-x-[5px] -translate-y-1 shadow-xl transition-transform duration-500 ease-out group-hover:translate-x-2 group-hover:translate-y-[-7px]" />

                <div className="absolute inset-0 border border-gray-200 bg-white rounded-3xl transform rotate-[-4deg] -translate-x-2.5 -translate-y-2 shadow-xl transition-transform duration-500 ease-out group-hover:translate-x-[-13px] group-hover:translate-y-[-11px]" />

                <div className="absolute inset-0 border-x border-t border-gray-200 bg-white rounded-3xl shadow-2xl p-4 flex flex-col transition-transform duration-500 ease-out group-hover:translate-y-[-3px] group-hover:scale-[1.03]">
                    {Array.from({ length: 5 }).map((_, index, arr) => {
                        const isLastTwo = index >= arr.length - 2
                        return (
                            <div
                                key={index}
                                className={`h-2 rounded-full mb-2 ${isLastTwo ? "bg-gray-100" : "bg-gray-300"
                                    } ${index === arr.length - 1 ? "mb-0 w-1/2" : ""}`}
                            />
                        )
                    })}
                </div>
            </div>

            <div className="mt-4 text-center">
                <h3 className="text-sm font-bold text-gray-900">
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


