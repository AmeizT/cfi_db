"use client"

import React from "react"

import { 
    format, 
    parse, 
    addMonths, 
    subMonths, 
    isBefore, 
    isAfter,
    startOfMonth, 
    endOfMonth, 
    parseISO,
    getMonth, 
} from "date-fns"

import { WalletSummary } from "../components/WalletSummary"
import { IncomeList } from "../components/IncomeList"
import { DateSelector } from "../components/DateSelector"
import { IconCalendarMonth } from "@tabler/icons-react"
import { ExpensesList } from "../components/ExpensesList"
import { EmptyState } from "@/components/ui/empty-state"

interface WalletContainerProps {
    reportDate: Date
}

export function WalletContainer({ reportDate }: WalletContainerProps) {
    console.log("wallet date", reportDate)
    const emptyState = false
    const incomeBoxRef = React.useRef<HTMLDivElement>(null)
    const [incomeHeight, setIncomeHeight] = React.useState<number>(0)
    const [editMode, setEditMode] = React.useState<"income" | "expenses" | null>(null)

    React.useEffect(() => {
        if (incomeBoxRef?.current) {
            setIncomeHeight(incomeBoxRef?.current?.scrollHeight)
        }
      }, [incomeHeight])

    const params: { year: string | null, month: string | null } = {
        year: format(reportDate, "yyyy") || "2025",
        month: format(reportDate, "MMM") || "Sep"
    }

    const month = getMonth(parse(params?.month || "", "MMM", new Date())) + 1
    const formattedDate = `${params?.year}-${month.toString().padStart(2, '0')}`
    const selectedDate = parse(`${params?.month}${params?.year}`, "MMMyyyy", new Date())


    const getPreviousMonth = React.useCallback(() => {
        const prevDate = subMonths(new Date(selectedDate), 1)
        return {
            month: format(prevDate, "MMM").toLowerCase(),
            year: format(prevDate, "yyyy"),
            isDisabled: isBefore(prevDate, new Date("2023-01-01")),
        }
    }, [selectedDate])

    const getNextMonth = React.useCallback(() => {
        const currentDate = new Date()
        
        const nextDate = addMonths(new Date(selectedDate), 1)
        return {
            month: format(nextDate, "MMM").toLowerCase(),
            year: format(nextDate, "yyyy"),
            isDisabled: isAfter(nextDate, new Date(currentDate)),
        }
    }, [selectedDate])

    const prevMonth = getPreviousMonth()
    const nextMonth = getNextMonth()

    const toggleEditMode = (section: "income" | "expenses") => {
        setEditMode((current) => (current === section ? null : section))
    }

    return (
        <div className="px-4 xl:pt-2 xl:pb-6 lg:px-8 w-full h-full flex flex-col gap-y-6 relative">
            <div className="w-full h-auto flex flex-col justify-between items-start gap-y-6">
                <div className="w-full flex justify-between">
                    <div hidden>
                        <h3 className="text-body text-lg xl:text-2xl font-semibold tracking-tight">
                            Income & Expenses
                        </h3>

                        <p className="hidden text-base text-body-muted">
                            View and manage income and expenditure
                        </p>
                    </div>

                    <div className="w-full flex flex-col lg:flex-row lg:justify-between gap-2 lg:gap-0">
                        <div className="w-fit h-fit flex gap-2 items-center">
                            <DateSelector
                                date={`month=${prevMonth.month}&year=${prevMonth.year}`}
                                isDisabled={prevMonth.isDisabled}
                                type="previous"
                            />

                            <span className="px-3 lg:px-2 h-9 lg:h-7 flex grow items-center gap-2 rounded-lg bg-gray-100 dark:text-white">
                                <IconCalendarMonth className="size-6 lg:size-4" />

                                <time
                                    dateTime={format(startOfMonth(parseISO(formattedDate)), "MMM dd, yyyy")}
                                    className="text-body-foreground lg:text-sm font-semibold"
                                >
                                    {format(endOfMonth(parseISO(formattedDate)), "dd MMMM, yyyy")}
                                </time>
                            </span>

                            <DateSelector
                                date={`month=${nextMonth.month}&year=${nextMonth.year}`}
                                isDisabled={nextMonth.isDisabled}
                                type="next"
                            />
                        </div>

                        <div className="hidden _flex justify-between items-center">
                            <button
                                onClick={() => toggleEditMode("expenses")}
                                className="py-1 px-3 border border-gray-300 rounded-lg shadow-sm text-sm font-semibold"
                                type="button"
                            >
                                {editMode === "expenses" ? "Edit cashflow" : "Edit cashflow"}
                            </button>
                        </div>
                    </div>
                </div>

                <WalletSummary />
            </div>

            {!emptyState ? (
                <div className="w-full flex flex-col lg:flex-row gap-3 lg:gap-0 bg-gradient-to-b from-white to-zinc-100 dark:from-neutral-800 dark:to-neutral-900 rounded-3xl border border-zinc-200 dark:border-neutral-700">
                    <IncomeList ref={incomeBoxRef} />
                    
                    <ExpensesList />
                </div>
            ) : (
                <EmptyState emptyStateFor={"finance"} />
            )}
        </div>
    )
}