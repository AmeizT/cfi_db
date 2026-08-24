import { redirect } from "next/navigation"
import {
    reportHref,
    type ReportRouteSearchParams,
} from "@/features/reports/modules/lib/report-route-redirect"

type TithesStatementRedirectPageProps = {
    searchParams: Promise<ReportRouteSearchParams>
}

export default async function TithesStatementRedirectPage({
    searchParams,
}: TithesStatementRedirectPageProps) {
    redirect(
        reportHref("/reports/finance/tithes", await searchParams, {
            tab: "data",
        })
    )
}
