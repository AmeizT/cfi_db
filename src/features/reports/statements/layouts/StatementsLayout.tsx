"use client"

import React from "react"
import { usePathname, useSearchParams } from "next/navigation"
import AttendanceView from "../../attendance/views/AttendanceDataGrid"
import View from "@/components/ui/view"
import { AttendanceResponse } from "@/dal/types"
import TithesView from "../../finance/tithes/TithesView"
import CashFlowView from "../../finance/cashflow/CashflowView"
import { FinanceResponse } from "../../core/services/get-report-finance"
import { useReportAttendance } from "../../core/hooks/use-attendance"
import { EmptyState } from "@/components/ui/empty-state"
import { useReportFinance } from "../../core/hooks/use-report-finance"
import { getPageTabs } from "@/layouts/navigation/config/get-page-tabs"
import { StatementsLabel } from "../components/StatementsLabel";
import { StatementsAction } from "../components/StatementsAction";

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

type Props = {
    children: React.ReactNode
    page: string
}

export default function StatementsLayout({ children, page }: Props) {
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const reportId = searchParams.get("id") ?? undefined
    const tab = (searchParams.get("tab") as "monthly" | "analytics") ?? "monthly"
    
    const queryParams = Object.fromEntries(searchParams.entries())
    
    const { data: attendance } = useReportAttendance(reportId as unknown as string)
    const { data: finance } = useReportFinance(reportId as unknown as string)
    
    const tabs = getPageTabs("stats", {
        reportPage: "attendance",
        searchParams,
    })

    
    const isEmptyByTab: Record<ReportTabKey, boolean> = {
        attendance: (attendance?.data?.length ?? 0) === 0,
        cashflow: (finance?.cashflow?.data?.rows?.length ?? 0) === 0,
        tithes: (finance?.tithes?.data?.length ?? 0) === 0,
    }

    const isEmpty = isEmptyByTab[tab as ReportTabKey]

    return (
        <View className="flex flex-col">
            <View.Header 
                pagename={<StatementsLabel tab={tab} label={page} />} 
                actions={<StatementsAction />}
                pathname={pathname} 
            />

            <View.TabBar 
                items={tabs} 
                activeKey={tab} 
                variant={queryParams.tab === "monthly" ? "report" : "default"}
            />

            <View.Body className="gap-4 pt-4">
                {isEmpty ? (
                    <EmptyState
                        type={"reports"}
                        variant="both"
                        context={{ label: tab }}
                    />
                ) : (
                    <React.Fragment>
                        {children}
                    </React.Fragment>
                )}
            </View.Body>
        </View>
    )
}
