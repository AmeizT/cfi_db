"use client"

import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowDownIcon, ArrowUpIcon, DollarSign, Users, Calendar, TrendingUp } from "lucide-react"

// Mock data for tithes summary
const getMockTithesSummary = () => {
    // In a real app, this would fetch data from an API
    return {
        totalTithes: 15750.0,
        averageTithe: 525.0,
        contributorCount: 30,
        titheChange: 12.5,
        remittanceAmount: 3937.5, // 25% of total tithes
    }
}

export function TithesSummary() {
    const tithesSummary = getMockTithesSummary()

    const cardStyles = "shadow-none border-[1.5px] border-gray-200 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-800 rounded-2xl"

    return (
        <div className="py-6 flex flex-col gap-6">
            <h3 className="text-xl font-semibold">
                Tithes Summary
            </h3>

            <div className="grid gap-4 md:grid-cols-4">
                <Card className={cardStyles}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Tithes</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${tithesSummary.totalTithes.toLocaleString()}</div>
                        <div className="flex items-center space-x-2 text-sm">
                            <p className={cn("flex items-center", tithesSummary.titheChange > 0 ? "text-green-500" : "text-red-500")}>
                                {tithesSummary.titheChange > 0 ? (
                                    <ArrowUpIcon className="mr-1 h-4 w-4" />
                                ) : (
                                    <ArrowDownIcon className="mr-1 h-4 w-4" />
                                )}
                                {Math.abs(tithesSummary.titheChange)}%
                            </p>
                            <p className="text-muted-foreground">from previous period</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className={cardStyles}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Average Tithe</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${tithesSummary.averageTithe.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">per contribution</p>
                    </CardContent>
                </Card>

                <Card className={cardStyles}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Contributors</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{tithesSummary.contributorCount}</div>
                        <p className="text-xs text-muted-foreground">unique members</p>
                    </CardContent>
                </Card>

                <Card className={cardStyles}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Remittance (25%)</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${tithesSummary.remittanceAmount.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">for the period</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
