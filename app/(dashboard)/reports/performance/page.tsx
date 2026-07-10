import { getMetaData } from "@/config/metadata"
import { ReportPerformancePageView } from "@/features/reports/modules/views/ReportPerformancePageView"

const meta = getMetaData({ title: "Reporting Performance" })
export const metadata = { ...meta }

export default function ReportingPerformancePage() {
    return <ReportPerformancePageView />
}
