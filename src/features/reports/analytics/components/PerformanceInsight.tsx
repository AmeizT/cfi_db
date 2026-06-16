import { cn } from "@/utils/cn"
import { useSearchParams } from "next/dist/client/components/navigation";
import { createQueryString } from "../../core/lib/create-query-string";
import Link from "next/link";
import { Flex } from "@/components/ui/box";

interface PerformanceInsightData {
    month: string
    value: string
    change: number
    advice: string
}

interface PerformanceInsightProps {
    best: PerformanceInsightData
    worst: PerformanceInsightData
}

export function PerformanceInsight({
    best,
    worst,
}: PerformanceInsightProps) {
    const searchParams = useSearchParams()
    const activePerformanceTab = searchParams.get("performance") || "best"
    const performance = activePerformanceTab === "best" ? best : worst
    const isBest = activePerformanceTab === "best"
    
    function getTabHref(tabKey: string) {
        const params = createQueryString(searchParams, { performance: tabKey })
        return `/reports/analytics?${params}`
    }

    const tabs = [
        { 
            key: "best", 
            label: "Best",
            pathname: getTabHref("best")
        },
        { 
            key: "worst", 
            label: "Worst",
            pathname: getTabHref("worst")
        },
    ]

    return (
        <Flex direction="column" gap={1} className="p-1 w-1/4 border border-border rounded-2xl">
            <Flex gap={1} className="w-full">
                {tabs.map((tab) => (
                    <Link
                        key={tab.key}
                        className={cn(
                            "w-full px-3 h-8 rounded-xl border-0 border-border-subtle text-sm flex justify-center items-center font-semibold",
                            activePerformanceTab === tab.key
                                ? "bg-theme-100 text-theme-700"
                                : "bg-mauve-50 text-mauve-700 hover:bg-mauve-100"
                        )}
                        href={tab.pathname}
                    >
                        {tab.label}
                    </Link>
                ))}
            </Flex>

            <div
                className={cn(
                    "p-2 rounded-xl",
                    isBest ? "bg-green-50" : "bg-red-50"
                )}
            >
                <div className="space-y-1">
                    <span className="text-xs font-medium text-muted-foreground">
                        {isBest
                            ? "Best Performing Month"
                            : "Lowest Performing Month"}
                    </span>

                    <h5 className="font-semibold">
                        {performance.month}
                    </h5>

                    <h4 className="text-xl font-bold">
                        {performance.value}
                    </h4>

                    <span
                        className={cn(
                            "py-1 px-2 text-sm rounded-lg font-medium",
                            isBest
                                ? "text-green-700 bg-green-200/60"
                                : "text-red-700 bg-red-200/60"
                        )}
                    >
                        {performance?.change > 0 ? "+" : ""}
                        {performance?.change?.toFixed(1)}% vs Previous Month
                    </span>
                </div>

                <div className="mt-4">
                    <h5 className="text-sm font-semibold">
                        Recommendation
                    </h5>

                    <p className="text-sm leading-tight text-muted-foreground">
                        {performance.advice}
                    </p>
                </div>
            </div>
        </Flex>
        
    )
}