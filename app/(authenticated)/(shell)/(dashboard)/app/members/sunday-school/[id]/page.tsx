import { redirect } from "next/navigation"
import { reportHref, type ReportRouteSearchParams } from "@/features/reports/modules/lib/report-route-redirect"

type SundaySchoolAttendanceDetailPageProps = {
    params: Promise<{ id: string }>
    searchParams: Promise<ReportRouteSearchParams>
}

export default async function SundaySchoolAttendanceDetailPage({
    params, searchParams,
}: SundaySchoolAttendanceDetailPageProps) {
    const { id } = await params
    redirect(reportHref(`/engagement/attendance/sunday-school/${id}`, await searchParams))
}
