import React from "react"
import { addMonths, subMonths, isAfter } from "date-fns"

export const useDateRangeNavigation = (initialMonth: number, initialYear: number) => {
    const initialDate = new Date(initialYear, initialMonth - 1)
    const [currentDate, setCurrentDate] = React.useState(initialDate)
    const [reachedEndOfList, setReachedEndOfList] = React.useState(false)

    const handleNextPage = () => {
        const nextDate = addMonths(currentDate, 1)
        const now = new Date()
        if (isAfter(nextDate, now)) {
            setReachedEndOfList(true)
        } else {
            setReachedEndOfList(false)
            setCurrentDate(nextDate)
        }
    }

    const handlePrevPage = () => {
        const prevDate = subMonths(currentDate, 1)
        const limit = new Date(2023, 0)
        if (prevDate < limit) {
            setReachedEndOfList(true)
        } else {
            setReachedEndOfList(false)
            setCurrentDate(prevDate)
        }
    }

    const selectedMonth = currentDate.getMonth() + 1
    const selectedYear = currentDate.getFullYear()
    const dateRange = `${String(selectedMonth).padStart(2, '0')}${selectedYear}`

    return { selectedMonth, selectedYear, reachedEndOfList, dateRange, handleNextPage, handlePrevPage }
}