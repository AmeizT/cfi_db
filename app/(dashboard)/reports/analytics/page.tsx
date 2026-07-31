import { redirect } from "next/navigation"
import type { Metadata } from "next"
import { reportHref, type ReportRouteSearchParams } from "@/features/reports/modules/lib/report-route-redirect"
import { parseTab } from "@/utils/parse-tab"

function capitalize(word: string) {
    return word?.charAt(0)?.toUpperCase() + word?.slice(1)
}

type Props = {
    searchParams: Promise<ReportRouteSearchParams>
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
    const activeTab = searchParams.then((sp) => sp.tab as string)
    const { main: tab } = parseTab(await activeTab)

    return {
        title: `${capitalize(await tab)} Cumulative`,
        description: `Cumulative ${capitalize(await tab)} reporting for your church.`,
    }
}

export default async function ReportAnalyticsPage({ searchParams }: Props) {
    const resolved = await searchParams
    const tab = typeof resolved.tab === "string" ? parseTab(resolved.tab).main : "attendance"
    const pathname = tab === "tithes"
        ? "/reports/finance/tithes/cumulative"
        : tab === "cashflow"
            ? "/reports/financial-activity/cumulative"
            : "/reports/ministry/attendance/cumulative"

    redirect(reportHref(pathname, resolved, { tab: null }))
}
