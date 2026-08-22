import { getMetaData } from "@/config/metadata"
import { redirect } from "next/navigation"
import { reportHref, type ReportRouteSearchParams } from "@/features/reports/modules/lib/report-route-redirect"

const meta = getMetaData({ title: "Tithes Reports" })
export const metadata = { ...meta }

export default async function TithesRootPage({ searchParams }: { searchParams: Promise<ReportRouteSearchParams> }) {
    redirect(reportHref("/reports/finance/tithes", await searchParams))
}
