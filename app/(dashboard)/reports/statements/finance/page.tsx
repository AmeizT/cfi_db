import { redirect } from "next/navigation"
import {
    reportHref,
    type ReportRouteSearchParams,
} from "@/features/reports/modules/lib/report-route-redirect"

type FinanceStatementRedirectPageProps = {
    searchParams: Promise<ReportRouteSearchParams>
}

export default async function FinanceStatementRedirectPage({
    searchParams,
}: FinanceStatementRedirectPageProps) {
    redirect(
        reportHref("/reports/financial-activity/statement", await searchParams, { tab: null })
    )
}
