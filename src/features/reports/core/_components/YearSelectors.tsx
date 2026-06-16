import * as React from "react"
import { motion, AnimatePresence } from "motion/react"
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react"

function useYearMonth(initialYear?: number, initialMonth?: number) {
    const today = new Date()
    const [year, setYear] = React.useState(initialYear ?? today.getFullYear())
    const [month, setMonth] = React.useState(initialMonth ?? today.getMonth()) // 0-indexed

    const incMonth = () => {
        setMonth((m) => {
            if (m === 11) {
                setYear((y) => y + 1)
                return 0
            }
            return m + 1
        })
    }

    const decMonth = () => {
        setMonth((m) => {
            if (m === 0) {
                setYear((y) => y - 1)
                return 11
            }
            return m - 1
        })
    }

    return { year, month, incMonth, decMonth, setYear }
}

const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
]

/* --------------------------------------------------
   Variant 1: Hover-based selector (your idea)
-------------------------------------------------- */
export function HoverYearMonthSelector() {
    const { year, month, incMonth, decMonth, setYear } = useYearMonth()

    return (
        <div className="flex items-center gap-3">
            {/* Month */}
            <div className="group relative flex items-center justify-center rounded-lg border bg-white px-3 py-2 text-sm font-medium shadow-sm transition-all hover:px-5">
                <AnimatePresence mode="wait">
                    <motion.span
                        key={month}
                        initial={{ y: 6, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -6, opacity: 0 }}
                        transition={{ duration: 0.18 }}
                    >
                        {months[month]}
                    </motion.span>
                </AnimatePresence>

                <div className="pointer-events-none absolute right-1 top-1 flex flex-col opacity-0 transition-opacity group-hover:pointer-events-auto group-hover:opacity-100">
                    <button onClick={incMonth} className="pointer-events-auto p-0.5">
                        <ChevronUp className="h-3 w-3 text-muted-foreground" />
                    </button>
                    <button onClick={decMonth} className="pointer-events-auto p-0.5">
                        <ChevronDown className="h-3 w-3 text-muted-foreground" />
                    </button>
                </div>
            </div>

            {/* Year */}
            <div className="group relative flex items-center justify-center rounded-lg border bg-white px-3 py-2 text-xs text-muted-foreground shadow-sm transition-all hover:px-5">
                <AnimatePresence mode="wait">
                    <motion.span
                        key={year}
                        initial={{ y: 6, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -6, opacity: 0 }}
                        transition={{ duration: 0.18 }}
                    >
                        {year}
                    </motion.span>
                </AnimatePresence>

                <div className="pointer-events-none absolute right-1 top-1 flex flex-col opacity-0 transition-opacity group-hover:pointer-events-auto group-hover:opacity-100">
                    <button onClick={() => setYear(year + 1)} className="pointer-events-auto p-0.5">
                        <ChevronUp className="h-3 w-3" />
                    </button>
                    <button onClick={() => setYear(year - 1)} className="pointer-events-auto p-0.5">
                        <ChevronDown className="h-3 w-3" />
                    </button>
                </div>
            </div>
        </div>
    )
}

/* --------------------------------------------------
   Variant 2: Segmented control hybrid (safer UX)
-------------------------------------------------- */
export function SegmentedYearMonthSelector() {
    const { year, month, incMonth, decMonth } = useYearMonth()

    return (
        <div className="flex items-center gap-6">
            {/* Month */}
            <div className="flex items-center gap-2 rounded-lg border bg-white px-2 py-1 shadow-sm">
                <button onClick={decMonth} className="p-1">
                    <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="min-w-20 text-center text-sm font-medium">
                    {months[month]}
                </span>
                <button onClick={incMonth} className="p-1">
                    <ChevronRight className="h-4 w-4" />
                </button>
            </div>

            {/* Year */}
            <div className="flex items-center gap-2 rounded-lg border bg-white px-2 py-1 shadow-sm">
                <button onClick={() => { }} className="p-1">
                    <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="min-w-14 text-center text-xs text-muted-foreground">
                    {year}
                </span>
                <button onClick={() => { }} className="p-1">
                    <ChevronRight className="h-4 w-4" />
                </button>
            </div>
        </div>
    )
}
