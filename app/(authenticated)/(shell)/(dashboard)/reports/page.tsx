import { getMetaData } from "@/config/metadata"
import { ReportsOverviewView } from "@/features/reports/workflow/views/ReportsOverviewView"

const meta = getMetaData({ title: "Reports" })
export const metadata = { ...meta }

export default function ReportsPage() {
    return <ReportsOverviewView />
}
