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
            <h2 className="text-left text-xl font-bold tracking-tight capitalize">
                {title}
            </h2>

            {description ? (
                <p className="text-lg text-muted">
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
        <div className="w-full space-y-4">
            <AnalyticsSectionHeading
                title={"Performance Metrics"}
                description={"Key measurements that provide insight into activity, growth, and overall performance."}
            />

            <Flex align="start" gap={2} className="">
                <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-2">
                    {config.kpisWithChart?.map((kpi) => (
                    <div key={kpi.key} className="space-y-0 rounded-2xl border border-border bg-white">
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

            <div className="space-y-1">
                <AnalyticsSectionHeading
                    title={"Annual Performance Summary"}
                    description={"A detailed breakdown of performance and activity for the year."}
                />
            </div>

            <DataTable
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
