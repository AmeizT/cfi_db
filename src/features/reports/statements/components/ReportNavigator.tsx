"use client"

import * as React from "react"
import {
    usePathname,
    useRouter,
    useSearchParams,
    type ReadonlyURLSearchParams,
} from "next/navigation"
import {
    CalendarDays,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Spinner } from "@/components/ui/spinner"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import type { AssemblyReport } from "@/dal/types"
import { parsePeriod } from "@/layouts/navigation/helpers/parse-period"
import { cn } from "@/lib/utils"
import { useReports } from "../../core/hooks/use-reports"
import {
    ALL_REPORTS_PAGE_SIZE,
    createReportSelectionQuery,
    getReportPeriod,
    getReportPeriodKey,
    getReportRows,
    sortReportsByPeriod,
} from "../../core/lib/report-selection"
import { MONTHS, SHORT_MONTHS } from "../config/months"
import { yearOptions } from "./PeriodSelector"

type ReportVisualStatus = "completed" | "in-progress" | "overdue" | "not-started"

type ReportWithStatusFields = AssemblyReport & {
    status?: unknown
    state?: unknown
    report_status?: unknown
    submission_status?: unknown
    submitted_at?: unknown
    is_submitted?: unknown
}

const REPORT_STATUS_META: Record<
    ReportVisualStatus,
    { label: string; dotClassName: string }
> = {
    completed: {
        label: "Completed",
        dotClassName: "bg-emerald-500",
    },
    "in-progress": {
        label: "In progress",
        dotClassName: "bg-amber-500",
    },
    overdue: {
        label: "Overdue",
        dotClassName: "bg-red-500",
    },
    "not-started": {
        label: "Not started",
        dotClassName: "bg-muted-foreground/35",
    },
}

function getNavigatorYear(searchParams: ReadonlyURLSearchParams) {
    const period = parsePeriod(searchParams.get("period") || "")

    if (period?.type === "year" && Number.isFinite(period.value)) {
        return Number(period.value)
    }

    const year = Number(searchParams.get("year"))
    return Number.isFinite(year) && year > 0 ? year : new Date().getFullYear()
}

function getReportVisualStatus(report?: AssemblyReport): ReportVisualStatus {
    if (!report) return "not-started"

    const candidate = report as ReportWithStatusFields
    const rawStatus = [
        candidate.status,
        candidate.state,
        candidate.report_status,
        candidate.submission_status,
    ].find((value) => typeof value === "string")

    const normalized = typeof rawStatus === "string"
        ? rawStatus.toLowerCase().replaceAll("_", "-").trim()
        : ""

    if (
        candidate.is_submitted === true
        || Boolean(candidate.submitted_at)
        || ["completed", "complete", "submitted", "approved"].some((value) => normalized.includes(value))
    ) {
        return "completed"
    }

    if (["overdue", "late", "past-due"].some((value) => normalized.includes(value))) {
        return "overdue"
    }

    if (["not-started", "not started", "unstarted"].some((value) => normalized.includes(value))) {
        return "not-started"
    }

    return "in-progress"
}

function NavigatorButton({
    direction,
    disabled,
    onClick,
}: {
    direction: "previous" | "next"
    disabled: boolean
    onClick: () => void
}) {
    const isPrevious = direction === "previous"

    return (
        <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={`${isPrevious ? "Previous" : "Next"} reporting period`}
            disabled={disabled}
            onClick={onClick}
            className={cn(
                "size-8 rounded-none bg-background shadow-elevation-sm",
                isPrevious ? "rounded-full" : "rounded-full",
            )}
        >
            {isPrevious ? <ChevronLeft /> : <ChevronRight />}
        </Button>
    )
}

