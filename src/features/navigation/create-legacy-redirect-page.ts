import { redirect } from "next/navigation"
import { reportHref, type ReportRouteSearchParams } from "@/features/reports/modules/lib/report-route-redirect"

export function createLegacyRedirectPage(destination: string) {
    return async function LegacyRedirectPage({
        searchParams,
    }: {
        searchParams: Promise<ReportRouteSearchParams>
    }) {
        redirect(reportHref(destination, await searchParams))
    }
}
