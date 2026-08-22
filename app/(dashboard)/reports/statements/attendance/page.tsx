import { redirect } from "next/navigation"
import {
    reportHref,
    type ReportRouteSearchParams,
} from "@/features/reports/modules/lib/report-route-redirect"

type AttendanceStatementRedirectPageProps = {
    searchParams: Promise<ReportRouteSearchParams>
}

export default async function AttendanceStatementRedirectPage({
    searchParams,
}: AttendanceStatementRedirectPageProps) {
    const resolvedSearchParams = await searchParams
    const tab =
        resolvedSearchParams.tab === "analytics" ||
        resolvedSearchParams.tab === "monthly"
            ? resolvedSearchParams.tab
            : "monthly"

    const pathname = tab === "analytics"
        ? "/reports/ministry/attendance/cumulative"
        : "/reports/ministry/attendance"
    redirect(reportHref(pathname, resolvedSearchParams, { tab: null }))
}
