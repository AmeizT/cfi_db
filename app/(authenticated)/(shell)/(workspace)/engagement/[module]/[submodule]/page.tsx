import { notFound, redirect } from "next/navigation"
import { isReportModuleRoute } from "@/features/reports/modules/config/report-modules"
import { isReportSubmoduleRoute } from "@/features/reports/modules/config/report-submodules"
import { reportHref, type ReportRouteSearchParams } from "@/features/reports/modules/lib/report-route-redirect"
import { ReportModulePageView } from "@/features/reports/modules/views/ReportModulePageView"
import { asReportModuleKey, workspaceSubmoduleRedirect } from "@/features/workspace/config/workspace-module-routing"

export default async function EngagementSubmodulePage({ params, searchParams }: {
    params: Promise<{ module: string; submodule: string }>
    searchParams: Promise<ReportRouteSearchParams>
}) {
    const [{ module, submodule }, query] = await Promise.all([params, searchParams])
    const destination = workspaceSubmoduleRedirect("engagement", module, submodule)
    if (destination) redirect(reportHref(destination, query, { tab: null }))
    const reportModule = asReportModuleKey(module)
    if (!isReportModuleRoute("ministry", module) || !isReportSubmoduleRoute("ministry", reportModule, submodule)) notFound()
    return <ReportModulePageView section="ministry" module={reportModule} submodule={submodule} pageContext="workspace" />
}
