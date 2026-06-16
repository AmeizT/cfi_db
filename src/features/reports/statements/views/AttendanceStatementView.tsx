"use client"

import React from "react"
import { useSearchParams } from "next/navigation"
import AttendanceView from "../../attendance/views/AttendanceDataGrid"
import { useReportAttendance } from "../../core/hooks/use-attendance"
import StatementsLayout from "../layouts/StatementsLayout"
import { AttendanceAnalytics } from "../containers/AttendanceAnalytics";

// function ReportContext({ tab, isLoading, attendance, finance }: ReportContextProps) {
//     const TAB_COMPONENTS: Record<string, React.ReactNode> = {
//         attendance: <AttendanceView attendance={attendance} isLoading={isLoading} />,
//         cashflow: <CashFlowView cashflow={finance?.cashflow} isLoading={isLoading} />,
//         tithes: <TithesView tithes={finance?.tithes} isLoading={isLoading} />,
//     }

//     return TAB_COMPONENTS[tab] ?? <EmptyState type="reports" />
// }

export default function AttendanceStatementView() {
    const searchParams = useSearchParams()
    const pkey = searchParams.get("reportid") ?? undefined
    const queryParams = Object.fromEntries(searchParams.entries())
    const { data: attendance, isLoading } = useReportAttendance(String(pkey))
    
    

    return (
        <StatementsLayout page="Attendance">
            <React.Fragment>
                {queryParams.tab === "monthly" ? (
                    <AttendanceView 
                        attendance={attendance} 
                        isLoading={isLoading} 
                    />
                ) : (
                    <AttendanceAnalytics />
                )}
            </React.Fragment>
        </StatementsLayout>
    )
}
