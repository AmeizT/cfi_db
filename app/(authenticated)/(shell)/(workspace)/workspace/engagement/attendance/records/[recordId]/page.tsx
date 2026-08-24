import { redirect } from "next/navigation"
import { attendanceRecordPath } from "@/config/app-routes"
import { reportHref, type ReportRouteSearchParams } from "@/features/reports/modules/lib/report-route-redirect"

export default async function WorkspaceAttendanceRecordPage({
    params, searchParams,
}: {
    params: Promise<{ recordId: string }>
    searchParams: Promise<ReportRouteSearchParams>
}) {
    const { recordId } = await params
    redirect(reportHref(attendanceRecordPath(recordId), await searchParams))
}
