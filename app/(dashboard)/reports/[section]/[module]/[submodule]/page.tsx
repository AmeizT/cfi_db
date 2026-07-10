import { notFound } from "next/navigation"
import { ReportModulePageView } from "@/features/reports/modules/views/ReportModulePageView"
import { isReportModuleRoute } from "@/features/reports/modules/config/report-modules"
import { isReportSubmoduleRoute } from "@/features/reports/modules/config/report-submodules"
import type {
    ReportModuleKey,
    ReportSection,
} from "@/features/reports/modules/types/report-modules"

type ReportSubmodulePageProps = {
    params: Promise<{
        section: string
        module: string
        submodule: string
    }>
}

export default async function ReportSubmodulePage({
    params,
}: ReportSubmodulePageProps) {
    const { section, module, submodule } = await params

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
