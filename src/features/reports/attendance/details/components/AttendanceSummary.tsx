import {
    CalendarDaysIcon,
    CloudSunIcon,
    Clock3Icon,
    MapPinIcon,
    Mic2Icon,
    UsersIcon,
    UserRoundPlusIcon,
} from "lucide-react"
import type { ComponentType } from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { AttendanceRecordDetail } from "../attendance-record-detail"
import {
    getAttendanceDateParts,
    humanizeAttendanceValue,
} from "../attendance-record-format"

function SummaryLine({
    icon: Icon,
    label,
    value,
}: {
    icon: ComponentType<{ className?: string }>
    label: string
    value: string
}) {
    return (
        <div className="flex items-start gap-3">
            <Icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
            <div className="min-w-0">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    {label}
                </p>
                <p className="mt-0.5 text-sm font-medium text-foreground">
                    {value}
                </p>
            </div>
        </div>
    )
}

function MetricCard({
    icon: Icon,
    label,
    value,
    unavailable = false,
}: {
    icon: ComponentType<{ className?: string }>
    label: string
    value: number | string
    unavailable?: boolean
}) {
    return (
        <Card className="rounded-2xl border-border-subtle shadow-elevation-01">
            <CardContent className="p-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                    <span className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <Icon className="size-4" />
                    </span>
                    <span className="text-xs font-semibold uppercase tracking-wide">
                        {label}
                    </span>
                </div>
                <p
                    className={cn(
                        "mt-3 text-3xl font-bold tabular-nums text-foreground",
                        unavailable && "text-muted-foreground"
                    )}
                >
                    {value}
                </p>
                {unavailable ? (
                    <p className="mt-1 text-xs text-muted-foreground">
                        Not captured for this record
                    </p>
                ) : null}
            </CardContent>
        </Card>
    )
}

function DemographicRow({
    label,
    value,
    total,
    tone,
}: {
    label: string
    value: number | null
    total: number
    tone: string
}) {
    const percentage = value === null || total <= 0
        ? 0
        : Math.min(100, Math.round((value / total) * 100))

    return (
        <div className="space-y-1.5">
            <div className="flex items-center justify-between gap-3 text-sm">
                <span className="text-muted-foreground">{label}</span>
                <span className="font-semibold tabular-nums text-foreground">
                    {value === null ? "Not recorded" : value.toLocaleString()}
                </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div
                    className={cn("h-full rounded-full", tone)}
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    )
}

export function AttendanceSummary({
    record,
}: {
    record: AttendanceRecordDetail
}) {
    const date = getAttendanceDateParts(record.timestamp)
    const children = record.total_children ?? null
    const total = Math.max(record.headcount || 0, 1)

    return (
        <aside className="space-y-4">
            <Card className="overflow-hidden rounded-2xl border-border-subtle shadow-elevation-01">
                <CardContent className="space-y-5 p-5">
                    <div className="flex items-center gap-4">
                        <div className="flex size-20 shrink-0 flex-col overflow-hidden rounded-xl border border-border bg-muted/40 text-center">
                            <span className="bg-primary py-1.5 text-xs font-bold tracking-widest text-primary-foreground">
                                {date.month}
                            </span>
                            <span className="flex flex-1 items-center justify-center text-3xl font-bold text-primary">
                                {date.day}
                            </span>
                        </div>
                        <div className="min-w-0 space-y-2">
                            <SummaryLine
                                icon={MapPinIcon}
                                label="Venue"
                                value={
                                    record.homecell_name ||
                                    record.assembly_name ||
                                    `Assembly #${record.assembly}`
                                }
                            />
                            <SummaryLine
                                icon={Clock3Icon}
                                label="Service time"
                                value="Not recorded"
                            />
                        </div>
                    </div>

                    <div className="grid gap-4 border-t border-border-subtle pt-5 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                        <SummaryLine
                            icon={Mic2Icon}
                            label="Preacher"
                            value={record.preacher?.trim() || "Not recorded"}
                        />
                        {record.weather ? (
                            <SummaryLine
                                icon={CloudSunIcon}
                                label="Weather"
                                value={humanizeAttendanceValue(record.weather)}
                            />
                        ) : null}
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-2 gap-3">
                <MetricCard
                    icon={UsersIcon}
                    label="Total Headcount"
                    value={record.headcount.toLocaleString()}
                />
                <MetricCard
                    icon={UserRoundPlusIcon}
                    label="First Time Visitors"
                    value={(record.total_visitors ?? 0).toLocaleString()}
                />
            </div>

            <Card className="rounded-2xl border-border-subtle shadow-elevation-01">
                <CardHeader className="border-b border-border-subtle px-5 py-4">
                    <CardTitle className="flex items-center gap-2 text-base">
                        <CalendarDaysIcon className="size-4 text-primary" />
                        Demographics
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 p-5">
                    <DemographicRow
                        label="Adults"
                        value={record.total_adults ?? 0}
                        total={total}
                        tone="bg-primary"
                    />
                    <DemographicRow
                        label="Youth"
                        value={null}
                        total={total}
                        tone="bg-amber-500"
                    />
                    <DemographicRow
                        label="Children"
                        value={children}
                        total={total}
                        tone="bg-emerald-500"
                    />
                </CardContent>
            </Card>
        </aside>
    )
}
