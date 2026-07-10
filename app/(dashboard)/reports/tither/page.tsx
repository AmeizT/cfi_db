import { redirect } from "next/navigation"
import { getMetaData } from "@/config/metadata"
import {
    reportHref,
    type ReportRouteSearchParams,
} from "@/features/reports/modules/lib/report-route-redirect"

const meta = getMetaData({ title: "Tithes Reports" })
export const metadata = { ...meta }

type TithesRedirectPageProps = {
    searchParams: Promise<ReportRouteSearchParams>
}

export default async function TithesRedirectPage({
    searchParams,
}: TithesRedirectPageProps) {
    redirect(reportHref(
        "/reports/finance/tithes",
        await searchParams,
        {
            tab: null,
            view: null,
        },
    ))
}
