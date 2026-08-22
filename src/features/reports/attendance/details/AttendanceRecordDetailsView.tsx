"use client"

import Link from "next/link"
import { ArrowLeftIcon } from "lucide-react"
import { usePathname, useSearchParams } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import View from "@/components/ui/view"
import { AttendanceDetailsTabs } from "./components/AttendanceDetailsTabs"
import { AttendanceRecordHeader } from "./components/AttendanceRecordHeader"
import { AttendanceSummary } from "./components/AttendanceSummary"
import { AttendanceRecordDetailError } from "./attendance-record-detail"
import { safeAttendanceReturnPath } from "./attendance-record-format"
import { useAttendanceRecordDetail } from "./use-attendance-record-detail"

function AttendanceDetailsSkeleton() {
    return (
        <div className="space-y-6">
            <Skeleton className="h-10 w-56" />
            <Skeleton className="h-32 w-full rounded-2xl" />
            <div className="grid gap-5 lg:grid-cols-[minmax(260px,360px)_minmax(0,1fr)]">
                <div className="space-y-4">
                    <Skeleton className="h-52 rounded-2xl" />
                    <Skeleton className="h-32 rounded-2xl" />
                    <Skeleton className="h-64 rounded-2xl" />
                </div>
                <Skeleton className="h-[34rem] rounded-2xl" />
            </div>
        </div>
    )
}

function AttendanceDetailsError({
    backHref,
    notFound,
}: {
    backHref: string
    notFound: boolean
}) {
    return (
        <Card className="mx-auto max-w-xl rounded-2xl border-border-subtle shadow-elevation-01">
            <CardContent className="px-6 py-14 text-center">
                <h1 className="text-xl font-semibold text-foreground">
                    {notFound ? "Attendance record not found" : "Record not available"}
                </h1>
                <p className="mt-2 text-sm text-muted-foreground">
                    {notFound
                        ? "This record may have been removed or is outside your assembly."
                        : "The attendance record could not be loaded. Try again shortly."}
                </p>
                <Button asChild variant="outline" className="mt-6">
                    <Link href={backHref}>
                        <ArrowLeftIcon className="size-4" />
                        Back to Attendance Records
                    </Link>
                </Button>
            </CardContent>
        </Card>
    )
}

export function AttendanceRecordDetailsView({
    recordId,
}: {
    recordId: string
}) {
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const defaultBackHref = pathname.replace(/\/records\/[^/]+\/?$/, "")
    const backHref = safeAttendanceReturnPath(
        searchParams.get("return_to"),
        defaultBackHref
    )
    const detailQuery = useAttendanceRecordDetail(recordId)
    const record = detailQuery.data

    return (
        <View className="min-h-full">
            <View.Body className="px-4 py-5 sm:px-5 lg:px-6 lg:py-6">
                {detailQuery.isLoading ? (
                    <AttendanceDetailsSkeleton />
                ) : detailQuery.isError || !record ? (
                    <AttendanceDetailsError
                        backHref={backHref}
                        notFound={
                            detailQuery.error instanceof AttendanceRecordDetailError &&
                            detailQuery.error.status === 404
                        }
                    />
                ) : (
                    <div className="mx-auto w-full max-w-[90rem] space-y-6">
                        <AttendanceRecordHeader
                            record={record}
                            backHref={backHref}
                        />

                        <div className="grid min-w-0 gap-5 lg:grid-cols-[minmax(260px,360px)_minmax(0,1fr)] lg:items-start">
                            <AttendanceSummary record={record} />
                            <main className="min-w-0">
                                <AttendanceDetailsTabs record={record} />
                            </main>
                        </div>
                    </div>
                )}
            </View.Body>
        </View>
    )
}
