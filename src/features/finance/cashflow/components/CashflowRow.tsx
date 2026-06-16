import { formatCurrency } from "@/utils"
import { Edit2, TrendingDown, TrendingUp } from "lucide-react"

interface CashflowItem {
    name: string
    amount: number
    percentage: number
    previous: number
    trend: number // positive = up, negative = down, 0 = no change
}

interface CashflowRowProps {
    item: CashflowItem
    type: "income" | "expense"
    language: string | undefined
    currency: string | undefined
}

export function CashflowRow({ item, type, currency, language }: CashflowRowProps) {
    const isIncome = type === "income"
    const trendColor =
        item.trend > 0 ? "text-green-600" : item.trend < 0 ? "text-red-600" : "text-gray-400"
    const TrendIcon = item.trend > 0 ? TrendingUp : TrendingDown

    function formatName(name: string) {
        return name
            .split("_")
            .map(w => w.charAt(0).toUpperCase() + w.slice(1))
            .join(" ")
    }

    function formatPercentage(value: number | null) {
        if (value == null) return "0"
        return new Intl.NumberFormat("en-US", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 1,
        }).format(value)
    }

    return (
        <div className="group flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition cursor-pointer">
            <div className="flex items-center gap-4 flex-1">
                <div className={`w-2 h-12 rounded-full ${isIncome ? "bg-green-500" : "bg-red-500"}`} />
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                        <h4 className="font-semibold text-gray-900">{formatName(item.name)}</h4>
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                            {formatPercentage(item.percentage)}% of total
                        </span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                        <span>
                            Previous: {formatCurrency(item.previous, {
                                language,
                                currency,
                                notation: "compact",
                                compactDisplay: "short",
                            })}
                        </span>
                        {item.trend !== 0 && (
                            <div className={`flex items-center gap-1 ${trendColor}`}>
                                <TrendIcon className="w-3 h-3" />
                                <span className="font-medium">{formatPercentage(item.trend)}%</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-4">
                <div className="text-right">
                    <div className="text-xl font-bold text-gray-900">
                        {formatCurrency(item.amount, {
                            language,
                            currency,
                            notation: "compact",
                            compactDisplay: "short",
                        })}
                    </div>
                    <div className="w-24 h-1 bg-gray-200 rounded-full overflow-hidden mt-1">
                        <div
                            className={`h-full ${isIncome ? "bg-green-500" : "bg-red-500"}`}
                            style={{ width: `${item.percentage}%` }}
                        />
                    </div>
                </div>
                <button className="hidden opacity-0 group-hover:opacity-100 p-2 hover:bg-gray-200 rounded-lg transition">
                    <Edit2 className="w-4 h-4 text-gray-600" />
                </button>
            </div>
        </div>
    )
}