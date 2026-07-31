"use client"

import React from "react"
import { EmptyState } from "@/components/ui/empty-state"

import {
    Bar,
    BarChart,
    CartesianGrid,
    Rectangle,
    RectangleProps,
    ResponsiveContainer,
    YAxis,
    XAxis,
} from "recharts"

import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from "@/components/ui/chart"

import { ChartSeries } from "../types/analytics.types"

interface AnalyticsChartProps<T> {
    data: T[]
    xKey: keyof T
    series: ChartSeries[]
    activeIndex?: number
    config?: ChartConfig
    height?: number
    barSize?: number
}

export function AnalyticsChart<T extends Record<string, unknown>>({
    data,
    xKey,
    series,
    activeIndex,
    config = {},
    height = 326,
    barSize = 28
}: AnalyticsChartProps<T>) {
    const chartSeries = series?.[0]

    return (
        <React.Fragment>
            {chartSeries ? (
                <ChartContainer
                    config={config}
                    className="py-4 aspect-auto w-full"
                    style={{ height }}
                >
                    <ResponsiveContainer>
                        <BarChart accessibilityLayer data={data}>
                            <CartesianGrid
                                strokeDasharray="3 3"
                            />

                            <YAxis
                                tickLine={false}
                                axisLine={false}
                                tickMargin={8}
                                width={44}
                                allowDecimals={false}
                                tickFormatter={(value: number) =>
                                    value >= 1000 ? `${value / 1000}k` : String(value)
                                }
                            />

                            <XAxis
                                dataKey={String(xKey)}
                                tickLine={false}
                                tickMargin={10}
                                axisLine={false}
                            />

                            {/* <YAxis /> */}

                            <ChartTooltip
                                cursor={false}
                                content={<ChartTooltipContent />}
                            />

                            <Bar
                                dataKey={(chartSeries?.key ?? "")}
                                fill={chartSeries?.color}
                                radius={24}
                                strokeWidth={2}
                                barSize={barSize}
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                shape={(props: any) => {
                                    const {
                                        index,
                                        fill,
                                        payload,
                                        ...rest
                                    } = props || {}

                                    const isActive =
                                        activeIndex !== undefined &&
                                        index === activeIndex

                                    return isActive ? (
                                        <Rectangle
                                            {...(rest as RectangleProps)}
                                            fill={fill}
                                            fillOpacity={0.8}
                                            stroke={payload?.fill || fill}
                                            strokeDasharray="6 4"
                                        />
                                    ) : (
                                        <Rectangle
                                            {...(rest as RectangleProps)}
                                            fill={fill}
                                        />
                                    )
                                }}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </ChartContainer>
            ) : (
                <div className="w-full p-10 border-[1.5px] border-dashed border-border-subtle rounded-xl text-center">
                    <EmptyState type="analyticsChart" />
                </div>
            )}
        </React.Fragment>
    )
}