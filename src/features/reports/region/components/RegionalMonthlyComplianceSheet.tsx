"use client"

import * as React from "react"
import { CalendarOff, Check, Clock, Minus, Star, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet"
import { Skeleton } from "@/components/ui/skeleton"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import {
    clamp,
    getMonthlyComplianceStatus,
    getOrderedSectionKeys,
    getSectionMeta,
    getVisibleMonthlyCompliance,
} from "../utils/monthly-compliance"
import type {
    MonthlyComplianceItem,
    MonthlyComplianceSection,
    RegionalAssemblyRow,
} from "../types/regional-modules"

type RegionalMonthlyComplianceSheetProps = {
    assembly: RegionalAssemblyRow | null
    isLoading?: boolean
    open: boolean
    selectedYear: number
    onOpenChange: (open: boolean) => void
}

const COLUMNS = [
    "Month",
    "Report fields",
    "Completion",
    "Rating",
    "Status",
    "Submitted on",
]

function getRating(completion: number) {
    return clamp(Math.round(completion / 20), 0, 5)
}

function formatPercent(value: number) {
    const rounded = Math.round(value * 10) / 10

    return `${Number.isInteger(rounded) ? rounded.toFixed(0) : rounded.toFixed(1)}%`
}

function formatDate(value: string | null | undefined) {
    if (!value) return null

    const date = new Date(value)

    if (Number.isNaN(date.getTime())) {
        return null
    }

    return new Intl.DateTimeFormat(undefined, {
        day: "numeric",
        month: "short",
        year: "numeric",
    }).format(date)
}

function formatMonth(date: Date) {
    return new Intl.DateTimeFormat(undefined, {
        month: "long",
    }).format(date)
}

function getRangeLabel(selectedYear: number, now: Date) {
    const currentYear = now.getFullYear()
    const currentMonth = now.getMonth() + 1
    const maxMonth =
        selectedYear < currentYear
            ? 12
            : selectedYear === currentYear
                ? currentMonth
                : 0

    if (maxMonth <= 0) {
        return String(selectedYear)
    }

    const firstMonth = formatMonth(new Date(selectedYear, 0, 1))
    const lastMonth = formatMonth(new Date(selectedYear, maxMonth - 1, 1))

    return firstMonth === lastMonth
        ? `${firstMonth} ${selectedYear}`
        : `${firstMonth}-${lastMonth} ${selectedYear}`
}

function getCompletionClass(value: number) {
    if (value < 25) {
        return "bg-destructive"
    }

    if (value < 75) {
        return "bg-amber-500"
    }

    return "bg-emerald-500"
}

function getSectionStatusLabel(status: MonthlyComplianceSection["status"]) {
    return status
        .toLowerCase()
        .replaceAll("_", " ")
        .replace(/\b\w/g, (char) => char.toUpperCase())
}

function getSectionStatusClass(status: MonthlyComplianceSection["status"]) {
    if (status === "SUBMITTED") {
        return "bg-emerald-500/10 text-emerald-700 ring-emerald-600/20 dark:text-emerald-300"
    }

    if (status === "SKIPPED") {
        return "bg-amber-500/10 text-amber-700 ring-amber-600/20 dark:text-amber-300"
    }

    return "bg-destructive/10 text-destructive ring-destructive/20"
}

function getSectionIcon(status: MonthlyComplianceSection["status"]) {
    if (status === "SUBMITTED") {
        return <Check className="size-3" aria-hidden="true" />
    }

    if (status === "SKIPPED") {
        return <Minus className="size-3" aria-hidden="true" />
    }

    return <X className="size-3" aria-hidden="true" />
}

function getStatusBadgeClass(status: ReturnType<typeof getMonthlyComplianceStatus>) {
    if (status === "COMPLIANT") {
        return "border-emerald-600/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
    }

    if (status === "PARTIAL") {
        return "border-amber-600/20 bg-amber-500/10 text-amber-700 dark:text-amber-300"
    }

    if (status === "DRAFT") {
        return "border-muted-foreground/20 bg-muted text-muted-foreground"
    }

    return "border-destructive/20 bg-destructive/10 text-destructive"
}

function getStatusLabel(status: ReturnType<typeof getMonthlyComplianceStatus>) {
    if (status === "COMPLIANT") return "Compliant"
    if (status === "PARTIAL") return "Partial"
    if (status === "DRAFT") return "Draft"

    return "Not submitted"
}

function getCaption(label: string) {
    const firstWord = label.split(" ")[0] ?? label

    return `${firstWord.slice(0, 3)}.`
}

function MonthlySkeleton() {
    return (
        <div className="space-y-5">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {Array.from({ length: 4 }).map((_, index) => (
                    <Skeleton key={index} className="h-24 rounded-lg" />
                ))}
            </div>
            <div className="rounded-lg border">
                {Array.from({ length: 5 }).map((_, index) => (
                    <div key={index} className="border-b p-4 last:border-b-0">
                        <Skeleton className="h-8 w-full" />
                    </div>
                ))}
            </div>
        </div>
    )
}

function EmptyMonthlyState({ futurePeriod }: { futurePeriod: boolean }) {
    return (
        <div className="flex min-h-64 flex-col items-center justify-center rounded-lg border bg-card px-6 py-10 text-center">
            <div className="mb-3 flex size-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
                <CalendarOff className="size-5" aria-hidden="true" />
            </div>
            <p className="max-w-md text-sm font-medium text-foreground">
                {futurePeriod
                    ? "Monthly compliance is not available for a future reporting period."
                    : "No monthly compliance data is available for this assembly and period."}
            </p>
        </div>
    )
}

function KpiCard({
    label,
    value,
    children,
}: {
    children?: React.ReactNode
    label: string
    value: React.ReactNode
}) {
    return (
        <div className="rounded-lg border bg-card p-4">
            <div className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                {label}
            </div>
            <div className="mt-2 flex min-h-8 items-center gap-2 text-2xl font-semibold tabular-nums text-foreground">
                {value}
                {children}
            </div>
        </div>
    )
}

function LegendItem({
    label,
    status,
}: {
    label: string
    status: MonthlyComplianceSection["status"]
}) {
    return (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span
                className={cn(
                    "flex size-6 items-center justify-center rounded-full ring-1",
                    getSectionStatusClass(status)
                )}
            >
                {getSectionIcon(status)}
            </span>
            {label}
        </div>
    )
}

function SectionChip({
    section,
    sectionKey,
}: {
    section: MonthlyComplianceSection
    sectionKey: string
}) {
    const meta = getSectionMeta(sectionKey)
    const statusLabel = getSectionStatusLabel(section.status)
    const tooltipLabel = section.skip_reason
        ? `${meta.label} - ${statusLabel}: ${section.skip_reason}`
        : `${meta.label} - ${statusLabel}`

    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <button
                    aria-label={tooltipLabel}
                    className="flex w-10 flex-col items-center gap-1 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    type="button"
                >
                    <span
                        className={cn(
                            "flex size-8 items-center justify-center rounded-full text-[11px] font-semibold ring-1 transition-shadow",
                            getSectionStatusClass(section.status)
                        )}
                    >
                        {meta.short}
                    </span>
                    <span className="max-w-10 truncate text-[10px] leading-none text-muted-foreground">
                        {getCaption(meta.label)}
                    </span>
                </button>
            </TooltipTrigger>
            <TooltipContent className="max-w-64 text-left">
                <div className="space-y-0.5">
                    <p className="font-medium">{meta.label}</p>
                    <p>{statusLabel}</p>
                    {section.skip_reason ? <p>{section.skip_reason}</p> : null}
                </div>
            </TooltipContent>
        </Tooltip>
    )
}

