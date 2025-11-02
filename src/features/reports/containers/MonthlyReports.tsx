"use client"

import React from "react"
import { motion } from "motion/react"
import { Button } from "@/components/ui/button"
import { useReports } from "../hooks/use-reports"
import { Separator } from "@/components/ui/separator"
import { useRouter, useSearchParams } from "next/navigation"
import { ReportSummaryCard } from "../components/ReportSummaryCard"
import { Plus, TrendingDown, Users, DollarSign, Percent } from "lucide-react"
import { useMonthNavigation } from "@/hooks/use-month-navigation"
import { endOfMonth, format, parse, parseISO, startOfMonth } from "date-fns"
import { formatCurrency } from "@/utils"
import { AttendanceChart } from "../components/AttendanceChart"
import EmptyReport from "../components/EmptyReport"
import EmptyCompare from "../components/EmptyCompare"
import { TithesList } from "@/features/finance/tithes/components/TitheList"
import { IconArrowLeft } from "@tabler/icons-react"
import { WalletContainer } from "@/features/finance/wallet/containers/WalletContainer"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"
import { MonthNavigator } from "../components/MonthNavigator"
import { AttendanceTable } from "@/features/attendance/components/AttendanceTable"

function DetailedReportView({ view, selectedDate }: { view: string; selectedDate: Date }) {
    switch (view.toLowerCase()) {
        case "attendance":
            return <AttendanceTable />
        case "income":
            return <WalletContainer reportDate={selectedDate} />
        case "expenses":
            return <WalletContainer reportDate={selectedDate} />
        case "tithes":
            return <TithesList />
        default:
            return null
    }
}

