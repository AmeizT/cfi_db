import { redirect } from "next/navigation"
import {
    reportHref,
    type ReportRouteSearchParams,
} from "@/features/reports/modules/lib/report-route-redirect"

type IncomeStatementRedirectPageProps = {
    searchParams: Promise<ReportRouteSearchParams>
}

export default async function IncomeStatementRedirectPage({
    searchParams,
}: IncomeStatementRedirectPageProps) {
    redirect(
        reportHref("/reports/financial-activity/statement", await searchParams, { tab: null })
    )
}
