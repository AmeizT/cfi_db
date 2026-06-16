"use client"

import React from "react"
import { motion } from "motion/react"
import { Button } from "@/components/ui/button"
import { useReports } from "../hooks/use-reports"
import { Separator } from "@/components/ui/separator"
import { useRouter, useSearchParams } from "next/navigation"
import { useMonthNavigation } from "@/hooks/use-month-navigation"
import { endOfMonth, format, parse, parseISO, startOfMonth } from "date-fns"

import { TithesList } from "@/features/finance/tithes/components/TitheList"
import { IconArrowLeft } from "@tabler/icons-react"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"
// import { MonthNavigator } from "../components/MonthNavigator"

// import { ReportSettings } from "../components/ReportPreferences"
// import { DashboardReportView } from "../components/DashboardView"
// import { CompactReportView } from "../components/CompactReportView"
// import ReportEmptyState from "../components/ReportEmptyState"
import CashflowStatement from "@/features/finance/cashflow/containers/CashflowStatement"
import AttendanceVisualizations from "@/features/attendance/containers/Attendance"

function DetailedReportView({ view }: { view: string; selectedDate: Date }) {
    switch (view.toLowerCase()) {
        case "attendance":
            return <AttendanceVisualizations />
        case "income":
            return <CashflowStatement />
        case "expenses":
            return <CashflowStatement />
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
    const [viewMode, setViewMode] = React.useState<"dashboard" | "consolidated">("dashboard")
    const [navigationMode, setNavigationMode] = React.useState<"arrows" | "timeline">("arrows")

    const selectedReport = reports?.find(report => format(report.period_start, "MMMM yyyy").toLowerCase() === (`${params.month} ${params.year}` || "").toLowerCase()) || null

    const isFinalized = !!selectedReport?.finalized_at

    const selectedDate = parse(`${params?.month}${params?.year}`, "MMMMyyyy", new Date())

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
                    <div className="w-full">
                        <div className="w-full flex flex-col">
                            <div className="hidden _flex items-center gap-4">
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

                            <div className="w-full flex justify-between items-center gap-2">
                                <div data-testid="report-filters">
                                    <Button variant="outline" className="py-0 gap-0 h-7 rounded-full border-dashed shadow-none bg-transparent hover:bg-slate-50 dark:bg-neutral-800 transition-colors text-xs text-muted-foreground">
                                        Date Range
                                        <div className="flex items-center">
                                            <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-3 bg-gray-300 dark:bg-neutral-700" />
                                            <span className="capitalize text-primary font-semibold">{params.month} {params.year}</span>
                                        </div>
                                    </Button>
                                </div>

                                <div className="flex gap-2">
                                    <Button variant="outline">Edit report</Button>
                                        {/* <ReportSettings
                                            viewMode={viewMode}
                                            navigationMode={navigationMode}
                                            onViewModeChange={setViewMode}
                                            onNavigationModeChange={setNavigationMode}
                                        /> */}
                                </div>
                            </div>
                        </div>

                        {/* <MonthNavigator mode={"timeline"} /> */}

                        <div id="report-content">
                            {/* {selectedReport ? (
                                (viewMode === "dashboard" ? 
                                    <DashboardReportView selectedReport={selectedReport} /> 
                                    : <CompactReportView params={params} />
                                )
                            ) : (
                                <ReportEmptyState params={params} />
                            )} */}
                        </div>
                    </div>
                </div>
            )}
        </React.Fragment>
    )
}

