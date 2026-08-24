import { redirect } from "next/navigation"
import { APP_ROUTES } from "@/config/app-routes"
import { reportHref, type ReportRouteSearchParams } from "@/features/reports/modules/lib/report-route-redirect"
export default async function AttendancePage({ searchParams }: { searchParams: Promise<ReportRouteSearchParams> }) {
    redirect(reportHref(APP_ROUTES.engagement.attendance, await searchParams))
}
