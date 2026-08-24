import { redirect } from "next/navigation"

import { reportHref, type ReportRouteSearchParams } from "@/features/reports/modules/lib/report-route-redirect"

export default async function LegacySundaySchoolPage({
    searchParams,
}: {
    searchParams: Promise<ReportRouteSearchParams>
}) {
    redirect(reportHref("/engagement/attendance/sunday-school", await searchParams))
}
