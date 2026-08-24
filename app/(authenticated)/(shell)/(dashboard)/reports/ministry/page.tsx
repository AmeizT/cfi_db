import { redirect } from "next/navigation"
import {
    reportHref,
    type ReportRouteSearchParams,
} from "@/features/reports/modules/lib/report-route-redirect"

type MinistryReportsPageProps = {
    searchParams: Promise<ReportRouteSearchParams>
}

export default async function MinistryReportsPage({
    searchParams,
}: MinistryReportsPageProps) {
    redirect(reportHref("/reports/ministry/attendance", await searchParams))
}
