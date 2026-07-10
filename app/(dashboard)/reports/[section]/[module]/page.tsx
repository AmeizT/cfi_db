import { notFound } from "next/navigation"
import { ReportModulePageView } from "@/features/reports/modules/views/ReportModulePageView"
import { isReportModuleRoute } from "@/features/reports/modules/config/report-modules"
import type {
    ReportModuleKey,
    ReportSection,
} from "@/features/reports/modules/types/report-modules"

type ReportModulePageProps = {
    params: Promise<{
        section: string
        module: string
    }>
}

export default async function ReportModulePage({
    params,
}: ReportModulePageProps) {
    const { section, module } = await params

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
