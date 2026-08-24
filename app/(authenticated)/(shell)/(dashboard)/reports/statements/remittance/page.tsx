import { redirect } from "next/navigation"
import {
    reportHref,
    type ReportRouteSearchParams,
} from "@/features/reports/modules/lib/report-route-redirect"

type RemittanceStatementRedirectPageProps = {
    searchParams: Promise<ReportRouteSearchParams>
}

export default async function RemittanceStatementRedirectPage({
    searchParams,
}: RemittanceStatementRedirectPageProps) {
    redirect(
        reportHref("/reports/finance/remittance", await searchParams, {
            tab: null,
        })
    )
}