function CompletionCell({ completion }: { completion: number }) {
    const value = clamp(completion, 0, 100)

    return (
        <div className="flex min-w-44 items-center gap-3">
            <div
                aria-valuemax={100}
                aria-valuemin={0}
                aria-valuenow={value}
                className="h-2 w-28 overflow-hidden rounded-full bg-muted"
                role="progressbar"
            >
                <div
                    className={cn("h-full rounded-full", getCompletionClass(value))}
                    style={{ width: `${value}%` }}
                />
            </div>
            <span className="w-12 text-sm font-semibold tabular-nums text-foreground">
                {formatPercent(value)}
            </span>
        </div>
    )
}

function StarRating({ rating }: { rating: number }) {
    return (
        <div
            aria-label={`${rating} out of 5 rating`}
            className="flex items-center gap-0.5"
            role="img"
        >
            {Array.from({ length: 5 }).map((_, index) => {
                const filled = index < rating

                return (
                    <Star
                        key={index}
                        aria-hidden="true"
                        className={cn(
                            "size-4",
                            filled
                                ? "fill-amber-400 text-amber-500"
                                : "fill-muted text-muted-foreground/30"
                        )}
                    />
                )
            })}
        </div>
    )
}

function StatusBadge({ item }: { item: MonthlyComplianceItem }) {
    const status = getMonthlyComplianceStatus(item)

    return (
        <Badge
            className={cn("gap-1.5 px-2.5 py-1 font-semibold", getStatusBadgeClass(status))}
            variant="outline"
        >
            <span className="size-1.5 rounded-full bg-current" aria-hidden="true" />
            {getStatusLabel(status)}
        </Badge>
    )
}

function SubmittedOnCell({ item }: { item: MonthlyComplianceItem }) {
    const submittedAt = formatDate(item.submitted_at)
    const dueDate = formatDate(item.due_date)

    return (
        <div className="space-y-1 text-sm">
            <div className="text-foreground">
                {submittedAt ?? <span aria-label="Not submitted">&mdash;</span>}
            </div>
            {!submittedAt && dueDate ? (
                <div className="text-xs text-muted-foreground">Due {dueDate}</div>
            ) : null}
            {item.is_late ? (
                <div className="inline-flex items-center gap-1 text-xs font-medium text-amber-700 dark:text-amber-300">
                    <Clock className="size-3" aria-hidden="true" />
                    {item.days_late > 0
                        ? `Late by ${item.days_late} ${item.days_late === 1 ? "day" : "days"}`
                        : "Late"}
                </div>
            ) : null}
        </div>
    )
}

