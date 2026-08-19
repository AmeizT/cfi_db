import View from "@/components/ui/view"
import { FinanceOverviewContainer } from "@/features/finance/overview/container/FinanceOverviewContainer"
import { ReportSourceBanner } from "@/features/reports/workflow/components/ReportSourceBanner"

export function WorkspaceFinanceView() {
    return (
        <View>
            <View.Header pagename="Finance" />
            <View.Body className="gap-4 py-4 lg:px-6">
                <ReportSourceBanner />
                <FinanceOverviewContainer />
            </View.Body>
        </View>
    )
}
