"use client"

import type { ReactNode } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCurrentReport, useReportDetail, useReportsOverview } from "@/features/reports/workflow/hooks"
import { Check, ChevronDown } from "lucide-react"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import View from "@/components/ui/view"
import monthlyReportStyles from "@/features/create/monthly-report/monthly-report.module.css"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { useUser } from "@/hooks/query/use-user";

export function RecordCenterShell({ children }: { children: ReactNode }) {
    const pathname = usePathname()
    const { data: user } = useUser()
    const searchParams = useSearchParams()
    const isTemplates = pathname === "/record-center/templates"
    const isMonthlyWorkspace = pathname === "/record-center" && searchParams.get("workspace") === "monthly-report"
    const requestedPeriod = searchParams.get("period")
    const validPeriod = requestedPeriod && /^\d{4}-(0[1-9]|1[0-2])$/.test(requestedPeriod) ? requestedPeriod : undefined
    const currentReport = useCurrentReport(validPeriod ? Number(validPeriod.slice(0, 4)) : undefined, validPeriod ? Number(validPeriod.slice(5)) : undefined)
    const detail = useReportDetail(Number(searchParams.get("report_id")))
    const periodValue = detail.data?.period_start.slice(0, 7) ?? validPeriod ?? currentReport.data?.period_start.slice(0, 7) ?? new Date().toISOString().slice(0, 7)
    const year = Number(periodValue.slice(0, 4))
    const overview = useReportsOverview(year)
    const reportingPeriods = Array.from({ length: 12 }, (_, month) => ({
        value: `${year}-${String(month + 1).padStart(2, "0")}`,
        label: new Date(year, month, 1).toLocaleDateString("en", { month: "long", year: "numeric" }),
    })).reverse()
    const currentPeriod = reportingPeriods.find(period => period.value === periodValue)!
    const submitted = overview.data?.months.filter(report => report.status === "submitted" || report.status === "locked").length ?? 0
    return (
        <View className={cn(pathname === "/record-center" && monthlyReportStyles.upperRegion, isMonthlyWorkspace && "mb-0 h-[calc(100dvh-var(--navbar-height))] min-h-0 overflow-hidden md:h-full md:flex-1")}>
            {!isMonthlyWorkspace && <View.Header 
                className="sm:h-auto"
                pagename={isTemplates ? "Templates" : "Record Center"}
                subpagename={isTemplates ? undefined : `${user?.assembly?.name ?? ""}`}
                description={isTemplates ? undefined : "Create and submit your monthly report."}>

                {!isTemplates && <div className="scrollbar-none flex min-w-0 items-center overflow-x-auto whitespace-nowrap py-2">
                    <MonthlyReportSplitButton
                        currentPeriod={currentPeriod}
                        periods={reportingPeriods}
                        active={pathname === "/record-center"}
                        submitted={submitted}
                    />
                </div>}
            </View.Header>}

            <View.Body className={isMonthlyWorkspace ? "min-h-0 flex-1 overflow-hidden px-3 sm:px-6" : undefined}>{children}</View.Body>
        </View>
    )
}

interface ReportingPeriod {
    value: string
    label: string
}

interface MonthlyReportSplitButtonProps {
    currentPeriod: ReportingPeriod
    periods: ReportingPeriod[]
    className?: string
    active: boolean
    submitted: number
}

export function MonthlyReportSplitButton({
    currentPeriod,
    periods,
    className,
    active,
    submitted,
}: MonthlyReportSplitButtonProps) {
    const router = useRouter()

    const openCurrentReport = () => {

        router.push(`/record-center?period=${currentPeriod.value}`)
    }

    const openPeriod = (period: ReportingPeriod) => {

        router.push(`/record-center?period=${period.value}`)
    }

    return (
        <div
            data-record-center-link
            className={cn(
                "flex h-10 items-stretch overflow-hidden rounded-xl dark:bg-neutral-900 text-foreground", 
                "bg-background dark:bg-surface",
                "border-[1.25px] border-border/75 dark:border-none", 
                "shrink-0 snap-start",
                active && "border-[1.5px] border-primary font-medium text-primary shadow-none dark:bg-primary",
                className,
            )}
        >

            <button
                type="button"
                onClick={openCurrentReport}
                aria-current={active ? "page" : undefined}
                className="flex items-center px-4 text-sm font-semibold transition-colors hover:bg-white/10 focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset cursor-pointer"
            >
                <span className="mr-3 hidden _grid size-7 place-items-center rounded-full border-2 border-current text-[10px]" aria-label={`${submitted} of 12 reports submitted`}>{submitted}/12</span>
                Monthly Report
            </button>

            <Separator
                orientation="vertical"
                className="shrink-0 data-[orientation=vertical]:h-4.5 bg-border-subtle dark:bg-neutral-800 self-center"
            />

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <button
                        type="button"
                        className="flex items-center gap-3 px-4 text-sm font-semibold transition-colors hover:bg-white/10 focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset data-[state=open]:bg-white/10"
                    >
                        <span>{currentPeriod.label}</span>

                        <ChevronDown
                            className="size-4 transition-transform duration-200 group-data-[state=open]:rotate-180"
                            strokeWidth={2}
                        />
                    </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                    align="start"
                    sideOffset={8}
                    className="max-h-80 w-56 overflow-y-auto"
                >
                    {periods.map((period) => {
                        const isCurrent =
                            period.value === currentPeriod.value

                        return (
                            <DropdownMenuItem
                                key={period.value}
                                onSelect={() => openPeriod(period)}
                                className="flex cursor-pointer items-center justify-between"
                            >
                                <span>{period.label}</span>

                                {isCurrent && (
                                    <Check
                                        className="size-4 text-primary"
                                        strokeWidth={2}
                                    />
                                )}
                            </DropdownMenuItem>
                        )
                    })}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}