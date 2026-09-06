import { redirect } from "next/navigation"
import {
    reportHref,
    type ReportRouteSearchParams,
} from "@/features/reports/modules/lib/report-route-redirect"

export default async function NeedsAttentionCompatibilityPage({
    searchParams,
}: {
    searchParams: Promise<ReportRouteSearchParams>
}) {
    redirect(reportHref("/reports/activity/flagged", await searchParams))
}
