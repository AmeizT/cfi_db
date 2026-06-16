"use client"

import React from "react"
import { usePathname, useSearchParams } from "next/navigation"
import AttendanceView from "../../attendance/views/AttendanceDataGrid"
import View from "@/components/ui/view"
import { AttendanceResponse } from "@/dal/types"
import TithesView from "../../finance/tithes/TithesView"
import { Button } from "@/components/ui/button"
import CashFlowView from "../../finance/cashflow/CashflowView"
import { Flex } from "@/components/ui/box"
import { FinanceResponse } from "../../core/services/get-report-finance"
import { useReportAttendance } from "../../core/hooks/use-attendance"
import { parseTab } from "@/utils/parse-tab"
import { ChevronDown, Plus } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { EmptyState } from "@/components/ui/empty-state"
import { PeriodSelector } from "../components/PeriodSelector"
import { ReportNavigator } from "../components/ReportNavigator"
import { useReportFinance } from "../../core/hooks/use-report-finance"
import { getStatementTabs } from "@/layouts/navigation/pages/statement.tabs"

interface ReportContextProps {
    isLoading: boolean
    tab: string 
    attendance: AttendanceResponse | undefined
    finance: FinanceResponse | undefined
}

function ReportContext({ tab, isLoading, attendance, finance }: ReportContextProps) {
    const TAB_COMPONENTS: Record<string, React.ReactNode> = {
        attendance: <AttendanceView attendance={attendance} isLoading={isLoading} />,
        cashflow: <CashFlowView cashflow={finance?.cashflow} isLoading={isLoading} />,
        tithes: <TithesView tithes={finance?.tithes} isLoading={isLoading} />,
    }

    return TAB_COMPONENTS[tab] ?? <EmptyState type="reports" />
}

type ReportTabKey = "attendance" | "cashflow" | "tithes"

interface PageMeta {
    value?: string | number
    type: "text" | "currency"
    tooltip?: string
}

function PageName({ tab }: { tab: ReportTabKey }){
    const formattedTab = tab === "cashflow" ? "Income & Expenditure" : tab

    return (
        <h2>
            {`${formattedTab}`}
        </h2>
    )
}

function PageAction({ tab }: {tab: ReportTabKey, year: string | undefined}) {
    return (
        <Flex gap={2}>
            <PeriodSelector />

            <Flex align="center" className="h-10 relative z-20 bg-linear-to-b from-indigo-500 to-indigo-600 rounded-xl">
                <Button className="has-[>svg]:px-3 h-full gap-1 rounded-none rounded-l-xl bg-transparent hover:bg-theme-600">
                    <Plus className="size-4" /> Create {tab}
                </Button>

                <Separator orientation="vertical" className="data-[orientation=vertical]:h-3/5 bg-theme-400" />

                <Button className="size-10 flex justify-center items-center rounded-none rounded-r-xl bg-transparent hover:bg-linear-to-b from-indigo-600 to-indigo-700">
                    <ChevronDown />
                </Button>
            </Flex>
        </Flex>
    )
}

export default function ReportStatementView() {
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const reportId = searchParams.get("id") ?? undefined
    const activeTab = (searchParams.get("tab") as ReportTabKey) ?? "attendance"
    const { main: tab } = parseTab(activeTab)
    
    const currentYear = new Date().getFullYear().toString()
    const period = searchParams.get("period") ?? currentYear
    const { sub: year } = parseTab(period)

    const { data: attendance } = useReportAttendance(reportId as unknown as string)
    const { data: finance, isLoading } = useReportFinance(reportId as unknown as string)
    
    const statementTabs = getStatementTabs(searchParams)
    
    const isEmptyByTab: Record<ReportTabKey, boolean> = {
        attendance: (attendance?.data?.length ?? 0) === 0,
        cashflow: (finance?.cashflow?.data?.rows?.length ?? 0) === 0,
        tithes: (finance?.tithes?.data?.length ?? 0) === 0,
    }

    const isEmpty = isEmptyByTab[tab as ReportTabKey]

    const meta = React.useMemo<PageMeta>(() => {
        switch (tab) {
            case "cashflow":
                return {
                    value: finance?.cashflow?.data?.totals?.balance,
                    type: "currency",
                    tooltip: "Net cash flow for the selected period: total income minus total expenses. A positive value indicates surplus; a negative value indicates a deficit."
                }

            case "tithes":
                return {
                    value: finance?.tithes?.meta?.tithes_auto_sum,
                    type: "currency",
                    tooltip: "Sum of all tithes recorded for this period. This value is calculated automatically from submitted entries.",
                }

            case "attendance":
                return {
                    value: attendance?.meta?.attendance_auto_sum,
                    type: "text",
                    tooltip: "Total number of attendees recorded across all services in this period. This value is auto-calculated.",
                }

            default:
                return {
                    value: "",
                    type: "text",
                }
        }
    }, [tab, finance, attendance])

    return (
        <View className="flex flex-col">
            <View.Header 
                pagename={
                    <PageName 
                        tab={tab as ReportTabKey} 
                    />
                } 
                actions={
                    <PageAction 
                        tab={tab as ReportTabKey} 
                        year={year}
                    />
                }
                pathname={pathname} 
                tabs={statementTabs} 
                activeTab={tab}
            />

            <View.Body className="gap-4 ">
                <ReportNavigator />

                {isEmpty ? (
                    <EmptyState
                        type={"reports"}
                        variant="both"
                        context={{ label: tab }}
                    />
                ) : (
                    <ReportContext
                        tab={tab}
                        attendance={attendance}
                        finance={finance}
                        isLoading={isLoading}
                    />
                )}
            </View.Body>
        </View>
    )
}


// http://localhost:3000/reports/statements?period=year%3A2026&report_id=37&tab=tithes&view=summary&q=1

// http://localhost:3000/reports/statements?period=year%3A2026&report_id=37&tab=attendance%3Asunday&view=month&q=1
