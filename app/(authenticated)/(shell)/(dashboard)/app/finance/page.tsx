import { redirect } from "next/navigation"

import { reportHref, type ReportRouteSearchParams } from "@/features/reports/modules/lib/report-route-redirect"

export default async function LegacyFinancePage({
    searchParams,
}: {
    searchParams: Promise<ReportRouteSearchParams>
}) {
    redirect(reportHref("/finance/tithes", await searchParams))
}