function getMonthlyStats(visibleRows: MonthlyComplianceItem[]) {
    const count = visibleRows.length
    const totalCompletion = visibleRows.reduce(
        (sum, item) => sum + clamp(item.completion, 0, 100),
        0
    )
    const submittedMonths = visibleRows.filter((item) => item.is_submitted).length
    const missingFields = visibleRows.reduce((sum, item) => {
        return (
            sum +
            Object.values(item.sections ?? {}).filter(
                (section) => section.status === "MISSING"
            ).length
        )
    }, 0)
    const averageRating = count
        ? visibleRows.reduce((sum, item) => sum + getRating(item.completion), 0) /
            count
        : 0

    return {
        averageCompletion: count ? totalCompletion / count : 0,
        submittedMonths,
        missingFields,
        averageRating,
        totalMonths: count,
    }
}

function MonthlyRows({ rows }: { rows: MonthlyComplianceItem[] }) {
    return (
        <div className="overflow-hidden rounded-lg border bg-card">
            <div className="overflow-x-auto">
                <Table className="min-w-[900px]">
                    <TableHeader>
                        <TableRow className="border-b bg-muted/30 hover:bg-muted/30">
                            {COLUMNS.map((column) => (
                                <TableHead
                                    key={column}
                                    className="h-11 px-5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground"
                                >
                                    {column}
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {rows.map((item) => (
                            <TableRow
                                key={item.period}
                                className="border-b hover:bg-muted/20 last:border-b-0"
                            >
                                <TableCell className="h-20 px-5 text-base font-semibold text-foreground">
                                    {item.month}
                                </TableCell>
                                <TableCell className="h-20 whitespace-normal px-5">
                                    <div className="flex max-w-96 flex-wrap gap-2">
                                        {getOrderedSectionKeys(item.sections).map((sectionKey) => (
                                            <SectionChip
                                                key={sectionKey}
                                                section={item.sections[sectionKey]}
                                                sectionKey={sectionKey}
                                            />
                                        ))}
                                    </div>
                                </TableCell>
                                <TableCell className="h-20 px-5">
                                    <CompletionCell completion={item.completion} />
                                </TableCell>
                                <TableCell className="h-20 px-5">
                                    <StarRating rating={getRating(item.completion)} />
                                </TableCell>
                                <TableCell className="h-20 px-5">
                                    <StatusBadge item={item} />
                                </TableCell>
                                <TableCell className="h-20 px-5">
                                    <SubmittedOnCell item={item} />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}

export function RegionalMonthlyComplianceSheet({
    assembly,
    isLoading = false,
    open,
    selectedYear,
    onOpenChange,
}: RegionalMonthlyComplianceSheetProps) {
    const now = new Date()
    const visibleRows = getVisibleMonthlyCompliance(
        assembly?.monthly_compliance,
        selectedYear,
        now
    )
    const futurePeriod = selectedYear > now.getFullYear()
    const rangeLabel = getRangeLabel(selectedYear, now)
    const stats = getMonthlyStats(visibleRows)

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent
                className="w-full gap-0 p-0 sm:max-w-none md:w-[min(1120px,92vw)]"
                side="right"
            >
                <SheetHeader className="sticky top-0 z-10 border-b bg-background/95 px-5 py-4 backdrop-blur">
                    <SheetTitle className="pr-10 text-xl">
                        {assembly?.name ?? "Assembly"}
                    </SheetTitle>
                    <SheetDescription>
                        {[assembly?.zone, assembly?.country].filter(Boolean).join(" / ")}
                    </SheetDescription>
                    <div className="pt-2">
                        <div className="text-sm font-semibold text-foreground">
                            Monthly compliance
                        </div>
                        <div className="text-sm text-muted-foreground">{rangeLabel}</div>
                    </div>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto px-5 py-5">
                    {isLoading ? (
                        <MonthlySkeleton />
                    ) : !visibleRows.length ? (
                        <EmptyMonthlyState futurePeriod={futurePeriod} />
                    ) : (
                        <div className="space-y-5">
                            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                                <KpiCard
                                    label="Average completion"
                                    value={formatPercent(stats.averageCompletion)}
                                />
                                <KpiCard
                                    label="Submitted months"
                                    value={`${stats.submittedMonths} / ${stats.totalMonths}`}
                                />
                                <KpiCard
                                    label="Missing fields"
                                    value={stats.missingFields}
                                />
                                <KpiCard
                                    label="Average rating"
                                    value={stats.averageRating.toFixed(1)}
                                >
                                    <Star
                                        className="size-5 fill-amber-400 text-amber-500"
                                        aria-hidden="true"
                                    />
                                </KpiCard>
                            </div>

                            <div className="flex flex-wrap items-center gap-4">
                                <LegendItem label="Submitted" status="SUBMITTED" />
                                <LegendItem label="Missing" status="MISSING" />
                                <LegendItem label="Skipped" status="SKIPPED" />
                            </div>

                            <MonthlyRows rows={visibleRows} />
                        </div>
                    )}
                </div>
            </SheetContent>
        </Sheet>
    )
}
