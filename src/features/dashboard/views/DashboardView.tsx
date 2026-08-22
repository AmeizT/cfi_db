"use client"

import React from "react"
import Cookies from "js-cookie"
import { useActionSounds } from "@/hooks/use-action-sounds"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { RecentTithes } from "../components-01/RecentTithes"
import { Overheads } from "../components-01/Overheads"
import { RevenueCategories } from "../components-01/RevenueCategories"
import { AttendanceBreakdown } from "../components-01/AttendanceBreakdown"
import { ChartPlaceholder } from "../components-01/ChartPlaceholder"
import { SectionHeader } from "../components-01/SectionHeader"
import { StatCard } from "../components-01/StatsCard"
import { useUser } from "@/hooks/query/use-user";
import { greetByTime } from "@/utils/greet-by-time";
import { Flex } from "@/components/ui/box";
import { JethroBar } from "../components-01/JethroBar";

export function AppStartupSound() {
    const { playStartup } = useActionSounds()

    React.useEffect(() => {
        const played = Cookies.get("startupSoundPlayed")
        if (played === "true") return

        playStartup()

        Cookies.set("startupSoundPlayed", "true", { path: "/" })
    }, [playStartup])

    return null
}

function DashboardContent(){
    const { data: user, isLoading} = useUser()
    const greeting = React.useMemo(
        () =>
            greetByTime({
                username: user?.first_name,
            }),
        [user?.first_name]
    )

    const [message, username] = greeting.split(",")

    return (
        <div className="p-4 space-y-6 w-4/5 mx-auto">
            {/* Header */}
            <Flex justify={"center"}>
                <h1 className="text-3xl font-semibold">
                    {message},
                    {username && (
                        <span className="text-muted-foreground">
                            {username}
                        </span>
                    )}
                </h1>
            </Flex>

            <JethroBar />

            {/* Top Stats */}
            <Flex direction={"column"} gap={2} className="w-full">
                <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
                <StatCard
                    title="Total Revenue"
                    value="BWP 142,860"
                    change="↑ 12.4% vs last month"
                    trend="up"
                />
                <StatCard
                    title="Total Tithes"
                    value="BWP 89,450"
                    change="↑ 8.1% vs last month"
                    trend="up"
                />
                <StatCard
                    title="Expenditures"
                    value="BWP 58,200"
                    change="↑ 3.2% vs last month"
                    trend="down"
                />
                <StatCard
                    title="Net Balance"
                    value="BWP 84,660"
                    change="↑ 18.7% vs last month"
                    trend="up"
                />
            </div>

            {/* Secondary Stats */}
            <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
                <StatCard 
                    title="Active Members" 
                    value="1,284" 
                    change="+23 this month" 
                    trend="up" 
                />

                <StatCard 
                    title="Avg. Attendance" 
                    value="642" 
                />

                <StatCard 
                    title="New Converts" 
                    value="18" 
                    change="+6 vs Feb" 
                    trend="up" 
                />
                
                <StatCard 
                    title="Reports Filed" 
                    value="4 / 4" 
                />
            </div>
            </Flex>

            {/* Charts + Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <Card className="lg:col-span-2 rounded-2xl shadow-sm">
                    <CardContent className="p-5">
                        <SectionHeader
                            title="Financial Overview"
                            right={
                                <div className="flex gap-2">
                                    <Button size="sm" variant="outline">Bar</Button>
                                    <Button size="sm" variant="ghost">Trend</Button>
                                </div>
                            }
                        />
                        <ChartPlaceholder />
                    </CardContent>
                </Card>

                <AttendanceBreakdown />
            </div>

            {/* Bottom Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <RecentTithes />
                <RevenueCategories />
                <Overheads />
            </div>
        </div>
    )
}

export function DashboardView() {
    return (
        <React.Fragment>
            <AppStartupSound />
            <DashboardContent />
        </React.Fragment>
    )
}