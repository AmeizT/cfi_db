"use client"

import { getYear } from "date-fns"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
    ChartConfig,
    ChartContainer,
    // ChartLegend,
    // ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import { useCashflow } from "../hooks/use-cashflow"
import { Flex } from "@/components/ui/box"
import { Separator } from "@/components/ui/separator"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { IconCheck, IconSelector } from "@tabler/icons-react"
import React from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

export function ExpensesChart() {
    const { data } = useCashflow()
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const fy = searchParams.get("fy")

    const chartData = data?.expenditureSeries

    const chartConfig = {
        total: {
            color: "var(--user-theme)",
        }
    } satisfies ChartConfig

    const startYear = 2023
    const currentYear = getYear(new Date())

    const financialYears = Array.from(
        { length: currentYear - startYear + 1 },
        (_, i) => startYear + i
    )

    const createQueryString = React.useCallback(
        (name: string, value: string) => {
            const params = new URLSearchParams(searchParams.toString())
            params.set(name, value)

            return params.toString()
        },
        [searchParams]
    )

    return (
        <Flex direction="column" gap={4}>
            <div className="w-full flex items-center gap-3">
                <button className="py-1 px-2 text-sm font-semibold border border-gray-300 shadow-sm rounded-md">
                    Jan 01, 2025 - Aug 31, 2025
                </button>

                <Separator orientation="vertical" className="data-[orientation=vertical]:h-4 bg-gray-300"  />

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className="py-1 px-2 flex items-center text-sm font-semibold border border-gray-300 shadow-sm rounded-md">
                            <span className="text-gray-500">Financial Year: &nbsp;</span> {fy} <IconSelector strokeWidth={2.5} className="size-4 ml-2 text-gray-600" />
                        </button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent className="w-[180px] rounded-lg border-gray-300">
                        {financialYears.map((year: number) => (
                            <DropdownMenuItem key={year} asChild>
                                <button className="w-full flex items-center justify-between rounded-md" onClick={() => {
                                        router.push(pathname + "?" + createQueryString("fy", String(year)))
                                    }}
                                >
                                    {year} {String(year) === fy && <IconCheck />}
                                    
                                </button>
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <div className="w-full">
                <h3 className="font-bold text-xl">
                    Expenses
                </h3>
                <p className="text-sm text-gray-500 dark:text-neutral-400">
                    Overview of monthly expenses including both fixed and variable costs.
                </p>
            </div>
            <ChartContainer config={chartConfig} className="min-h-60 w-full">
                <BarChart accessibilityLayer data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    {/* <XAxis
                    dataKey="month"
                    tickLine={true}
                    tickMargin={10}
                    axisLine={false}
                    tickFormatter={(total) => total.slice(0, 3)}
                /> */}
                    <XAxis dataKey="month" className="text-muted-foreground" tick={{ fontSize: 10 }} tickMargin={8} />
                    <YAxis
                        className="text-muted-foreground"
                        tick={{ fontSize: 10 }}
                        tickMargin={8}
                        tickFormatter={(total) => `$${(total / 1000).toFixed(0)}k`}
                        width={40}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    {/* <ChartLegend content={<ChartLegendContent />} /> */}
                    <Bar dataKey="total" fill="var(--color-total)" radius={4} />
                    {/* <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} /> */}
                </BarChart>
            </ChartContainer>
        </Flex>
    )
}
