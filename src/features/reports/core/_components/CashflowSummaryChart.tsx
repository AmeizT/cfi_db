// "use client"

// import { TrendingUp } from "lucide-react"
// import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts"

// import {
//     Card,
//     CardContent,
//     CardDescription,
//     CardFooter,
//     CardHeader,
//     CardTitle,
// } from "@/components/ui/card"
// import {
//     ChartConfig,
//     ChartContainer,
//     ChartTooltip,
//     ChartTooltipContent,
// } from "@/components/ui/chart"

// export const description = "A bar chart with a custom label"

// const chartData = [
//     { month: "January", income: 186, expenses: 80 },
//     { month: "February", income: 305, expenses: 200 },
//     { month: "March", income: 237, expenses: 120 },
// ]

// const chartConfig = {
//     income: {
//         label: "Income",
//         color: "oklch(69.6% 0.17 162.48)",
//     },
//     expenses: {
//         label: "Expenses",
//         color: "oklch(64.5% 0.246 16.439)",
//     },
//     label: {
//         color: "var(--background)",
//     },
// } satisfies ChartConfig

// export function CashflowSummaryChart() {
//     return (
//         <Card className="chart-unstyled">
//             <CardHeader className="px-0">
//                 <CardTitle>Cashflow Overview</CardTitle>
//                 <CardDescription>Income vs Expenses for the past 3 months</CardDescription>
//             </CardHeader>
//             <CardContent className="px-0">
//                 <ChartContainer config={chartConfig}>
//                     <BarChart
//                         accessibilityLayer
//                         data={chartData}
//                         layout="vertical"
//                         margin={{
//                             right: 16,
//                         }}
//                     >
//                         <CartesianGrid horizontal={true} strokeDasharray="3 3" />
//                         <YAxis
//                             dataKey="month"
//                             type="category"
//                             tickLine={false}
//                             tickMargin={10}
//                             axisLine={false}
//                             tickFormatter={(value) => value.slice(0, 3)}
//                         />
//                         <XAxis dataKey="income" type="number" />
//                         <ChartTooltip
//                             cursor={false}
//                             content={<ChartTooltipContent indicator="line" />}
//                         />
//                         <Bar
//                             dataKey="income"
//                             layout="vertical"
//                             fill="var(--color-income)"
//                             radius={4}
//                         >
//                             <LabelList
//                                 dataKey="income"
//                                 position="right"
//                                 offset={8}
//                                 className="fill-foreground"
//                                 fontSize={12}
//                             />
//                         </Bar>

//                         <Bar
//                             dataKey="expenses"
//                             layout="vertical"
//                             fill="var(--color-expenses)"
//                             radius={4}
//                         >
//                             <LabelList
//                                 dataKey="expenses"
//                                 position="right"
//                                 offset={8}
//                                 className="fill-foreground"
//                                 fontSize={12}
//                             />
//                         </Bar>
//                     </BarChart>
//                 </ChartContainer>
//             </CardContent>
//             <CardFooter className="px-0 hidden flex-col items-start gap-2 text-sm">
//                 <div className="flex gap-2 leading-none font-medium">
//                     Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
//                 </div>
//                 <div className="text-muted-foreground leading-none">
//                     Showing total visitors for the last 6 months
//                 </div>
//             </CardFooter>
//         </Card>
//     )
// }


"use client"

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"

export const description = "A multiple bar chart"

const chartData = [
    { month: "January", desktop: 186, mobile: 80, other: 20 },
    { month: "February", desktop: 305, mobile: 200, other: 260 },
    { month: "March", desktop: 237, mobile: 120, other: 150 },
]

const chartConfig = {
    desktop: {
        label: "Desktop",
        color: "var(--chart-1)",
    },
    mobile: {
        label: "Mobile",
        color: "var(--chart-2)",
    },
    other: {
        label: "Other",
        color: "var(--chart-3)",
    },
} satisfies ChartConfig

export function CashflowSummaryChart() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Bar Chart - Multiple</CardTitle>
                <CardDescription>January - June 2024</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <BarChart accessibilityLayer data={chartData}>
                        <CartesianGrid vertical={false} strokeDasharray="3 3" />
                        <XAxis
                            dataKey="month"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            tickFormatter={(value) => value.slice(0, 3)}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent indicator="dashed" />}
                        />
                        <Bar dataKey="desktop" fill="var(--color-desktop)" radius={8} />
                        <Bar dataKey="mobile" fill="var(--color-mobile)" radius={8} />
                        <Bar dataKey="other" fill="var(--color-other)" radius={8} />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}

