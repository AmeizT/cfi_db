// interface IncomeChartProps {
//     data: Income[],
//     tithes: Tithe[]
// }

// interface ChartDataEntry {
//     month: string
//     donations: number
//     thanksgiving: number
//     offering: number
//     fundraising: number
//     tithes: number
// }

// export function IncomeChart({ data, tithes }: IncomeChartProps) {
//     const createDynamicMonthsArray = (incomeData: Income[]) => {
//         const sortedIncome = [...incomeData].sort((a, b) =>
//             moment(a.timestamp, "YYYYMMDDTHH").diff(moment(b.timestamp, "YYYYMMDDTHH"))
//         )

//         const startDate = moment(sortedIncome[0]?.timestamp, "YYYYMMDDTHH")
//         const endDate = moment()
//         const months = []

//         const currentDate = startDate.clone().startOf('month')

//         while (currentDate.isSameOrBefore(endDate, 'month')) {
//             if (currentDate.isSame(endDate, 'year')) {
//                 months.push(currentDate.format('MMMM YYYY'))
//             }
//             currentDate.add(1, 'month')
//         }

//         return months
//     }

//     const createChartData = (incomeData: Income[], tithesData: Tithe[]) => {
//         const months = createDynamicMonthsArray(incomeData)

//         const chartData: ChartDataEntry[] = months.map(month => ({
//             month,
//             donations: 0,
//             thanksgiving: 0,
//             offering: 0,
//             fundraising: 0,
//             tithes: 0
//         }))

//         incomeData.forEach(entry => {
//             const entryMonth = moment(entry.timestamp, "YYYYMMDDTHH").format('MMMM YYYY')
//             const monthIndex = months.indexOf(entryMonth)

//             if (monthIndex !== -1) {
//                 chartData[monthIndex] = {
//                     ...chartData[monthIndex],
//                     donations: Number(entry.donations),
//                     thanksgiving: Number(entry.thanksgiving),
//                     offering: Number(entry.offering),
//                     fundraising: Number(entry.fundraising),
//                 }
//             }
//         })

//         tithesData.forEach(tithe => {
//             const titheMonth = moment(tithe.timestamp).format('MMMM YYYY')
//             const monthIndex = months.indexOf(titheMonth)

//             if (monthIndex !== -1) {
//                 chartData[monthIndex].tithes += Number(tithe.amount)
//             }
//         })

//         return chartData
//     }

//     const dynamicChartData = createChartData(data, tithes)

//     const chartConfig = {
//         donations: {
//             label: "Donations",
//             color: "hsl(var(--chart-2))",
//         },
//         fundraising: {
//             label: "Fundraising",
//             color: "hsl(var(--chart-1))",
//         },
//         offering: {
//             label: "Offering",
//             color: "hsl(var(--chart-3))",
//         },
//         thanksgiving: {
//             label: "Thanksgiving",
//             color: "hsl(var(--chart-4))",
//         },
//         tithes: {
//             label: "Tithes",
//             color: "hsl(var(--chart-5))",
//         },
//     } satisfies ChartConfig

//     return (
//         <Card className="p-3 xl:p-6 w-full flex flex-col gap-y-3 xl:gap-y-6 rounded-xl border border-border-muted bg-linear-to-br from-white to-white dark:from-dark-900 dark:to-dark-900 dark:shadow-layered-depth">
//             <CardHeader>
//                 <CardTitle>Yearly Generated Income</CardTitle>

//                 <CardDescription className="text-body-muted">
//                     Showing income generated this year.
//                 </CardDescription>
//             </CardHeader>

//             <CardContent>
//                 <ChartContainer config={chartConfig} className="w-full h-[200px] xl:h-[260px]">
//                     <BarChart accessibilityLayer data={dynamicChartData}>
//                         <CartesianGrid vertical={false} />
//                         <XAxis
//                             dataKey="month"
//                             tickLine={false}
//                             tickMargin={10}
//                             axisLine={false}
//                             tickFormatter={(value) => value.slice(0, 3)}
//                         />
//                         <ChartTooltip content={<ChartTooltipContent />} />
//                         <Bar dataKey="donations" fill="var(--color-donations)" radius={4} />
//                         <Bar dataKey="fundraising" fill="var(--color-fundraising)" radius={4} />
//                         <Bar dataKey="offering" fill="var(--color-offering)" radius={4} />
//                         <Bar dataKey="thanksgiving" fill="var(--color-thanksgiving)" radius={4} />
//                         <Bar dataKey="tithes" fill="var(--color-tithes)" radius={4} />
//                     </BarChart>
//                 </ChartContainer>
//             </CardContent>
//         </Card>
//     )
// }

