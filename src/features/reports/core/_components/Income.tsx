"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const incomeData = [
    { category: "Tithes", amount: 1200.0, percentage: 42.86, status: "received" },
    { category: "Offerings", amount: 800.0, percentage: 28.57, status: "received" },
    { category: "Donations", amount: 500.0, percentage: 17.86, status: "received" },
    { category: "Events", amount: 300.0, percentage: 10.71, status: "pending" },
]

const expenseData = [
    { category: "Utilities", amount: 250.0, percentage: 35.71, status: "paid" },
    { category: "Maintenance", amount: 200.0, percentage: 28.57, status: "paid" },
    { category: "Supplies", amount: 150.0, percentage: 21.43, status: "paid" },
    { category: "Other", amount: 100.0, percentage: 14.29, status: "pending" },
]

export function IncomeStatementOption2() {
    // const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"]

    return (
        <div className="space-y-0 pb-4">
            {/* Income Breakdown */}
            <Card className="px-0 py-0 border-none shadow-none">
                <CardHeader>
                    <CardTitle className="text-lg">Income Sources</CardTitle>
                    <CardDescription>Detailed breakdown of all income categories</CardDescription>
                </CardHeader>
                <CardContent className="px-0">
                    <div className="space-y-4">
                        {incomeData.map((item) => (
                            <div key={item.category} className="flex items-center justify-between py-2 border-b last:border-b-0">
                                <div>
                                    <p className="font-medium">{item.category}</p>
                                    <p className="text-sm text-muted-foreground">{item.percentage.toFixed(2)}% of total</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                                        <div className="h-full bg-green-500 rounded-full" style={{ width: `${item.percentage}%` }} />
                                    </div>
                                    <span className="font-semibold w-20 text-right">€{item.amount.toFixed(2)}</span>
                                </div>
                            </div>
                        ))}
                        <div className="pt-4 border-t-0 flex justify-between font-bold">
                            <span>Total Income</span>
                            <span className="text-green-600">€2,800.00</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Expenses Breakdown */}
            <Card className="px-0 py-0 border-none shadow-none">
                <CardHeader className="px-0">
                    <CardTitle className="text-lg">Expenses</CardTitle>
                    <CardDescription className="hidden">
                        Detailed breakdown of all expense categories
                    </CardDescription>
                </CardHeader>
                <CardContent className="px-0">
                    <div className="space-y-0">
                        {expenseData.map((item) => (
                            <div key={item.category} className="flex items-center justify-between py-2 border-b border-slate-200 last:border-b-0">
                                <div className="flex items-center">
                                    <p className="text-sm font-medium">{item.category}</p>
                                    <p className="hidden text-sm text-slate-500">
                                        {item.percentage.toFixed(2)}% of total
                                    </p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                                        <div className="h-full bg-red-500 rounded-full" style={{ width: `${item.percentage}%` }} />
                                    </div>
                                    <span className="font-semibold w-20 text-right">€{item.amount.toFixed(2)}</span>
                                </div>
                            </div>
                        ))}
                        <div className="pt-4 border-t-0 flex justify-between font-bold">
                            <span>Total Expenses</span>
                            <span className="text-red-600">€700.00</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
