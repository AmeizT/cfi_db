"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { IconCalendarEvent, IconHearts, IconTrendingUp, IconUsers } from "@tabler/icons-react"

interface AttendanceStatsProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any[]
}

export function AttendanceStats({ data }: AttendanceStatsProps) {
    const totalAttendance = data?.reduce((sum, record) => sum + record.headcount, 0)
    const totalVisitors = data?.reduce((sum, record) => sum + record.visitors, 0)
    const totalNewcomers = data?.reduce((sum, record) => sum + record.newcomers, 0)
    const totalAltarCalls = data?.reduce((sum, record) => sum + record.altar_call, 0)
    const totalBaptisms = data?.reduce((sum, record) => sum + record.baptism, 0)

    const averageAttendance = Math.round(totalAttendance / data.length)

    // Calculate growth percentage (comparing last 4 vs previous 4 records)
    const recentRecords = data?.slice(0, 4)
    const previousRecords = data?.slice(4, 8)
    const recentAvg = recentRecords?.reduce((sum, record) => sum + record?.headcount, 0) / recentRecords.length
    const previousAvg = previousRecords?.reduce((sum, record) => sum + record?.headcount, 0) / previousRecords.length
    const growthPercentage = previousAvg > 0 ? ((recentAvg - previousAvg) / previousAvg) * 100 : 0

    const stats = [
        {
            title: "Total Attendance",
            value: totalAttendance.toLocaleString(),
            description: `Avg: ${averageAttendance} per service`,
            icon: IconUsers,
            color: "text-theme-600 dark:text-primary",
            bgColor: "bg-theme-50 dark:bg-primary/10",
            change: `${growthPercentage > 0 ? "+" : ""}${growthPercentage.toFixed(1)}%`,
            changeColor: growthPercentage >= 0 ? "text-green-600" : "text-red-600",
        },
        {
            title: "Visitors",
            value: totalVisitors.toLocaleString(),
            description: "New faces in services",
            icon: IconTrendingUp,
            color: "text-green-600 dark:text-green-500",
            bgColor: "bg-green-50 dark:bg-green-500/10",
            change: `${totalNewcomers} newcomers`,
            changeColor: "text-green-600",
        },
        {
            title: "Services Held",
            value: data.length.toString(),
            description: "This period",
            icon: IconCalendarEvent,
            color: "text-purple-600",
            bgColor: "bg-purple-50 dark:bg-purple-500/10",
            change: "Multiple locations",
            changeColor: "text-purple-600 dark:text-purple-500",
        },
        {
            title: "Altar Calls",
            value: totalAltarCalls.toLocaleString(),
            description: `${totalBaptisms} baptisms`,
            icon: IconHearts,
            color: "text-red-600 dark:text-rose-500",
            bgColor: "bg-red-50 dark:bg-rose-500/10",
            change: "Spiritual growth",
            changeColor: "text-red-600 dark:text-rose-500",
        },
    ]

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat) => {
                const IconComponent = stat.icon
                return (
                    <Card key={stat.title} className="py-4 rounded-2xl shadow-none dark:bg-neutral-800 dark:border-neutral-700">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                {stat.title}
                            </CardTitle>

                            <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                                <IconComponent strokeWidth={1.75} className={`size-4.5 ${stat.color}`} />
                            </div>
                        </CardHeader>

                        <CardContent>
                            <div className="text-2xl font-bold text-neutral-700 dark:text-white">
                                {stat.value}
                            </div>

                            <div className="flex items-center justify-between mt-1">
                                <p className="text-xs text-muted-foreground">
                                    {stat.description}
                                </p>

                                <span className={`text-xs font-medium ${stat.changeColor}`}>
                                    {stat.change}
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                )
            })}
        </div>
    )
}
