import { getMetaData } from "@/config/metadata"
import { ReportModulePageView } from "@/features/reports/modules/views/ReportModulePageView"

export const metadata = getMetaData({ title: "All Reports | Report Activity" })

export default function AllReportsActivityPage() {
    return <ReportModulePageView section="activity" module="all" />
}
