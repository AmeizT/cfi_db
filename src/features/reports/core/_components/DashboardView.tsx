import React from "react"
import { formatCurrency } from "@/utils"
import { StatsReport } from "../schemas/report"
import EmptyReport from "./ReportEmptyState"
import { Separator } from "@/components/ui/separator"
import { TrendingDown, Users, DollarSign, Percent } from "lucide-react"
import { useSearchParams } from "next/navigation"

interface FinanceSummaryCardProps {
    label: string
    value: number
    selectedReport?: StatsReport   
}

function FinanceSummaryCard({ label, value, selectedReport }: FinanceSummaryCardProps) {
    const locale = {
        language: selectedReport?.finance_summary?.locale?.language,
        currency: selectedReport?.finance_summary?.locale?.currency
    }

    return (
        <div className="h-full flex flex-col justify-center">
            <h2 className="text-[1.75rem] font-bold font-geist">
                {formatCurrency(value, { 
                    language: locale?.language || "en-US", 
                    currency: locale?.currency || "USD"}
                )}
            </h2>

            <small className="text-sm text-muted-foreground font-medium">
                {label}
            </small>
        </div>
    )
}

interface ReportsDashboardViewProps {
    selectedReport: StatsReport
}

export function DashboardReportView({ selectedReport }: ReportsDashboardViewProps) {
    const searchParams = useSearchParams()
    const params = { year: searchParams.get("year"), month: searchParams.get("month") }

    const handleExport = (reportType: string) => {
        alert(`Exporting ${reportType} report...`)
    }

    const financeSummary = [
        { label: "Income", value: selectedReport?.finance_summary?.totals?.totalIncome || 0 },
        { label: "Expenses", value: selectedReport?.finance_summary?.totals?.totalExpenses || 0 },
        { label: "Balance", value: selectedReport?.finance_summary?.totals?.balance || 0 },
    ]

    return (
        <div>
            {selectedReport ? (
                <div className={`p-2 grid grid-cols-1 lg:grid-cols-3 gap-2 rounded-2xl bg-slate-100`}>
                    <div className="pt-4 px-4 min-h-[50dvh] flex flex-col gap-2 rounded-lg bg-white">
                        <div>
                            <h4 className="text-sm font-semibold text-gray-900">
                                Summary
                            </h4>
                        </div>

                        <div className="h-full flex flex-col">
                            {financeSummary.map((item, index) => (
                                <React.Fragment key={item.label}>
                                    <FinanceSummaryCard label={item.label} value={item.value} />
                                    {index < financeSummary.length - 1 && (
                                        <Separator className="bg-gray-100 dark:bg-neutral-700" />
                                    )}
                                </React.Fragment>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col">
                        {/* <ReportSummaryCard
                            title="Attendance"
                            icon={Users}
                            onExport={() => handleExport("attendance")}
                            color="bg-theme-500"
                        >
                            <AttendanceChart />
                        </ReportSummaryCard> */}
                    </div>

                    {/* <ReportSummaryCard
                        title="Income"
                        icon={DollarSign}
                        change={5}
                        onExport={() => handleExport("income")}
                        color="bg-green-500"
                    >

                    </ReportSummaryCard> */}

                    <div className="p-4 flex flex-col gap-4 min-h-[50dvh] rounded-lg bg-white">
                        <div className="flex items-center gap-2">
                            <h4 className="text-sm font-semibold text-gray-900">
                                Comparison
                            </h4>
                        </div>

                        {/* <EmptyCompare /> */}
                    </div>

                    {/* <ReportSummaryCard
                        title="Expenses"
                        icon={TrendingDown}
                        onExport={() => handleExport("expenses")}
                        color="bg-red-500"
                    >
                    </ReportSummaryCard> */}

                    {/* <ReportSummaryCard
                        title="Tithes"
                        icon={Percent}
                        onExport={() => handleExport("tithes")}
                        color="bg-purple-500"
                    >
                     
                    </ReportSummaryCard> */}

                </div>
            ) : (
                <EmptyReport params={params} />
            )}
        </div>
    )
}