export default function MonthlyReports(){
    const router = useRouter()
    const searchParams = useSearchParams()
    const year = searchParams.get("year") || new Date().getFullYear()
    const section = searchParams.get("section") || ""
    const { data: reports, isLoading } = useReports({ year: String(year) }) 
    const params = { year: searchParams.get("year"), month: searchParams.get("month")}
    const { formattedDate } = useMonthNavigation(params)
    // const [navigationMode, setNavigationMode] = React.useState<"arrows" | "timeline">("arrows")
    // const [selectedMonth, setSelectedMonth] = React.useState(5)

    const selectedReport = reports?.find(report => format(report.period_start, "MMMM yyyy").toLowerCase() === (`${params.month} ${params.year}` || "").toLowerCase()) || null

    const isFinalized = !!selectedReport?.finalized_at

    const locale = {
        language: selectedReport?.finance_summary?.locale?.language,
        currency: selectedReport?.finance_summary?.locale?.currency
    }

    const selectedDate = parse(`${params?.month}${params?.year}`, "MMMMyyyy", new Date())

    const handleExport = (reportType: string) => {
        alert(`Exporting ${reportType} report...`)
    }

    interface FinanceSummaryCardProps {
        label: string
        value: number
    }

    const financeSummary = [
        // { label: "Tithes", value: selectedReport?.finance_summary?.totals?.totalTithes || 0 },
        { label: "Income", value: selectedReport?.finance_summary?.totals?.totalIncome || 0 },
        { label: "Expenses", value: selectedReport?.finance_summary?.totals?.totalExpenses || 0 },
        { label: "Balance", value: selectedReport?.finance_summary?.totals?.balance || 0 },
        // { label: "Book Balance", value: selectedReport?.finance_summary?.totals?.bookBalance || 0 },
        // { label: "Expense to Income Ratio", value: selectedReport?.finance_summary?.totals?.expenseToIncomeRatio || 0 },
    ]

    function FinanceSummaryCard({ label, value }: FinanceSummaryCardProps) {
        return (
            <div className="h-full flex flex-col justify-center">
                <h2 className="text-[1.75rem] font-bold font-geist">
                    {formatCurrency(locale?.language || "en-US", locale?.currency || "USD", value)}
                </h2>

                <small className="text-sm text-muted-foreground font-medium">
                    {label}
                </small>
            </div>
        )
    }

    if(isLoading){
        return (
            <div className="h-full w-full grid place-content-center">
                <Spinner />
            </div>
        )
    }

    return (
        <React.Fragment>
            {section ? (
                <div className="w-full h-fit flex flex-col gap-6">
                    <header className="flex items-center gap-3">
                        <motion.div
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            transition={{
                                type: "spring",
                                stiffness: 400,
                                damping: 20,
                                mass: 0.8,
                            }}
                            className="relative inline-flex"
                        >
                            <button 
                            onClick={() => router.back()}
                            className="group relative flex items-center justify-center size-8 rounded-full bg-gray-100 dark:bg-neutral-700 overflow-hidden">
                                <motion.div
                                    className="absolute inset-0 rounded-full bg-gray-100 dark:bg-neutral-700"
                                    whileHover={{ scale: 1.2 }}
                                    transition={{
                                        type: "spring",
                                        stiffness: 300,
                                        damping: 18,
                                        mass: 0.7
                                    }}
                                />

                                <motion.div
                                    className="relative z-10"
                                    whileHover={{ opacity: 1 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <IconArrowLeft className="size-5 text-gray-400 group-hover:text-gray-800 transition-colors duration-200" />
                                </motion.div>

                                <span className="sr-only">Back</span>
                            </button>
                        </motion.div>

                        <h3 className="text-2xl capitalize font-bold">{section}</h3>
                    </header>

                    <DetailedReportView view={section} selectedDate={selectedDate} />
                </div>
            ) : (
                <div className="mb-8 min-h-full w-full flex flex-col">
                    <div className="hidden bg-white border-b border-gray-200">
                        <div className="max-w-7xl mx-auto py-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
                                </div>

                                <button
                                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                                    onClick={() => alert("Create new report")}>
                                    <Plus className="w-5 h-5" />
                                    New Report
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="w-full">
                        <div className="w-full flex flex-col">
                            <div className="flex items-center gap-4">
                                <h4 className="text-[1.75rem] font-bold text-neutral-800">
                                    <time dateTime={format(startOfMonth(parseISO(formattedDate)), "yyyy-MM-dd")}>
                                        {format(endOfMonth(parseISO(formattedDate)), "MMM yyyy")}
                                    </time>
                                </h4>

                                <Badge className={`h-6 flex items-center rounded-full ${isFinalized ? "bg-emerald-100 text-emerald-800" : "bg-yellow-100 text-yellow-800"}`}>
                                    {isFinalized ? "Finalized" : "Draft"}
                                </Badge>

                                <div className="flex items-center gap-1">
                                    {/* <MonthNavigatorButton
                                        href={`/reports/monthly?month=${prevMonth.month}&year=${prevMonth.year}`}
                                        direction={"previous"}
                                        disabled={prevMonth.isDisabled}
                                        variant="arrows"
                                    />

                                    <MonthNavigatorButton
                                        href={`/reports/monthly?month=${nextMonth.month}&year=${nextMonth.year}`}
                                        direction={"next"}
                                        disabled={nextMonth.isDisabled}
                                        variant="arrows"
                                    /> */}
                                </div>
                            </div>

                            <div className="pt-4 pb-4 w-full flex justify-between items-center gap-2">
                                <div data-testid="report-filters">
                                    <Button variant="outline" className="py-0 gap-0 h-7 rounded-full border-dashed shadow-none bg-transparent hover:bg-slate-50 dark:bg-neutral-800 transition-colors text-xs text-muted-foreground">
                                        Date Range
                                        <div className="flex items-center">
                                            <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-3 bg-gray-300 dark:bg-neutral-700" />
                                            <span className="capitalize text-primary font-semibold">{params.month} {params.year}</span>
                                        </div>
                                    </Button>
                                </div>

                                <div>
                                    <Button variant="outline">Edit report</Button>
                                </div>
                            </div>
                        </div>

                        <MonthNavigator mode={"timeline"} />

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
                                    <ReportSummaryCard
                                        title="Attendance"
                                        icon={Users}
                                        // value={reportData.attendance.total.toString()}
                                        // subValue={`Avg: ${reportData.attendance.average} per service`}
                                        // change={reportData.attendance.change}
                                        // trend={reportData.attendance.trend}
                                        // onViewDetails={() => setActiveDetailView("attendance")}
                                        onExport={() => handleExport("attendance")}
                                        color="bg-blue-500"
                                    >
                                        <AttendanceChart />
                                    </ReportSummaryCard>
                                </div>

                                <ReportSummaryCard
                                    title="Income"
                                    icon={DollarSign}
                                    // value={formatCurrency(reportData.income.total)}
                                    change={5}
                                    // trend={reportData.income.trend}
                                    // onViewDetails={() => setActiveDetailView("income")}
                                    onExport={() => handleExport("income")}
                                    color="bg-green-500"
                                >
                                    <div></div>
                                </ReportSummaryCard>

                                <div className="p-4 flex flex-col gap-4 min-h-[50dvh] rounded-lg bg-white">
                                    <div className="flex items-center gap-2">
                                        <h4 className="text-sm font-semibold text-gray-900">
                                            Comparison
                                        </h4>

                                        {/* <HoverCard>
                                <HoverCardTrigger>
                                    test
                                </HoverCardTrigger>
                                <HoverCardContent className="w-80">
                                    <div className="flex justify-between gap-4">

                                        <div className="space-y-1">
                                            <h4 className="text-sm font-semibold">@nextjs</h4>
                                            <p className="text-sm">
                                                The React Framework – created and maintained by @vercel.
                                            </p>
                                            <div className="text-muted-foreground text-xs">
                                                Joined December 2021
                                            </div>
                                        </div>
                                    </div>
                                </HoverCardContent>
                            </HoverCard> */}
                                    </div>

                                    <EmptyCompare />
                                </div>

                                <ReportSummaryCard
                                    title="Expenses"
                                    icon={TrendingDown}
                                    // value={formatCurrency(reportData.expenses.total)}
                                    // change={reportData.expenses.change}
                                    // trend={reportData.expenses.trend}
                                    // onViewDetails={() => setActiveDetailView("expenses")}
                                    onExport={() => handleExport("expenses")}
                                    color="bg-red-500"
                                >
                                    <div></div>
                                </ReportSummaryCard>

                                <ReportSummaryCard
                                    title="Tithes"
                                    icon={Percent}
                                    // value={formatCurrency(reportData.tithes.total)}
                                    // subValue={`Remittance: ${formatCurrency(reportData.tithes.remittance)}`}
                                    // change={reportData.tithes.change}
                                    // trend={reportData.tithes.trend}
                                    // onViewDetails={() => setActiveDetailView("tithes")}
                                    onExport={() => handleExport("tithes")}
                                    color="bg-purple-500"
                                >
                                    <div></div>
                                </ReportSummaryCard>

                            </div>
                        ) : (
                            <EmptyReport params={params} />
                        )}
                    </div>
                </div>
            )}
        </React.Fragment>
    )
}

