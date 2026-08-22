import { notFound, redirect } from "next/navigation"
import { isReportModuleRoute } from "@/features/reports/modules/config/report-modules"
import { reportHref, type ReportRouteSearchParams } from "@/features/reports/modules/lib/report-route-redirect"
import { ReportModulePageView } from "@/features/reports/modules/views/ReportModulePageView"
import { asReportModuleKey, workspaceModuleRedirect } from "@/features/workspace/config/workspace-module-routing"

export default async function EngagementModulePage({ params, searchParams }: {
    params: Promise<{ module: string }>
    searchParams: Promise<ReportRouteSearchParams>
}) {
    const [{ module }, query] = await Promise.all([params, searchParams])
    const destination = workspaceModuleRedirect("engagement", module, query.tab)
    if (destination) redirect(reportHref(destination, query, { tab: null }))
    if (!isReportModuleRoute("ministry", module)) notFound()
    return <ReportModulePageView section="ministry" module={asReportModuleKey(module)} pageContext="workspace" />
}
