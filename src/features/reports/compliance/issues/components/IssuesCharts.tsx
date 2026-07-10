"use client"

import {
    Bar,
    BarChart,
    CartesianGrid,
    XAxis,
    YAxis,
} from "recharts"
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from "@/components/ui/chart"
import { EmptyState } from "@/components/ui/empty-state"

export type IssueChartDatum = {
    label: string
    total: number
}

type IssuesBarChartProps = {
    title: string
    description: string
    data: IssueChartDatum[]
    color?: string
}

const chartConfig = {
    total: {
        label: "Issues",
        color: "var(--chart-1)",
    },
} satisfies ChartConfig

export function IssuesBarChart({
    title,
    description,
    data,
    color = "var(--color-total)",
}: IssuesBarChartProps) {
    return (
        <div className="rounded-lg border border-border bg-card p-4">
            <div className="mb-4">
                <h3 className="text-sm font-semibold text-foreground">{title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{description}</p>
            </div>

            {data.length ? (
                <ChartContainer
                    aria-label={title}
                    config={chartConfig}
                    className="h-64 w-full"
                >
                    <BarChart accessibilityLayer data={data}>
                        <CartesianGrid vertical={false} strokeDasharray="3 3" />
                        <XAxis
                            dataKey="label"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                        />
                        <YAxis
                            allowDecimals={false}
                            tickLine={false}
                            axisLine={false}
                            width={32}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent />}
                        />
                        <Bar
                            dataKey="total"
                            fill={color}
                            radius={[6, 6, 0, 0]}
                        />
                    </BarChart>
                </ChartContainer>
            ) : (
                <div className="flex min-h-64 items-center justify-center rounded-lg border border-dashed border-border bg-muted/30 p-6">
                    <EmptyState
                        type="analyticsChart"
                        variant="heading"
                        context={{ label: "issues" }}
                    />
                </div>
            )}
        </div>
    )
}

