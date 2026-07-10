import { redirect } from "next/navigation"
import {
    reportHref,
    type ReportRouteSearchParams,
} from "@/features/reports/modules/lib/report-route-redirect"

type GivingStatementRedirectPageProps = {
    searchParams: Promise<ReportRouteSearchParams>
}

export default async function GivingStatementRedirectPage({
    searchParams,
}: GivingStatementRedirectPageProps) {
    redirect(
        reportHref("/reports/finance/tithes", await searchParams, {
            tab: "data",
        })
    )
}
