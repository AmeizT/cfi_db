import { getMetaData } from "@/config/metadata"
import { ReportModulePageView } from "@/features/reports/modules/views/ReportModulePageView"

const meta = getMetaData({ title: "Reporting Performance" })
export const metadata = { ...meta }

export default function ReportingPerformancePage() {
    return <ReportModulePageView section="performance" module="overview" />
}
