import { notFound, redirect } from "next/navigation"

import { reportHref, type ReportRouteSearchParams } from "@/features/reports/modules/lib/report-route-redirect"
import {
    workspaceModuleRedirect,
    type WorkspaceSectionSlug,
} from "@/features/workspace/config/workspace-module-routing"

export default async function WorkspaceModulePage({
    params,
    searchParams,
}: {
    params: Promise<{ section: string; module: string }>
    searchParams: Promise<ReportRouteSearchParams>
}) {
    const [{ section, module }, query] = await Promise.all([params, searchParams])
    if (section !== "finance" && section !== "engagement") notFound()

    const destination = workspaceModuleRedirect(
        section as WorkspaceSectionSlug,
        module,
        query.tab,
    )
    redirect(reportHref(destination ?? `/${section}/${module}`, query, { tab: null }))
}
