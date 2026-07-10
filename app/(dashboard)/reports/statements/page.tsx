import { redirect } from "next/navigation"
import {
    reportHref,
    type ReportRouteSearchParams,
} from "@/features/reports/modules/lib/report-route-redirect"
import { parseTab } from "@/utils/parse-tab"

type ReportStatementsPageProps = {
    searchParams: Promise<ReportRouteSearchParams>
}

function getStatementRedirect(searchParams: ReportRouteSearchParams) {
    const tab = typeof searchParams.tab === "string" ? searchParams.tab : null
    const { main } = parseTab(tab)

    switch (main) {
        case "cashflow":
        case "finance":
        case "income-expenditure":
            return {
                pathname: "/reports/finance/income-expenditure",
                tab: "statement",
            }

        case "tithes":
        case "giving":
            return {
                pathname: "/reports/finance/tithes",
                tab: "data",
            }

        case "remittance":
            return {
                pathname: "/reports/finance/remittance",
                tab: null,
            }

        case "attendance":
        case "overview":
        default:
            return {
                pathname: "/reports/ministry/attendance",
                tab: main === "analytics" ? "analytics" : "monthly",
            }
    }
}

export default async function ReportStatementsPage({
    searchParams,
}: ReportStatementsPageProps) {
    const resolvedSearchParams = await searchParams
    const redirectTarget = getStatementRedirect(resolvedSearchParams)

    redirect(
        reportHref(
            redirectTarget.pathname,
            resolvedSearchParams,
            { tab: redirectTarget.tab }
        )
    )
}
