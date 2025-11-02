import {
    format,
    startOfWeek,
    endOfWeek,
    isWithinInterval,
    parseISO,
    setWeek,
    setYear,
    getWeek,
    getMonth,
    getYear,
} from "date-fns"

interface DataStatusProps {
    category: string
    data?: { created_at: string }[]
}

export function getWeeklyDataEntryStatus({ category, data }: DataStatusProps) {
    const now = new Date()
    const currentMonth = getMonth(now) // 0-based (0 = Jan)
    const currentYear = getYear(now)
    const currentWeek = getWeek(now)

    const weeksArray = []

    if (Array.isArray(data) && data.length > 0) {
        for (let week = 1; week <= currentWeek; week++) {
            // Create a date for the specific week of the current year
            const weekDate = setWeek(setYear(new Date(currentYear, currentMonth, 1), currentYear), week)

            const weekStart = format(startOfWeek(weekDate, { weekStartsOn: 1 }), "yyyy-MM-dd") // Monday as start
            const weekEnd = format(endOfWeek(weekDate, { weekStartsOn: 1 }), "yyyy-MM-dd")

            const hasData = data.some(entry => {
                if (!entry?.created_at) return false
                const entryDate = parseISO(format(parseISO(entry.created_at), "yyyy-MM-dd"))
                return isWithinInterval(entryDate, {
                    start: parseISO(weekStart),
                    end: parseISO(weekEnd),
                })
            })

            weeksArray.push({ start: weekStart, end: weekEnd, category, hasData })
        }
    }

    return weeksArray
}

// export function getMonthlyDataEntryStatus({ category, data }: MonthlyDataStatusProps) {
//     const currentMonth = moment().format("MM");
//     const currentYear = moment().format("YYYY");
//     const timestamp = moment().endOf('month').format("YYYY-MM-DD");

//     const filteredData = data?.filter((entry: { timestamp: string | moment.MomentInput }) => {
//         if (!entry) return false;

//         const entryMonth = moment(entry.timestamp).format("MM");
//         const entryYear = moment(entry.timestamp).format("YYYY");

//         if (entryMonth === currentMonth && entryYear === currentYear) {
//             return true;
//         }

//         return false;
//     }) as (Income | FixedExpenditure | Attendance)[];

//     const hasData = filteredData && filteredData.length > 0;

//     return { timestamp, category, hasData };
// }

