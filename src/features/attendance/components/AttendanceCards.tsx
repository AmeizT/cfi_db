"use client"

import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { TrendingUp } from "lucide-react"
import { IconBook, IconCalendarEvent, IconCalendarWeek, IconClockHour6, IconNotebook } from "@tabler/icons-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

interface AttendanceCardsProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any[]
}

const categoryColors = {
    sunday: "bg-blue-100 text-blue-800 dark:text-primary dark:bg-primary/20",
    friday: "bg-purple-100 text-purple-800 dark:text-purple-500 dark:bg-purple-500/20",
    homecell: "bg-green-100 text-green-800 dark:text-green-500 dark:bg-green-500/20",
}

const categoryIcons = {
    sunday: IconCalendarWeek,
    friday: IconClockHour6,
    homecell: IconBook,
}

export function AttendanceCards({ data }: AttendanceCardsProps) {
    const formatTime = (timeString: string) => {
        return new Date(timeString).toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        })
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        })
    }

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-semibold text-neutral-700 dark:text-white">
                Recent Services
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {data.slice(0, 6).map((record) => {
                    const CategoryIcon = categoryIcons[record.category as keyof typeof categoryIcons]
                    return (
                        <Card key={record.id} className="py-4 hover:shadow-md transition-shadow dark:bg-neutral-800 dark:border-neutral-700 rounded-2xl">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <CategoryIcon className="h-5 w-5 text-muted-foreground" />
                                        <CardTitle className="text-lg capitalize">
                                            {record.category} Service
                                        </CardTitle>
                                    </div>

                                    <Badge className={`${categoryColors[record.category as keyof typeof categoryColors]} px-2.5 h-6 flex items-center capitalize`}>
                                        {record.category}
                                    </Badge>
                                </div>

                                <CardDescription className="flex items-center justify-between">
                                    <span className="flex items-center gap-1">
                                        <IconCalendarEvent className="size-4" />
                                        {formatDate(record.timestamp)}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <IconClockHour6 className="size-4" />
                                        {formatTime(record.start_time)} - {formatTime(record.end_time)}
                                    </span>
                                </CardDescription>
                            </CardHeader>

                            <CardContent className="space-y-4">
                                <div className="space-y-0">
                                    <div className="flex items-center gap-2">
                                        <IconNotebook className="size-4 text-muted-foreground" />
                                        <span className="text-sm font-semibold">
                                            {record.sermon}
                                        </span>
                                    </div>

                                    <p className="text-sm text-muted-foreground ml-6">
                                        by {record.preacher}
                                    </p>

                                    {record.scriptures && <p className="text-sm text-primary ml-6">{record.scriptures}</p>}
                                    {/* {record.homecell && (
                                        <div className="flex items-center gap-2 ml-6">
                                            <MapPin className="size-4 text-gray-500" />
                                            <span className="text-sm text-muted-foreground">{record.homecell}</span>
                                        </div>
                                    )} */}
                                </div>

                                <Separator className="bg-zinc-200 dark:bg-neutral-700" />

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-4">
                                        <div className="flex flex-col">
                                            <span className="order-2 text-sm text-muted-foreground">
                                                Headcount
                                            </span>
                                            <span className="font-semibold text-xl">
                                                {record.headcount}
                                            </span>
                                        </div>

                                        <div className="flex flex-col">
                                            <span className="order-2 text-sm text-muted-foreground">
                                                Adults
                                            </span>
                                            <span className="font-semibold text-xl">
                                                {record.adults}
                                            </span>
                                        </div>

                                        <div className="flex flex-col">
                                            <span className="order-2 text-sm text-muted-foreground">
                                                Children
                                            </span>
                                            <span className="font-semibold text-xl">
                                                {record.children}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex flex-col items-end">
                                            <span className="order-2 text-sm text-muted-foreground">
                                                Visitors
                                            </span>
                                            <span className="font-semibold text-xl text-green-500">
                                                {record.visitors}
                                            </span>
                                        </div>

                                        <div className="flex flex-col items-end">
                                            <span className="order-2 text-sm text-muted-foreground">
                                                Newcomers
                                            </span>
                                            <span className="font-semibold text-xl text-green-500">
                                                {record.newcomers}
                                            </span>
                                        </div>

                                        <div className="flex flex-col items-end">
                                            <span className="order-2 text-sm text-muted-foreground">
                                                Altar Call
                                            </span>
                                            <span className="font-semibold text-xl text-green-500">
                                                {record.altar_call}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>

                            <CardFooter className="px-4 w-full flex flex-col gap-1.5">
                                {record?.baptism > 0 && (
                                    <div className="w-full bg-blue-50 dark:bg-primary/10 p-3 rounded-xl">
                                        <div className="flex items-center gap-2">
                                            <TrendingUp className="size-4 text-primary" />
                                            <span className="text-sm font-medium text-primary">
                                                {record.baptism} Baptism{record?.baptism > 1 ? "s" : ""} Performed
                                            </span>
                                        </div>
                                    </div>
                                )}

                                {record?.summary && (
                                    <div className="w-full bg-gray-50 dark:bg-teal-500/10 p-3 rounded-xl">
                                        <p className="text-sm text-gray-700 dark:text-teal-500">
                                            {record?.summary}
                                        </p>
                                    </div>
                                )}

                                {record.achievements && (
                                    <div className="w-full bg-teal-500/20 dark:bg-teal-500/10 p-3 rounded-xl">
                                        <h4 className="text-sm font-medium text-teal-500 mb-0">
                                            Achievements
                                        </h4>
                                        <p className="text-sm text-teal-500">
                                            {record.achievements}
                                        </p>
                                    </div>
                                )}
                            </CardFooter>
                        </Card>
                    )
                })}
            </div>
        </div>
    )
}
