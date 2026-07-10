import { KPI } from "@/components/ui/kpi"
import { KPIItem } from "../types/analytics.types"

interface AnalyticsKPIProps {
    item: KPIItem
}

export function AnalyticsKPI({ item }: AnalyticsKPIProps) {
    return (
        <KPI className="border-none bg-none">
            <KPI.Content className="mt-0">
                <KPI.Value className="text-4xl">{item.value}</KPI.Value>

                {/* <KPI.Trend>
                    <TrendChip
                        value={0}
                    />
                </KPI.Trend> */}
            </KPI.Content>

            <KPI.Header>
                <KPI.Title className="text-base">{item.label}</KPI.Title>
            </KPI.Header>
        </KPI>
    )
}