export function ReportNavigator() {
    const pathname = usePathname()
    const router = useRouter()
    const searchParams = useSearchParams()
    const selectedYear = getNavigatorYear(searchParams)
    const [open, setOpen] = React.useState(false)
    const [viewYear, setViewYear] = React.useState(selectedYear)
    const yearsScrollerRef = React.useRef<HTMLDivElement>(null)
    const selectedYearRef = React.useRef<HTMLButtonElement>(null)

    const { data: selectedYearReports, isLoading } = useReports({
        year: String(selectedYear),
        pageSize: 100,
    })
    const { data: viewedYearReports } = useReports({
        year: String(viewYear),
        pageSize: 100,
    })
    const { data: allReports } = useReports({
        year: undefined,
        pageSize: ALL_REPORTS_PAGE_SIZE,
        enabled: true,
    })

    const selectedReports = React.useMemo(
        () => sortReportsByPeriod(getReportRows(selectedYearReports)),
        [selectedYearReports],
    )
    const viewedReports = React.useMemo(
        () => sortReportsByPeriod(getReportRows(viewedYearReports)),
        [viewedYearReports],
    )
    const allReportRows = React.useMemo(
        () => sortReportsByPeriod(getReportRows(allReports)),
        [allReports],
    )
    const availableYears = React.useMemo(
        () => Array.from(new Set([
            selectedYear,
            ...yearOptions.map((option) => option.year),
            ...allReportRows.map((report) => getReportPeriod(report)!.year),
        ])).sort((left, right) => left - right),
        [allReportRows, selectedYear],
    )

    const reportByPeriod = React.useMemo(() => {
        const reports = allReportRows.length > 0 ? allReportRows : selectedReports

        return new Map(
            reports.map((report) => {
                const { month, year } = getReportPeriod(report)!
                return [getReportPeriodKey(year, month), report]
            }),
        )
    }, [allReportRows, selectedReports])

    const activeReport = React.useMemo(() => {
        const reportId = searchParams.get("reportId")
        return selectedReports.find((report) => String(report.id) === reportId)
    }, [searchParams, selectedReports])

    const displayedReport = activeReport ?? selectedReports.at(-1)
    const displayedPeriod = displayedReport
        ? getReportPeriod(displayedReport)!
        : { month: new Date().getMonth(), year: selectedYear }
    const displayedLabel = `${MONTHS[displayedPeriod.month]} ${displayedPeriod.year}`
    const displayedStatus = getReportVisualStatus(displayedReport)
    const displayedStatusMeta = REPORT_STATUS_META[displayedStatus]

    const previousDate = new Date(displayedPeriod.year, displayedPeriod.month - 1, 1)
    const nextDate = new Date(displayedPeriod.year, displayedPeriod.month + 1, 1)
    const previousReport = reportByPeriod.get(
        getReportPeriodKey(previousDate.getFullYear(), previousDate.getMonth()),
    )
    const nextReport = reportByPeriod.get(
        getReportPeriodKey(nextDate.getFullYear(), nextDate.getMonth()),
    )

    const currentReport = React.useMemo(() => {
        const now = new Date()
        const exact = reportByPeriod.get(getReportPeriodKey(now.getFullYear(), now.getMonth()))
        if (exact) return exact

        return allReportRows
            .filter((report) => getReportPeriod(report)!.date.getTime() <= now.getTime())
            .at(-1)
    }, [allReportRows, reportByPeriod])

    const viewedReportsByMonth = React.useMemo(
        () => new Map(viewedReports.map((report) => [getReportPeriod(report)!.month, report])),
        [viewedReports],
    )

    const viewYearIndex = availableYears.indexOf(viewYear)
    const previousViewYear = viewYearIndex > 0 ? availableYears[viewYearIndex - 1] : undefined
    const nextViewYear = viewYearIndex >= 0 && viewYearIndex < availableYears.length - 1
        ? availableYears[viewYearIndex + 1]
        : undefined

    const navigateToReport = React.useCallback((report: AssemblyReport) => {
        const query = createReportSelectionQuery(searchParams, report, {
            resetPage: true,
        })
        router.push(`${pathname}?${query}`)
        setOpen(false)
    }, [pathname, router, searchParams])

    const handleOpenChange = React.useCallback((nextOpen: boolean) => {
        setOpen(nextOpen)

        if (nextOpen) {
            setViewYear(selectedYear)
        }
    }, [selectedYear])

    const scrollYears = React.useCallback((direction: "previous" | "next") => {
        yearsScrollerRef.current?.scrollBy({
            left: direction === "previous" ? -240 : 240,
            behavior: "smooth",
        })
    }, [])

    React.useEffect(() => {
        if (!open) return

        const frame = requestAnimationFrame(() => {
            selectedYearRef.current?.scrollIntoView({
                block: "nearest",
                inline: "center",
                behavior: "smooth",
            })
        })

        return () => cancelAnimationFrame(frame)
    }, [open])

    React.useEffect(() => {
        if (!open) return

        const frame = requestAnimationFrame(() => {
            const viewedYearButton = yearsScrollerRef.current?.querySelector<HTMLButtonElement>(
                `[data-year="${viewYear}"]`,
            )

            viewedYearButton?.scrollIntoView({
                block: "nearest",
                inline: "center",
                behavior: "smooth",
            })
        })

        return () => cancelAnimationFrame(frame)
    }, [open, viewYear])

    if (isLoading) {
        return <Spinner />
    }

    return (
        <div className="flex w-full justify-start">
            <Popover open={open} onOpenChange={handleOpenChange}>
                <div
                    className="inline-flex max-w-full items-center gap-2 p-1 overflow-hidden rounded-lg border-0 border-border"
                    role="group"
                    aria-label="Report period navigator"
                >
                    <PopoverTrigger asChild>
                        <Button
                            type="button"
                            variant="ghost"
                            disabled={isLoading || !displayedReport}
                            aria-label={`Choose reporting period, currently ${displayedLabel}`}
                            aria-expanded={open}
                            className="h-8 min-w-full max-w-[calc(100vw-7rem)] rounded-full border border-border-subtle px-3 font-semibold tabular-nums sm:min-w-44 bg-background"
                        >
                            <span
                                aria-hidden="true"
                                className={cn("size-2.5 shrink-0 rounded-full", displayedStatusMeta.dotClassName)}
                            />
                            <span className="truncate">{displayedLabel}</span>
                            <ChevronDown
                                className={cn(
                                    "size-3.5 text-muted-foreground transition-transform",
                                    open && "rotate-180",
                                )}
                            />
                        </Button>
                    </PopoverTrigger>

                    <NavigatorButton
                        direction="previous"
                        disabled={isLoading || !previousReport}
                        onClick={() => previousReport && navigateToReport(previousReport)}
                    />

                    <NavigatorButton
                        direction="next"
                        disabled={isLoading || !nextReport}
                        onClick={() => nextReport && navigateToReport(nextReport)}
                    />
                </div>

                <PopoverContent
                    align="start"
                    sideOffset={8}
                    className="w-[min(32rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-border-subtle p-0 shadow-elevation-01"
                >
                    <TooltipProvider delayDuration={120}>
                        <div className="p-3 sm:p-4">
                            <div className="flex items-center gap-2 border-b border-border-subtle pb-3">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    aria-label="Scroll to earlier years"
                                    onClick={() => {
                                        if (previousViewYear) setViewYear(previousViewYear)
                                        scrollYears("previous")
                                    }}
                                    disabled={!previousViewYear}
                                    className="size-9 shrink-0 rounded-xl bg-background shadow-xs"
                                >
                                    <ChevronLeft className="size-4" />
                                </Button>

                                <div className="relative min-w-0 flex-1 overflow-hidden">
                                    <div
                                        aria-hidden="true"
                                        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-linear-to-r from-background to-transparent"
                                    />
                                    <div
                                        aria-hidden="true"
                                        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-linear-to-l from-background to-transparent"
                                    />

                                    <div
                                        ref={yearsScrollerRef}
                                        className="scrollbar-none flex snap-x snap-mandatory gap-1 overflow-x-auto px-7 scroll-smooth"
                                    >
                                        {availableYears.map((year) => {
                                            const isViewed = year === viewYear
                                            const isSelected = year === selectedYear

                                            return (
                                                <Button
                                                    key={year}
                                                    ref={isSelected ? selectedYearRef : undefined}
                                                    data-year={year}
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    aria-pressed={isViewed}
                                                    onClick={() => setViewYear(year)}
                                                    className={cn(
                                                        "relative h-10 min-w-21 shrink-0 snap-center rounded-xl px-4 text-sm font-medium tabular-nums",
                                                        "text-muted-foreground hover:bg-muted/70 hover:text-foreground",
                                                        isViewed && "bg-primary/10 font-semibold text-primary hover:bg-primary/10 hover:text-primary",
                                                        isSelected && !isViewed && "font-semibold text-foreground",
                                                    )}
                                                >
                                                    {year}
                                                    {isViewed ? (
                                                        <span
                                                            aria-hidden="true"
                                                            className="absolute -bottom-3 left-1/2 h-0.5 w-12 -translate-x-1/2 rounded-full bg-primary"
                                                        />
                                                    ) : null}
                                                </Button>
                                            )
                                        })}
                                    </div>
                                </div>

                                <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    aria-label="Scroll to later years"
                                    onClick={() => {
                                        if (nextViewYear) setViewYear(nextViewYear)
                                        scrollYears("next")
                                    }}
                                    disabled={!nextViewYear}
                                    className="size-9 shrink-0 rounded-xl bg-background shadow-xs"
                                >
                                    <ChevronRight className="size-4" />
                                </Button>
                            </div>

                            <div className="pt-4">
                                <div className="grid grid-cols-3 overflow-hidden rounded-xl border border-border-subtle bg-background">
                                {SHORT_MONTHS.map((month, monthIndex) => {
                                    const report = viewedReportsByMonth.get(monthIndex)
                                    const reportPeriod = report ? getReportPeriod(report) : null
                                    const isSelected = Boolean(
                                        displayedReport
                                        && report
                                        && String(displayedReport.id) === String(report.id),
                                    )
                                    const status = getReportVisualStatus(report)
                                    const statusMeta = REPORT_STATUS_META[status]

                                    return (
                                        <Button
                                            key={month}
                                            type="button"
                                            variant="ghost"
                                            aria-label={`${MONTHS[monthIndex]} ${viewYear}, ${statusMeta.label}`}
                                            aria-current={isSelected ? "date" : undefined}
                                            aria-disabled={!report}
                                            tabIndex={report ? 0 : -1}
                                            onClick={() => report && navigateToReport(report)}
                                            className={cn(
                                                // The outer grid owns the perimeter border/radius. Each month only
                                                // draws its right/bottom divider, so adjacent cells share one 1px
                                                // line instead of rendering separate card borders.
                                                "group relative h-24 min-w-0 items-start justify-start rounded-none border-0 border-r border-b border-border-subtle p-3 text-left shadow-none",
                                                "bg-background text-foreground hover:bg-muted/30",
                                                "focus-visible:z-20 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring focus-visible:ring-offset-0",
                                                monthIndex % 3 === 2 && "border-r-0",
                                                monthIndex >= 9 && "border-b-0",
                                                isSelected && "z-10 bg-primary text-primary-foreground hover:bg-primary",
                                                !report && "cursor-default hover:bg-background",
                                            )}
                                        >
                                            <span className="text-sm font-medium sm:text-base">
                                                {month}
                                            </span>

                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <span
                                                        role="img"
                                                        aria-label={statusMeta.label}
                                                        className={cn(
                                                            "absolute bottom-3 left-3 inline-flex size-3 rounded-full",
                                                            statusMeta.dotClassName,
                                                            isSelected && "ring-4 ring-primary-foreground/90",
                                                        )}
                                                    />
                                                </TooltipTrigger>
                                                <TooltipContent side="top" sideOffset={8}>
                                                    {statusMeta.label}
                                                </TooltipContent>
                                            </Tooltip>


                                            {reportPeriod ? (
                                                <span className="sr-only">
                                                    {` ${reportPeriod.year}`}
                                                </span>
                                            ) : null}
                                        </Button>
                                    )
                                })}
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-border-subtle px-4 py-3">
                            <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
                                {(Object.entries(REPORT_STATUS_META) as Array<[
                                    ReportVisualStatus,
                                    (typeof REPORT_STATUS_META)[ReportVisualStatus],
                                ]>).map(([status, meta]) => (
                                    <div key={status} className="flex items-center gap-2">
                                        <span className={cn("size-2.5 rounded-full", meta.dotClassName)} />
                                        <span>{meta.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {currentReport ? (
                            <div className="border-t border-border-subtle p-3">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => navigateToReport(currentReport)}
                                    className="h-10 w-full rounded-xl font-medium text-primary"
                                >
                                    <CalendarDays className="size-4" />
                                    Current period
                                </Button>
                            </div>
                        ) : null}
                    </TooltipProvider>
                </PopoverContent>
            </Popover>
        </div>
    )
}
