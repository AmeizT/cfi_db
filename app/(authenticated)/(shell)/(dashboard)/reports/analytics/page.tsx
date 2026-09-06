import { redirect } from "next/navigation"
import { reportHref, type ReportRouteSearchParams } from "@/features/reports/modules/lib/report-route-redirect"

type Props = {
    searchParams: Promise<ReportRouteSearchParams>
}

export default async function ReportAnalyticsPage({ searchParams }: Props) {
    redirect(reportHref("/reports/insights", await searchParams))
}
