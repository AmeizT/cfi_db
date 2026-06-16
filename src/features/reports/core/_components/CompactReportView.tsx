"use client"

import { format } from "date-fns"
import { useReports } from "../hooks/use-reports"
import { useSearchParams } from "next/navigation"
// import { TithesList } from "@/features/finance/tithes/components/TitheList"
import CashflowStatement from "@/features/finance/cashflow/containers/CashflowStatement"

interface CompactReportViewProps {
    params: {
        month: string | null
        year: string | null
    }
}

export function CompactReportView({ params }: CompactReportViewProps) {
    const searchParams = useSearchParams()
    const year = searchParams.get("year") || new Date().getFullYear()
    const { data: reports } = useReports({ year: String(year) }) 

    const selectedReport = reports?.find(report => format(report.period_start, "MMMM yyyy").toLowerCase() === (`${params.month} ${params.year}` || "").toLowerCase()) || null
    
    const isFinalized = !!selectedReport?.finalized_at

    console.log(isFinalized)

    // const selectedDate = parse(`${params?.month}${params?.year}`, "MMMMyyyy", new Date())

    // const COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))"]

    return (
        <div className="w-full flex gap-4">
            <div className="w-full space-y-8">
                <CashflowStatement />
            </div>

            <div className="hidden w-1/4"></div>
        </div>
    )
}

interface ReportSectionHeaderProps {
    title: string
    description?: string
}

interface ReportSectionProps extends ReportSectionHeaderProps {
    children: Readonly<React.ReactNode>
}

export function ReportSection({ children, title, description }: ReportSectionProps){
    return (
        <div className="p-1 rounded-[20px] bg-slate-100/60">
            <ReportSectionHeader
                title={title}
                description={description}
            />

            <div className="pt-4 px-4 bg-white border border-slate-200 rounded-2xl">
                {children}
            </div>
        </div>
    )
}

function ReportSectionHeader({ title, description }: ReportSectionHeaderProps) {
    return (
        <div className="px-4 py-3 pb-2">
            <h3 className="text-xl font-bold">
                {title}
            </h3>

            <small className="hidden text-sm text-slate-500">
                {description}
            </small>
        </div>
    )
}
