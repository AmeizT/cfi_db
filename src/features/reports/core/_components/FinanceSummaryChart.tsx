"use client"

import React from "react"
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    PieChart,
    Pie,
    Cell,
    Legend,
} from "recharts"

interface FinanceSummaryChartProps {
    data: {
        label: string
        value: number
    }[]
}

const COLORS = [
    "var(--user-theme)",
    "#ef4444",
    "#10b981",
    "#f59e0b",
    "color-mix(in srgb, var(--user-theme) 60%, white)",
]

export function FinanceSummaryChart({ data }: FinanceSummaryChartProps) {
    // Format numbers for better readability
    const formatCurrency = (num: number) =>
        new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(num)

    return (
        <div className="w-full flex flex-col lg:flex-row gap-8 p-4 bg-white dark:bg-neutral-900 rounded-2xl shadow-sm">
            {/* BAR CHART */}
            <div className="flex-1 min-h-[300px]">
                <h3 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-100">
                    Financial Overview (Bar)
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                        <XAxis dataKey="label" tick={{ fill: "#9ca3af" }} />
                        <YAxis tick={{ fill: "#9ca3af" }} />
                        <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                        <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                            {data?.map((_, index) => (
                                <Cell key={`bar-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* PIE CHART */}
            <div className="hidden flex-1 min-h-[300px]">
                <h3 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-100">
                    Financial Breakdown (Pie)
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie
                            data={data}
                            dataKey="value"
                            nameKey="label"
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                            labelLine={false}
                            label={({ name, value }) => `${name}: ${formatCurrency(value)}`}
                        >
                            {data?.map((_, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}
