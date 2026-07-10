import { redirect } from "next/navigation"
import {
    reportHref,
    type ReportRouteSearchParams,
} from "@/features/reports/modules/lib/report-route-redirect"

type ReviewQueueRedirectPageProps = {
    searchParams: Promise<ReportRouteSearchParams>
}

export default async function ReviewQueueRedirectPage({
    searchParams,
}: ReviewQueueRedirectPageProps) {
    redirect(reportHref("/reports/review/queue", await searchParams))
}
