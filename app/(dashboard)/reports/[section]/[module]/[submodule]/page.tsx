import { notFound, redirect } from "next/navigation"
import { ReportModulePageView } from "@/features/reports/modules/views/ReportModulePageView"
import { isReportModuleRoute } from "@/features/reports/modules/config/report-modules"
import { isReportSubmoduleRoute } from "@/features/reports/modules/config/report-submodules"
import type {
    ReportModuleKey,
    ReportSection,
} from "@/features/reports/modules/types/report-modules"
import { reportHref, type ReportRouteSearchParams } from "@/features/reports/modules/lib/report-route-redirect"

type ReportSubmodulePageProps = {
    params: Promise<{
        section: string
        module: string
        submodule: string
    }>
    searchParams: Promise<ReportRouteSearchParams>
}

export default async function ReportSubmodulePage({
    params,
    searchParams,
}: ReportSubmodulePageProps) {
    const [{ section, module, submodule }, query] = await Promise.all([params, searchParams])

    if (submodule === "analytics" && ["attendance", "tithes", "income-expenditure"].includes(module)) {
        const pathname = module === "income-expenditure"
            ? "/reports/financial-activity/cumulative"
            : `/reports/${section}/${module}/cumulative`
        redirect(reportHref(pathname, query))
    }

    if (section === "finance" && module === "income-expenditure") {
        const view = submodule === "cumulative" ? "cumulative" : "statement"
        redirect(reportHref(`/reports/financial-activity/${view}`, query, { tab: null }))
    }

    if (!isReportModuleRoute(section, module)) {
        notFound()
    }

    if (!isReportSubmoduleRoute(
        section as ReportSection,
        module as ReportModuleKey,
        submodule,
    )) {
        notFound()
    }

    return (
        <ReportModulePageView
            section={section as ReportSection}
            module={module as ReportModuleKey}
            submodule={submodule}
        />
    )
}
