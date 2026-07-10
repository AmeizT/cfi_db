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
        reportHref("/reports/finance/income-expenditure", await searchParams, {
            tab: "statement",
        })
    )
}
