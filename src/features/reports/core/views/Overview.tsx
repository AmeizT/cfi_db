import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// ---------- TYPES ----------
type StatCardProps = {
    title: string;
    value: string;
    change?: string;
    trend?: "up" | "down";
};

// ---------- COMPONENTS ----------

function StatCard({ title, value, change, trend }: StatCardProps) {
    return (
        <Card className="rounded-2xl shadow-sm">
            <CardContent className="p-5 space-y-2">
                <p className="text-sm text-muted-foreground">{title}</p>
                <p className="text-2xl font-semibold">{value}</p>
                {change && (
                    <p
                        className={cn(
                            "text-sm",
                            trend === "up" ? "text-green-600" : "text-red-500"
                        )}
                    >
                        {change}
                    </p>
                )}
            </CardContent>
        </Card>
    );
}

function SectionHeader({ title, right }: { title: string; right?: React.ReactNode }) {
    return (
        <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">{title}</h2>
            {right}
        </div>
    );
}

function ChartPlaceholder() {
    return (
        <div className="h-65 flex items-center justify-center text-muted-foreground text-sm">
            Chart goes here
        </div>
    );
}

function AttendanceBreakdown() {
    const data = [
        { label: "Sunday Service", value: 642 },
        { label: "Midweek", value: 318 },
        { label: "Home Cell", value: 210 },
        { label: "Youth", value: 145 },
        { label: "Online", value: 823 },
    ];

    return (
        <Card className="rounded-2xl shadow-sm">
            <CardContent className="p-5 space-y-4">
                <SectionHeader title="Attendance breakdown" />

                <div className="space-y-3">
                    {data.map((item) => (
                        <div key={item.label} className="flex justify-between text-sm">
                            <span>{item.label}</span>
                            <span className="font-medium">{item.value}</span>
                        </div>
                    ))}
                </div>

                <div className="pt-3 border-t text-sm flex justify-between">
                    <span>Total</span>
                    <span className="font-semibold">2,138</span>
                </div>
            </CardContent>
        </Card>
    );
}

function RevenueCategories() {
    return (
        <Card className="rounded-2xl shadow-sm">
            <CardContent className="p-5">
                <SectionHeader title="Revenue categories" />
                <div className="space-y-3 text-sm">
                    <div>
                        <div className="flex justify-between">
                            <span>Tithes</span>
                            <span>62.6%</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full mt-1">
                            <div className="h-2 bg-green-500 rounded-full w-[62%]" />
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

function RecentTithes() {
    return (
        <Card className="rounded-2xl shadow-sm">
            <CardContent className="p-5">
                <SectionHeader
                    title="Recent tithes"
                    right={<Button variant="ghost" size="sm">View all</Button>}
                />

                <div className="text-sm text-muted-foreground">
                    No recent data
                </div>
            </CardContent>
        </Card>
    );
}

function Overheads() {
    return (
        <Card className="rounded-2xl shadow-sm">
            <CardContent className="p-5">
                <SectionHeader
                    title="Overheads"
                    right={<Button variant="ghost" size="sm">Details</Button>}
                />

                <div className="text-sm">
                    Staff Salaries — BWP 22,000
                </div>
            </CardContent>
        </Card>
    );
}

// ---------- MAIN PAGE ----------

export default function ReportsOverview() {
    return (
        <div className="p-4 space-y-6">
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
                <StatCard title="Active Members" value="1,284" change="+23 this month" trend="up" />
                <StatCard title="Avg. Attendance" value="642" />
                <StatCard title="New Converts" value="18" change="+6 vs Feb" trend="up" />
                <StatCard title="Reports Filed" value="4 / 4" />
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
    );
}
