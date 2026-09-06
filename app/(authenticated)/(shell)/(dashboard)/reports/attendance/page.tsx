import { redirect } from "next/navigation"
import { getMetaData } from "@/config/metadata"
import {
    reportHref,
    type ReportRouteSearchParams,
} from "@/features/reports/modules/lib/report-route-redirect"

const meta = getMetaData({ title: "Attendance Reports" })
export const metadata = { ...meta }

type AttendanceRedirectPageProps = {
    searchParams: Promise<ReportRouteSearchParams>
}

export default async function AttendanceRedirectPage({
    searchParams,
}: AttendanceRedirectPageProps) {
    redirect(reportHref("/reports/ministry/attendance", await searchParams))
}
