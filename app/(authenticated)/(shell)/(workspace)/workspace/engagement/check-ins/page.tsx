import { redirect } from "next/navigation"
import { APP_ROUTES } from "@/config/app-routes"
import { reportHref, type ReportRouteSearchParams } from "@/features/reports/modules/lib/report-route-redirect"
export default async function CheckInsPage({ searchParams }: { searchParams: Promise<ReportRouteSearchParams> }) {
    redirect(reportHref(APP_ROUTES.engagement.checkIns, await searchParams))
}
