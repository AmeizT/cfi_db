import { redirect } from "next/navigation"
import {
    reportHref,
    type ReportRouteSearchParams,
} from "@/features/reports/modules/lib/report-route-redirect"

type ReviewPageProps = {
    searchParams: Promise<ReportRouteSearchParams>
}

export default async function ReviewPage({ searchParams }: ReviewPageProps) {
    redirect(reportHref("/reports/review/queue", await searchParams))
}
