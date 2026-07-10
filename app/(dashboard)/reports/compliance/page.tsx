import { redirect } from "next/navigation"
import {
    reportHref,
    type ReportRouteSearchParams,
} from "@/features/reports/modules/lib/report-route-redirect"

type ComplianceRedirectPageProps = {
    searchParams: Promise<ReportRouteSearchParams>
}

export default async function ComplianceRedirectPage({
    searchParams,
}: ComplianceRedirectPageProps) {
    redirect(reportHref("/reports/review/compliance", await searchParams))
}
