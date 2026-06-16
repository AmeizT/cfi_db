"use client"

import React from "react"
import { usePathname, useSearchParams } from "next/navigation"
import { useReportAttendance } from "../hooks/use-attendance"
import { useReportFinance } from "../hooks/use-report-finance"
import AttendanceView from "../../attendance/views/AttendanceDataGrid"
import View from "@/components/ui/view"
import { AttendanceResponse } from "@/dal/types"
import { FinanceResponse } from "../services/get-report-finance"
import { reportTabs } from "@/layouts/navigation/menu/tabs"
import { QueryParams } from "@/layouts/navigation/types"
import TithesView from "../../finance/tithes/TithesView"
import { useUser } from "@/hooks/query/use-user"
import { formatCurrency } from "@/utils"
import { Button } from "@/components/ui/button"
import CashflowView from "../../finance/cashflow/CashflowView"
import { User } from "@/features/auth/schemas/user"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { Flex } from "@/components/ui/box"
import { InformationSquareIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

interface ReportContextProps {
    isLoading: boolean
    tab: string 
    attendance: AttendanceResponse | undefined
    finance: FinanceResponse | undefined
}

function ReportContext({ tab, isLoading, attendance, finance }: ReportContextProps) {
    const TAB_COMPONENTS: Record<string, React.ReactNode> = {
        attendance: <AttendanceView attendance={attendance} isLoading={isLoading} />,
        cashflow: <CashflowView cashflow={finance?.cashflow} isLoading={isLoading} />,
        tithes: <TithesView tithes={finance?.tithes} isLoading={isLoading} />,
    }

    return TAB_COMPONENTS[tab] ?? "attendance data"
}

type ReportTabKey = "attendance" | "cashflow" | "tithes"

interface PageMeta {
    value?: string | number
    type: "text" | "currency"
    tooltip?: string
}

interface PagenameProps {
    tab: ReportTabKey
    meta?: PageMeta
    user?: User
}

function PageName({ tab, meta, user }: PagenameProps){
    function intlCurrency(value: number) {
        return formatCurrency(value, {
            language: user?.assembly?.language,
            currency: user?.assembly?.currency
        })
    }

    const formattedTab = tab === "cashflow" ? "Cash flow" : tab

    return (
        <Flex justify="center" gap={3}>
            {formattedTab} statement
            {meta?.value !== undefined && meta?.value !== null && meta.value !== "" ? (
                <Flex gap={3} justify={"center"}>
                    <span className="text-muted font-normal font-mono text-3xl tracking-tighter">
                        {meta.type === "currency" ? (
                            intlCurrency(Number(meta.value ?? 0))
                        ) : (
                            meta.value
                        )}
                    </span>

                    <HoverCard>
                        <HoverCardTrigger>
                            <HugeiconsIcon icon={InformationSquareIcon} strokeWidth={2} className="size-5 text-muted" />
                        </HoverCardTrigger>
                        <HoverCardContent className="text-[13px]">
                            {meta.tooltip}
                        </HoverCardContent>
                    </HoverCard>
                </Flex>
            ) : null}
        </Flex>
    )
}

function PageAction({ tab }: {tab: ReportTabKey}) {
    return (
        <Button className="h-9 rounded-[11px] bg-linear-to-b from-indigo-500 to-indigo-500">
            Create {tab}
        </Button>
    )
}

export function ReportDetailsView() {
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const reportId = searchParams.get("report_id") ?? undefined
    const tab = (searchParams.get("tab") as ReportTabKey) ?? "attendance"
    const { data: user } = useUser()
    const { data: attendance } = useReportAttendance(reportId as unknown as string)
    const { data: finance, isLoading } = useReportFinance(reportId as unknown as string)
    const _reportTabs = reportTabs(searchParams as unknown as QueryParams)

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
        <View className="flex flex-col gap-0">
            <View.Header 
                pagename={<PageName tab={tab} meta={meta} user={user || undefined} />} 
                actions={<PageAction tab={tab} />}
                pathname={pathname} 
                tabs={_reportTabs} 
                activeTab={tab}
            />

            <View.Body>
                <ReportContext
                    tab={tab}
                    attendance={attendance}
                    finance={finance}
                    isLoading={isLoading}
                />
            </View.Body>
        </View>
    )
}
