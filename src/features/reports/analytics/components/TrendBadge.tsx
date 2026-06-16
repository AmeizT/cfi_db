export function TrendBadge({ value }: { value: number }) {
    if (!value) return null;

    const isPositive = value > 0;

    return (
        <span
            className={`text-xs font-semibold flex items-center gap-1 ${isPositive ? "text-green-600" : "text-red-500"
                }`}
        >
            {isPositive ? "▲" : "▼"} {Math.abs(value).toFixed(1)}%
        </span>
    )
}