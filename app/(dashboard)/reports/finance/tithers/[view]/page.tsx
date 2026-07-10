import { notFound, redirect } from "next/navigation"
import { getMetaData } from "@/config/metadata"
import { TithesRouteContent } from "@/features/reports/finance/tithes/workspace/TithesWorkspace"
import {
    reportHref,
    type ReportRouteSearchParams,
} from "@/features/reports/modules/lib/report-route-redirect"

const meta = getMetaData({ title: "Tithes Reports" })
export const metadata = { ...meta }

const VALID_VIEWS = [
    "cumulative",
    "contributors",
    "receipts",
    "performance",
    "audit-log",
] as const

type TithesView = typeof VALID_VIEWS[number]

type TithesViewPageProps = {
    params: Promise<{
        view: string
    }>
    searchParams: Promise<ReportRouteSearchParams>
}

export default async function TithesViewPage({
    params,
    searchParams,
}: TithesViewPageProps) {
    const [{ view }, query] = await Promise.all([params, searchParams])

    if (view === "monthly-records") {
        redirect(reportHref(
            "/reports/finance/tithes",
            query,
            {
                tab: null,
                view: null,
            },
        ))
    }

    if (!VALID_VIEWS.includes(view as TithesView)) {
        notFound()
    }

    return <TithesRouteContent view={view as TithesView} />
}
