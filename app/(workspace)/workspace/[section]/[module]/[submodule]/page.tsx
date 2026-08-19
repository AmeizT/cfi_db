import { notFound, redirect } from "next/navigation"

import { reportHref, type ReportRouteSearchParams } from "@/features/reports/modules/lib/report-route-redirect"
import {
    workspaceSubmoduleRedirect,
    type WorkspaceSectionSlug,
} from "@/features/workspace/config/workspace-module-routing"

export default async function WorkspaceSubmodulePage({
    params,
    searchParams,
}: {
    params: Promise<{ section: string; module: string; submodule: string }>
    searchParams: Promise<ReportRouteSearchParams>
}) {
    const [{ section, module, submodule }, query] = await Promise.all([params, searchParams])
    if (section !== "finance" && section !== "engagement") notFound()

    const destination = workspaceSubmoduleRedirect(
        section as WorkspaceSectionSlug,
        module,
        submodule,
    )
    redirect(reportHref(destination ?? `/${section}/${module}/${submodule}`, query, { tab: null }))
}
