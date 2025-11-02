import { CustomSidebar } from "@/layouts/dashboard/components/CustomSidebar"
import { MetricCard } from "@/layouts/dashboard/components/MetricCard"


export default function Dashboard() {
    return (
        <div className="flex h-screen bg-black">
            <CustomSidebar />

            <div className="flex-1 flex flex-col">
                {/* Mobile header */}
                <header className="md:hidden flex items-center justify-between p-4 bg-gray-900 border-b border-gray-800">
                    <CustomSidebar />
                    <h1 className="text-white font-semibold">Dashboard</h1>
                    <div></div> {/* Spacer for centering */}
                </header>

                <main className="flex-1 p-4 md:p-6 overflow-auto">
                    <div className="space-y-4 md:space-y-6">
                        {/* Metrics Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                            <MetricCard
                                title="Total Income"
                                value="$1,250.00"
                                trend="Trending up this month"
                                description="Visitors for the last 6 months"
                                trendDirection="up"
                            />
                            <MetricCard
                                title="Attendance"
                                value="1,234"
                                trend="Down 20% this period"
                                description="Acquisition needs attention"
                                trendDirection="down"
                            />
                            <MetricCard
                                title="New Members"
                                value="45"
                                trend="Strong member retention"
                                description="Engagement exceed targets"
                                trendDirection="up"
                            />
                            <MetricCard
                                title="Growth Rate"
                                value="4.5%"
                                trend="Steady performance increase"
                                description="Meets growth projections"
                                trendDirection="up"
                            />
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}
