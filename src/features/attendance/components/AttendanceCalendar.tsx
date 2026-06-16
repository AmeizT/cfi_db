"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, CalendarIcon } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface AttendanceCalendarProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any[]
}

export function AttendanceCalendar({ data }: AttendanceCalendarProps) {
    const [currentDate, setCurrentDate] = useState(new Date())

    const categoryColors = {
        SUNDAY: "bg-theme-500",
        FRIDAY: "bg-purple-500",
        HOMECELL: "bg-green-500",
    }

    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear()
        const month = date.getMonth()
        const firstDay = new Date(year, month, 1)
        const lastDay = new Date(year, month + 1, 0)
        const daysInMonth = lastDay.getDate()
        const startingDayOfWeek = firstDay.getDay()

        const days = []

        // Add empty cells for days before the first day of the month
        for (let i = 0; i < startingDayOfWeek; i++) {
            days.push(null)
        }

        // Add days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            days.push(new Date(year, month, day))
        }

        return days
    }

    const getAttendanceForDate = (date: Date | null) => {
        if (!date) return []
        const dateString = date.toISOString().split("T")[0]
        return data.filter((record) => record.timestamp === dateString)
    }

    const navigateMonth = (direction: "prev" | "next") => {
        setCurrentDate((prev) => {
            const newDate = new Date(prev)
            if (direction === "prev") {
                newDate.setMonth(prev.getMonth() - 1)
            } else {
                newDate.setMonth(prev.getMonth() + 1)
            }
            return newDate
        })
    }

    const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ]

    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

    const days = getDaysInMonth(currentDate)

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                            <CalendarIcon className="h-5 w-5" />
                            Attendance Calendar
                        </CardTitle>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" onClick={() => navigateMonth("prev")}>
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <span className="font-medium min-w-[140px] text-center">
                                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                            </span>
                            <Button variant="outline" size="sm" onClick={() => navigateMonth("next")}>
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-7 gap-1 mb-4">
                        {dayNames.map((day) => (
                            <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
                                {day}
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-7 gap-1">
                        {days.map((day, index) => {
                            const attendance = getAttendanceForDate(day)
                            const totalAttendance = attendance.reduce((sum, record) => sum + record.headcount, 0)

                            return (
                                <div
                                    key={index}
                                    className={`min-h-20 p-1 border rounded-lg ${day ? "bg-white hover:bg-gray-50" : "bg-gray-50"}`}
                                >
                                    {day && (
                                        <>
                                            <div className="text-sm font-medium text-gray-900 mb-1">{day.getDate()}</div>
                                            {attendance.length > 0 && (
                                                <div className="space-y-1">
                                                    {attendance.map((record) => (
                                                        <div
                                                            key={record.id}
                                                            className={`w-full h-1.5 rounded ${categoryColors[record.category as keyof typeof categoryColors]
                                                                }`}
                                                            title={`${record.category}: ${record.headcount} people`}
                                                        />
                                                    ))}
                                                    <div className="text-xs text-gray-600 font-medium">{totalAttendance}</div>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            )
                        })}
                    </div>

                    <div className="flex items-center gap-4 mt-4 pt-4 border-t">
                        <span className="text-sm text-gray-600">Legend:</span>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded bg-theme-500"></div>
                            <span className="text-xs">Sunday</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded bg-purple-500"></div>
                            <span className="text-xs">Friday</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded bg-green-500"></div>
                            <span className="text-xs">Homecell</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
