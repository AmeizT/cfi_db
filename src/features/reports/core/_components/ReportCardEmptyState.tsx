import { format } from "date-fns"
import { MonthlyReport } from "../schemas/report"
import { IconDots, IconPlus } from "@tabler/icons-react"
import { PlaceholderReport } from "../types/placeholder-report"

interface ReportCardEmptyStateProps {
    report: MonthlyReport | PlaceholderReport
}

export function ReportCardEmptyState({ report }: ReportCardEmptyStateProps) {
    return (
        <div className="group w-full h-full min-h-[283px] relative flex flex-col justify-between items-center gap-4 border-[1] border-dashed border-red-200 rounded-lg bg-white hover:shadow-lg transition-all">
            <div className="px-3 w-full h-10 flex justify-between items-center">
                <h5 className="font-bold">
                    {format(new Date(report.period_start), "MMMM")}
                </h5>

                <span>
                    <IconDots className="size-5" />
                </span>
            </div>

            <div className="relative w-[100px] h-[130px] mx-auto transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]">
                <div className="border-x border-t border-slate-200 bg-white rounded-2xl shadow-xl p-4 flex flex-col transition-transform duration-500 ease-out group-hover:translate-y-[-3px] group-hover:scale-[1.03]">
                    {Array.from({ length: 5 }).map((_, index, arr) => {
                        const isLastTwo = index >= arr.length - 2
                        return (
                            <div
                                key={index}
                                className={`h-1.5 rounded-full mb-2.5 ${isLastTwo ? "bg-slate-100" : "bg-slate-300"
                                    } ${index === arr.length - 1 ? "mb-0 w-1/2" : ""}`}
                            />
                        )
                    })}
                </div>

                <div className="size-8 hidden _flex justify-center items-center absolute -right-[8px] bottom-[8px] rounded-full bg-primary">
                    <IconPlus strokeWidth={2.5} className="size-4 text-white" />
                </div>
            </div>

            <div className="mb-4 text-center">
                <h5 className="text-sm font-bold">
                    No report yet
                </h5>

                <p className="text-xs text-muted-foreground">
                    Click to start your {format(new Date(report.period_start), "MMMM")} report
                </p>
            </div>
        </div>
    )
}