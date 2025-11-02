"use client"

import { useState } from "react"
import { TrendingUp } from "lucide-react"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { AttendanceCards } from "../components/AttendanceCards"
import { AttendanceStats } from "../components/AttendanceStats"
import { AttendanceCalendar } from "../components/AttendanceCalendar"
import { useAttendance } from "../hooks/use-attendance"

const attendanceData = [
    {
        id: 1,
        church: "Main Church",
        category: "SUNDAY",
        preacher: "Pastor John Smith",
        sermon: "Walking in Faith",
        scriptures: "Hebrews 11:1-6, Romans 10:17",
        headcount: 245,
        adults: 180,
        children: 45,
        visitors: 15,
        newcomers: 5,
        altar_call: 12,
        baptism: 3,
        summary: "Powerful service with strong response to altar call. Great fellowship time after service.",
        achievements: "3 new baptisms, 5 newcomers joined small groups",
        start_time: "2024-01-07T09:00:00Z",
        end_time: "2024-01-07T11:30:00Z",
        timestamp: "2024-01-07",
        homecell: null,
    },
    {
        id: 2,
        church: "Main Church",
        category: "FRIDAY",
        preacher: "Elder Mary Johnson",
        sermon: "Prayer and Fasting",
        scriptures: "Matthew 6:16-18, Joel 2:12",
        headcount: 85,
        adults: 70,
        children: 10,
        visitors: 3,
        newcomers: 2,
        altar_call: 8,
        baptism: 0,
        summary: "Intimate prayer service with deep spiritual connection.",
        achievements: "Strong prayer ministry activation",
        start_time: "2024-01-05T19:00:00Z",
        end_time: "2024-01-05T21:00:00Z",
        timestamp: "2024-01-05",
        homecell: null,
    },
    {
        id: 3,
        church: "Branch Church 1",
        category: "HOMECELL",
        preacher: "David Wilson",
        sermon: "Building Community",
        scriptures: "Acts 2:42-47",
        headcount: 18,
        adults: 15,
        children: 3,
        visitors: 2,
        newcomers: 1,
        altar_call: 3,
        baptism: 0,
        summary: "Great discussion and fellowship in small group setting.",
        achievements: "New member committed to regular attendance",
        start_time: "2024-01-03T19:30:00Z",
        end_time: "2024-01-03T21:30:00Z",
        timestamp: "2024-01-03",
        homecell: "North Side Group",
    },
    {
        id: 4,
        church: "Main Church",
        category: "SUNDAY",
        preacher: "Pastor John Smith",
        sermon: "The Power of Prayer",
        scriptures: "Matthew 6:5-15, James 5:16",
        headcount: 267,
        adults: 195,
        children: 52,
        visitors: 18,
        newcomers: 2,
        altar_call: 15,
        baptism: 1,
        summary: "Exceptional turnout with powerful message on prayer. Many testimonies shared.",
        achievements: "Record attendance for January, 1 baptism",
        start_time: "2024-01-14T09:00:00Z",
        end_time: "2024-01-14T11:45:00Z",
        timestamp: "2024-01-14",
        homecell: null,
    },
    {
        id: 5,
        church: "Branch Church 2",
        category: "FRIDAY",
        preacher: "Pastor Sarah Williams",
        sermon: "Healing and Restoration",
        scriptures: "Isaiah 53:5, 1 Peter 2:24",
        headcount: 92,
        adults: 78,
        children: 8,
        visitors: 5,
        newcomers: 1,
        altar_call: 20,
        baptism: 0,
        summary: "Powerful healing service with many testimonies of God's goodness.",
        achievements: "Strong healing ministry demonstration",
        start_time: "2024-01-12T19:00:00Z",
        end_time: "2024-01-12T21:15:00Z",
        timestamp: "2024-01-12",
        homecell: null,
    },
    {
        id: 6,
        church: "Main Church",
        category: "HOMECELL",
        preacher: "Elder Michael Brown",
        sermon: "Growing in Grace",
        scriptures: "2 Peter 3:18, Ephesians 4:15",
        headcount: 22,
        adults: 18,
        children: 4,
        visitors: 1,
        newcomers: 1,
        altar_call: 5,
        baptism: 0,
        summary: "Deep study on spiritual growth with excellent participation.",
        achievements: "New member expressed interest in baptism",
        start_time: "2024-01-10T19:30:00Z",
        end_time: "2024-01-10T21:30:00Z",
        timestamp: "2024-01-10",
        homecell: "Central Group",
    },
    {
        id: 7,
        church: "Main Church",
        category: "SUNDAY",
        preacher: "Guest Speaker - Rev. James Miller",
        sermon: "Living with Purpose",
        scriptures: "Jeremiah 29:11, Romans 8:28",
        headcount: 289,
        adults: 210,
        children: 58,
        visitors: 19,
        newcomers: 2,
        altar_call: 18,
        baptism: 2,
        summary: "Inspiring message from guest speaker. Great response from congregation.",
        achievements: "Highest attendance this month, 2 baptisms",
        start_time: "2024-01-21T09:00:00Z",
        end_time: "2024-01-21T12:00:00Z",
        timestamp: "2024-01-21",
        homecell: null,
    },
    {
        id: 8,
        church: "Branch Church 1",
        category: "FRIDAY",
        preacher: "Pastor Robert Davis",
        sermon: "Faith in Action",
        scriptures: "James 2:14-26, Galatians 5:6",
        headcount: 76,
        adults: 62,
        children: 9,
        visitors: 4,
        newcomers: 1,
        altar_call: 12,
        baptism: 0,
        summary: "Practical teaching on living out our faith daily.",
        achievements: "Strong commitment to community service",
        start_time: "2024-01-19T19:00:00Z",
        end_time: "2024-01-19T21:00:00Z",
        timestamp: "2024-01-19",
        homecell: null,
    },
]

export function AttendanceContainer() {
    const { data } = useAttendance()
    const attendance = data?.results ?? []
    const [activeView, setActiveView] = useState("overview")

    return (
        <div className="space-y-6 my-6">
            {/* <div className="px-8 pt-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Attendance Dashboard</h1>
                    <p className="text-gray-600 mt-1">Track and analyze church service attendance</p>
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Attendance
                </Button>
            </div> */}

            <Tabs value={activeView} onValueChange={setActiveView} className="px-8 w-full">
                {/* <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="table">Detailed Table</TabsTrigger>
                    <TabsTrigger value="calendar">Calendar View</TabsTrigger>
                    <TabsTrigger value="analytics">Analytics</TabsTrigger>
                </TabsList> */}

                <TabsContent value="overview" className="space-y-6">
                    <AttendanceStats data={attendance} />
                    <AttendanceCards data={attendance} />
                </TabsContent>

                

                <TabsContent value="calendar">
                    <AttendanceCalendar data={attendanceData} />
                </TabsContent>

                <TabsContent value="analytics">
                    <div className="text-center py-12">
                        <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Analytics Coming Soon</h3>
                        <p className="text-gray-600">Charts and detailed analytics will be available here</p>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}
