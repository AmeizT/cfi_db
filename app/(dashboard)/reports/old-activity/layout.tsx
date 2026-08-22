import View from "@/components/ui/view"
import { ReportActivityNavigation } from "@/features/reports/activity/components/ReportActivityNavigation"

export default function ReportActivityLayout({ children }: { children: React.ReactNode }) {
    return (
        <View className="gap-0">
            <View.Header pagename="Report Activity" />
            <ReportActivityNavigation />
            <View.Body className="gap-4 py-4">{children}</View.Body>
        </View>
    )
}
