import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, TrendingDown } from "lucide-react"

interface MetricCardProps {
    title: string
    value: string
    trend: string
    description: string
    trendDirection?: "up" | "down"
}

export function MetricCard({ title, value, trend, description, trendDirection = "up" }: MetricCardProps) {
    return (
        <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-4 md:p-6">
                <div className="flex items-center justify-between mb-3 md:mb-4">
                    <h3 className="text-sm font-medium text-gray-400">{title}</h3>
                    <div className="w-6 h-6 md:w-8 md:h-8 rounded-full border border-gray-700 flex items-center justify-center">
                        {trendDirection === "up" ? (
                            <TrendingUp className="h-3 w-3 md:h-4 md:w-4 text-green-500" />
                        ) : (
                            <TrendingDown className="h-3 w-3 md:h-4 md:w-4 text-red-500" />
                        )}
                    </div>
                </div>
                <div className="space-y-2">
                    <p className="text-xl md:text-2xl font-bold text-white">{value}</p>
                    <div className="space-y-1">
                        <p className="text-xs md:text-sm text-green-500 flex items-center gap-1">
                            {trendDirection === "up" ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                            {trend}
                        </p>
                        <p className="text-xs text-gray-500">{description}</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
