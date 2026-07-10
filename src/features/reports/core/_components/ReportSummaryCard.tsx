import Link from "next/link"
import { LucideIcon } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { IconArrowUpRight } from "@tabler/icons-react"
import { motion } from "motion/react"

export interface ReportSummaryCardProps {
    children: React.ReactNode
    title: string
    icon?: LucideIcon
    value?: string | number
    subValue?: string
    change?: number
    trend?: "up" | "down" | "neutral"
    onViewDetails?: () => void
    onExport?: () => void
    color?: string
}

export function ReportSummaryCard(props: ReportSummaryCardProps) {
    const searchParams = useSearchParams()
    const month = searchParams.get("month") || ""
    const year = searchParams.get("year") || ""

    const {
        title,
        value,
        subValue,
        // change = 0,
        // trend = "neutral",
        // onViewDetails = () => {},
        // onExport = () => {},
        // color = "bg-gray-500",
    } = props
    
    return (
        <div className="min-h-[50dvh] bg-white rounded-lg border-0 border-gray-100 p-4">
            <div className="flex items-start justify-between mb-4">
                <h3 className="text-sm font-semibold mb-2">
                    {title}
                </h3>

                <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 20,
                        mass: 0.8,
                    }}
                    className="relative inline-flex"
                >
                    <Link
                        href={`/reports/stats/monthly?month=${month}&year=${year}&section=${title.toLowerCase()}`}
                        className="group relative flex items-center justify-center size-8 rounded-full bg-slate-100 dark:bg-neutral-700 overflow-hidden"
                    >
                        {/* Background Motion Layer */}
                        <motion.div
                            className="absolute inset-0 rounded-full bg-slate-100 dark:bg-neutral-700"
                            whileHover={{ scale: 1.2 }}
                            transition={{
                                type: "spring",
                                stiffness: 300,
                                damping: 18,
                                mass: 0.7
                            }}
                        />

                        {/* Icon Layer (does not scale) */}
                        <motion.div
                            className="relative z-10"
                            whileHover={{ opacity: 1 }}
                            transition={{ duration: 0.2 }}
                        >
                            <IconArrowUpRight className="size-5 text-slate-400 group-hover:text-slate-800 transition-colors duration-200" />
                        </motion.div>
                    </Link>
                </motion.div>
            </div>

            <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
            {subValue && <p className="text-sm text-gray-500 mb-3">{subValue}</p>}

            <div className="flex items-center justify-between">
                <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-sm">
                        <span className="font-medium text-slate-700">Test</span>
                        <span className="font-bold text-slate-900">50</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                        <div
                            className="bg-theme-gradient-x h-full rounded-full transition-all duration-500"
                            style={{ width: `${(50 / 100) * 100}%` }}
                        />
                    </div>
                </div>
                {/* <div className="flex items-center gap-2">
                    {trend === "up" ? (
                        <TrendingUp className="w-4 h-4 text-green-500" />
                    ) : (
                        <TrendingDown className="w-4 h-4 text-red-500" />
                    )}
                    <span className={`text-sm font-medium ${trend === "up" ? "text-green-600" : "text-red-600"}`}>
                        {Math.abs(change)}%
                    </span>
                    <span className="text-sm text-gray-500">vs last month</span>
                </div>
                <button
                    onClick={onViewDetails}
                    className="flex items-center gap-1 text-sm font-medium text-theme-600 hover:text-theme-700 transition-colors"
                >
                    <Eye className="w-4 h-4" />
                    Details
                </button> */}

                {props.children}
            </div>
        </div>
    )
}
    
