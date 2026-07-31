import { AnalyticsChart } from "./AnalyticsChart"
import { AnalyticsConfig } from "../types/analytics.types"
import { Flex } from "@/components/ui/box"
import { DataTable } from "../../core/components/DataTable"
import { PerformanceInsight } from "./PerformanceInsight"
import { AnalyticsKPI } from "./AnalyticsKpi"

interface AnalyticsDashboardProps<
    T extends { id: string | number } & Record<string, unknown>
> {
    data: T[]
    config: AnalyticsConfig
    activeIndex?: number
}

interface AnalyticsSectionHeadingProps {
    title: string
    description?: string
}

function AnalyticsSectionHeading({
    title,
    description
}: AnalyticsSectionHeadingProps) {
    return (
        <div className="space-y-0">
            <h2 className="text-left text-2xl font-bold tracking-tight capitalize">
                {title}
            </h2>

            {description ? (
                <p className="max-w-sm text-[15px] text-muted">
                    {description}
                </p>
            ) : null}
        </div>
    )
}

export function AnalyticsDashboard<
T extends { id: string | number } & Record<string, unknown>
>({
    data,
    config,
    activeIndex
}: AnalyticsDashboardProps<T>) {
    const tableRows = data.map((row, index) => ({
        ...row,
        id: typeof row.id === "number" ? row.id : index + 1,
    }))

    return (
        <div className="mt-4 w-full space-y-4">
            <AnalyticsSectionHeading
                title={"Performance Metrics"}
                description={"Key measurements that provide insight into activity, growth, and overall performance."}
            />

            <Flex align="start" gap={2}>
                <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-0">
                    {config.kpisWithChart?.map((kpi) => (
                        <div key={kpi.key} className="pr-4 py-0 space-y-0 rounded-0 border-border-subtle first:border-r nth-[3]:border-r first:border-b nth-[2]:border-b">
                            <AnalyticsKPI
                                item={kpi}
                            />

                            <AnalyticsChart
                                data={data}
                                xKey={kpi.chart.xKey}
                                series={kpi.chart.series}
                                activeIndex={activeIndex}
                            />
                        </div>
                    ))}
                </div>

                {/* {config.performance ? (
                    <PerformanceInsight
                        best={config.performance.best}
                        worst={config.performance.worst}
                    />
                ) : (
                    <div className="w-1/4"></div>
                )} */}
            </Flex>

            <hr className="w-full border border-wavy border-border-subtle" />

            <div className="space-y-1">
                <AnalyticsSectionHeading
                    title={"Cumulative Performance"}
                    description={"A detailed breakdown of performance and activity for the year."}
                />
            </div>

            <DataTable
                variant="advanced"
                data={tableRows}
                config={config.table}
                rowHeight={36}
                footerData={undefined}
                showRowActions={false}
                enableDelete={false}
            />
      </div>
    )
}
