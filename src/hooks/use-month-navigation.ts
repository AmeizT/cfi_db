import * as React from "react"
import {
    parse,
    format,
    addMonths,
    subMonths,
    isBefore,
    isAfter,
    getMonth,
} from "date-fns"

interface Params {
    year: string | null
    month: string | null
}

export function useMonthNavigation(params: Params, minDate = "2023-01-01") {
    const parsedMonth = parse(params?.month || "", "MMMM", new Date())
    const month = getMonth(parsedMonth) + 1
    const formattedDate = `${params?.year}-${month.toString().padStart(2, "0")}`
    const selectedDate = parse(`${params?.month}${params?.year}`, "MMMMyyyy", new Date())

    const getPreviousMonth = React.useCallback(() => {
        const prevDate = subMonths(selectedDate, 1)
        return {
            month: format(prevDate, "MMMM").toLowerCase(),
            year: format(prevDate, "yyyy"),
            isDisabled: isBefore(prevDate, new Date(minDate)),
        }
    }, [selectedDate, minDate])

    const getNextMonth = React.useCallback(() => {
        const currentDate = new Date()
        const nextDate = addMonths(selectedDate, 1)
        return {
            month: format(nextDate, "MMMM").toLowerCase(),
            year: format(nextDate, "yyyy"),
            isDisabled: isAfter(nextDate, currentDate),
        }
    }, [selectedDate])

    return {
        month,
        formattedDate,
        selectedDate,
        prevMonth: getPreviousMonth(),
        nextMonth: getNextMonth(),
    }
}