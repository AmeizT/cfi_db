"use client"

import { ArrowLeftIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import View from "@/components/ui/view"
import { useSundaySchoolAttendanceDetail } from "../hooks/use-sunday-school-attendance"

function DetailItem({
    label,
    value,
}: {
    label: string
    value: string | number
}) {
    return (
        <div>
            <dt className="text-xs font-medium uppercase text-muted-foreground">
                {label}
            </dt>
            <dd className="mt-1 text-sm text-foreground">
                {value === "" ? "Not recorded" : value}
            </dd>
        </div>
    )
}

export function SundaySchoolAttendanceDetailView({
    recordId,
}: {
    recordId: string
}) {
    const router = useRouter()
    const detailQuery = useSundaySchoolAttendanceDetail(recordId)
    const record = detailQuery.data

    return (
        <View className="gap-0">
            <View.Header
                pagename="Sunday School Attendance Detail"
                description="Review a single Sunday School attendance record."
            />

            <View.Body className="gap-4 py-4">
                <div>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.push("/app/people/sunday-school")}
                    >
                        <ArrowLeftIcon className="size-4" />
                        Back
                    </Button>
                </div>

                {detailQuery.isLoading ? (
                    <Skeleton className="h-96 rounded-lg" />
                ) : detailQuery.isError || !record ? (
                    <Card className="rounded-lg border border-border bg-card px-6 py-12 text-center">
                        <h2 className="text-lg font-semibold text-foreground">
                            Record not available
                        </h2>
                        <p className="mt-2 text-sm text-muted-foreground">
                            The Sunday School attendance record could not be loaded.
                        </p>
                    </Card>
                ) : (
                    <Card className="rounded-lg border border-border bg-card">
                        <CardHeader className="border-b border-border">
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                <div>
                                    <CardTitle className="text-xl">
                                        {record.class_label ?? record.class_name}
                                    </CardTitle>
                                    <p className="mt-1 text-sm text-muted-foreground">
                                        {record.service_date} · {record.assembly_name}
                                    </p>
                                </div>
                                <Badge variant="secondary">
                                    {record.status_label ?? record.status}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="grid gap-6 p-6">
                            <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                                <DetailItem label="Teacher" value={record.teacher_name ?? `Member #${record.teacher}`} />
                                <DetailItem label="Boys" value={record.boys} />
                                <DetailItem label="Girls" value={record.girls} />
                                <DetailItem label="Total Children" value={record.total_children} />
                                <DetailItem label="Visitors" value={record.total_visitors} />
                                <DetailItem label="First Timers" value={record.total_first_timers} />
                                <DetailItem label="Grand Total" value={record.grand_total} />
                                <DetailItem label="Offering" value={record.offering} />
                            </dl>

                            <dl className="grid gap-4 sm:grid-cols-2">
                                <DetailItem label="Lesson title" value={record.lesson_title} />
                                <DetailItem label="Scripture reference" value={record.scripture_reference} />
                                <DetailItem label="Reported by" value={record.reported_by_name ?? "Not recorded"} />
                                <DetailItem label="Reviewed by" value={record.reviewed_by_name ?? "Not reviewed"} />
                            </dl>

                            <div>
                                <h2 className="text-sm font-semibold text-foreground">
                                    Remarks
                                </h2>
                                <p className="mt-2 rounded-lg border border-border bg-muted/30 p-4 text-sm text-foreground">
                                    {record.remarks || "No remarks recorded."}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </View.Body>
        </View>
    )
}
