"use client"

import View from "@/components/ui/view"
import { parseTab } from "@/utils/parse-tab"
import { usePathname, useSearchParams } from "next/navigation"
import { getAnalyticsTabs } from "@/layouts/navigation/pages/analytics.tabs"
import { AnalyticsDashboard } from "../components/AnalyticsDashboard"
import { useAttendanceConfig } from "../config/attendance"
import { useTithesConfig } from "../config/tithes"
import { useCashflowConfig } from "../config/cashflow"
import { 
    useAttendanceAnalytics, 
    useCashflowAnalytics, 
    useTithesAnalytics 
} from "../../core/hooks/use-analytics"

type ReportTabKey = "attendance" | "cashflow" | "tithes"

function Placeholder() {
    return (
        <div className="p-10 border rounded-md text-center text-gray-500">
            Analytics content coming soon!
        </div>
    )
}

const formatStatements = (
    statements?: {
        report_id?: string
        month: string
        label?: string
    }[]
) => {
    return (
        statements?.map((s) => ({
            ...s,
            id: s.report_id ?? s.month,
            label: s.label?.slice(0, 3),
        })) ?? []
    )
}

function AnalyticsContext({ tab }: { tab: ReportTabKey }) {
    const searchParams = useSearchParams()
    const currentYear = new Date().getFullYear().toString()
    const period = searchParams.get("period") ?? currentYear
    const { sub: year } = parseTab(period)
    const { data: tithesAnalytics } = useTithesAnalytics(year ?? currentYear)
    const { data: attendanceAnalytics } = useAttendanceAnalytics(year ?? currentYear)
    const { data: cashflowAnalytics } = useCashflowAnalytics(year ?? currentYear)

    type AnalyticsKey = "attendance" | "cashflow" | "tithes"

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const analyticsStatements: Record<AnalyticsKey, any> = {
        attendance: attendanceAnalytics,
        cashflow: cashflowAnalytics,
        tithes: tithesAnalytics,
    }

    const statements: Record<AnalyticsKey, ReturnType<typeof formatStatements>> =
        Object.fromEntries(
            (Object.keys(analyticsStatements) as AnalyticsKey[]).map((key) => [
                key,
                formatStatements(analyticsStatements[key]?.data?.statements),
            ])
        ) as Record<AnalyticsKey, ReturnType<typeof formatStatements>>

    const bestMonth = tithesAnalytics?.meta?.insights?.best_month?.month

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function getBestMonthIndex(data: any[] | undefined) {
        if (!bestMonth || !data) return -1
        return data.findIndex((s) => s.month === bestMonth)
    }
    
    const TAB_COMPONENTS: Record<string, React.ReactNode> = {
        attendance: (
            <AnalyticsDashboard 
                data={statements.attendance} 
                config={useAttendanceConfig()} 
                activeIndex={getBestMonthIndex([])} 
            />
        ),

        cashflow: (
            <AnalyticsDashboard 
                data={statements.cashflow} 
                config={useCashflowConfig()} 
                activeIndex={getBestMonthIndex(statements.cashflow)} 
            />
        ),

        tithes: (
            <AnalyticsDashboard 
                data={statements.tithes} 
                config={useTithesConfig()} 
                activeIndex={getBestMonthIndex(statements.tithes)} 
            />
        ),
    }

    return TAB_COMPONENTS[tab] ?? <Placeholder />
}

export function ReportAnalyticsView() {
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const activeTab = (searchParams.get("tab") as ReportTabKey) ?? "attendance"
    const { main: tab } = parseTab(activeTab) as { main: ReportTabKey }
    const analyticsTabs = getAnalyticsTabs(searchParams)

    return (
        <View className="gap-0">
            <View.Header 
                pagename={tab + " Analytics"} 
                pathname={pathname} 
                tabs={analyticsTabs} 
                activeTab={tab}
            />

            <View.Body>
                <AnalyticsContext tab={tab} />
            </View.Body>
        </View>
    )
}