import Link from "next/link"
import { ArrowLeftIcon, Clock3Icon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { AttendanceRecordDetail } from "../attendance-record-detail"
import {
    formatAttendanceDate,
    formatAttendanceDateTime,
    getAttendanceRecordTitle,
} from "../attendance-record-format"

export function AttendanceRecordHeader({
    record,
    backHref,
}: {
    record: AttendanceRecordDetail
    backHref: string
}) {
    const statusLabel = record.is_deleted
        ? "Deleted"
        : record.report_status_label || "Recorded"

    return (
        <header className="space-y-5">
            <Button asChild variant="ghost" className="-ml-3 w-fit">
                <Link href={backHref}>
                    <ArrowLeftIcon className="size-4" />
                    Back to Attendance Records
                </Link>
            </Button>

            <div className="flex flex-col gap-4 border-b border-border-subtle pb-6 lg:flex-row lg:items-end lg:justify-between">
                <div className="min-w-0">
                    <p className="text-sm font-medium text-primary">
                        {formatAttendanceDate(record.timestamp)}
                    </p>
                    <h1 className="mt-1 text-3xl font-bold tracking-tight text-foreground lg:text-4xl">
                        {getAttendanceRecordTitle(record)}
                    </h1>
                    <p className="mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">
                        Attendance and service information recorded for this assembly service.
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 lg:justify-end">
                    <Badge
                        variant="outline"
                        className={cn(
                            "px-3 py-1.5",
                            record.is_deleted
                                ? "border-destructive/30 bg-destructive/10 text-destructive"
                                : record.report_status === "submitted" ||
                                    record.report_status === "approved"
                                  ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                                  : "border-primary/25 bg-primary/10 text-primary"
                        )}
                    >
                        {statusLabel}
                    </Badge>
                    <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Clock3Icon className="size-3.5" aria-hidden="true" />
                        Last saved {formatAttendanceDateTime(record.updated_at)}
                    </span>
                </div>
            </div>
        </header>
    )
}
