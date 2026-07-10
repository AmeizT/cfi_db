import { getMetaData } from "@/config/metadata"
import { ReportsOverviewPageView } from "@/features/reports/modules/views/ReportsOverviewPageView"

const meta = getMetaData({ title: "Reporting Overview" })
export const metadata = { ...meta }

export default function ReportingOverviewPage() {
    return <ReportsOverviewPageView />
}
