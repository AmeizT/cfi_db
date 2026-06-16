"use client"

import React from "react"
import Cookies from "js-cookie"
import { useActionSounds } from "@/hooks/use-action-sounds"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { RecentTithes } from "../components/RecentTithes"
import { Overheads } from "../components/Overheads"
import { RevenueCategories } from "../components/RevenueCategories"
import { AttendanceBreakdown } from "../components/AttendanceBreakdown"
import { ChartPlaceholder } from "../components/ChartPlaceholder"
import { SectionHeader } from "../components/SectionHeader"
import { StatCard } from "../components/StatsCard"

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
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold">
                        Grace Community Church
                    </h1>
                    <p className="text-muted-foreground text-sm">
                        Financial & Ministry Overview
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <Button variant="outline">March 2026</Button>
                    <div className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm">
                        Live
                    </div>
                </div>
            </div>

            {/* Top Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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