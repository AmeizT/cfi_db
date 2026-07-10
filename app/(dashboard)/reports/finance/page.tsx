import { redirect } from "next/navigation"
import { getMetaData } from "@/config/metadata"
import {
    reportHref,
    type ReportRouteSearchParams,
} from "@/features/reports/modules/lib/report-route-redirect"

const meta = getMetaData({ title: "Finance Reports" })
export const metadata = { ...meta }

type FinanceReportsPageProps = {
    searchParams: Promise<ReportRouteSearchParams>
}

export default async function FinanceReportsPage({
    searchParams,
}: FinanceReportsPageProps) {
    redirect(reportHref("/reports/finance/tithes", await searchParams))
}
