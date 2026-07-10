import { redirect } from "next/navigation"
import {
    reportHref,
    type ReportRouteSearchParams,
} from "@/features/reports/modules/lib/report-route-redirect"

type ExceptionsRedirectPageProps = {
    searchParams: Promise<ReportRouteSearchParams>
}

export default async function ExceptionsRedirectPage({
    searchParams,
}: ExceptionsRedirectPageProps) {
    redirect(reportHref("/reports/review/exceptions", await searchParams))
}
