import { notFound, redirect } from "next/navigation"
import { ReportModulePageView } from "@/features/reports/modules/views/ReportModulePageView"
import { isReportModuleRoute } from "@/features/reports/modules/config/report-modules"
import type {
    ReportModuleKey,
    ReportSection,
} from "@/features/reports/modules/types/report-modules"
import { reportHref, type ReportRouteSearchParams } from "@/features/reports/modules/lib/report-route-redirect"

type ReportModulePageProps = {
    params: Promise<{
        section: string
        module: string
    }>
    searchParams: Promise<ReportRouteSearchParams>
}

export default async function ReportModulePage({
    params,
    searchParams,
}: ReportModulePageProps) {
    const [{ section, module }, query] = await Promise.all([params, searchParams])

    if (section === "ministry" && module === "sunday-school-attendance") {
        redirect(reportHref("/reports/ministry/attendance/sunday-school", query, { tab: null }))
    }

    if (section === "ministry" && module === "attendance" && query.tab === "analytics") {
        redirect(reportHref("/reports/ministry/attendance/cumulative", query, { tab: null }))
    }

    if (section === "finance" && module === "income-expenditure") {
        redirect(reportHref("/reports/financial-activity/statement", query, { tab: null }))
    }

    if (section === "finance" && module === "revenue") {
        redirect(reportHref("/reports/financial-activity/revenue", query, { tab: null }))
    }

    if (section === "finance" && module === "expenditures") {
        redirect(reportHref("/reports/financial-activity/expenses", query, { tab: null }))
    }

    if (!isReportModuleRoute(section, module)) {
        notFound()
    }

    return (
        <ReportModulePageView
            section={section as ReportSection}
            module={module as ReportModuleKey}
        />
    )
}
