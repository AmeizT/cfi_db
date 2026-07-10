import { redirect } from "next/navigation"
import { getMetaData } from "@/config/metadata"
import {
    reportHref,
    type ReportRouteSearchParams,
} from "@/features/reports/modules/lib/report-route-redirect"

const meta = getMetaData({ title: "Reports" })
export const metadata = { ...meta }

type ReportsPageProps = {
    searchParams: Promise<ReportRouteSearchParams>
}

export default async function ReportsPage({ searchParams }: ReportsPageProps) {
    redirect(reportHref("/reports/overview", await searchParams))
}
