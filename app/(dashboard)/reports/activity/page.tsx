import { getMetaData } from "@/config/metadata"
import { ReportActivityView } from "@/features/reports/workflow/views/ReportActivityView"

export const metadata = getMetaData({ title: "All Reports | Report Activity" })

export default function AllReportsActivityPage() {
    return <ReportActivityView />
}
