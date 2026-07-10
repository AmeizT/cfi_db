export type ParsedReportDate =
    | {
        success: true
        isoDate: string
        displayValue: string
    }
    | {
        success: false
        error: string
    }

const MONTH_NAMES = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
]

function normalizeYear(value: string) {
    const numeric = Number(value)

    if (value.length === 2) {
        return numeric <= 69 ? 2000 + numeric : 1900 + numeric
    }

    return numeric
}

function isLeapYear(year: number) {
    if (year % 400 === 0) return true
    if (year % 100 === 0) return false
    return year % 4 === 0
}

function daysInMonth(year: number, month: number) {
    if (month === 2) return isLeapYear(year) ? 29 : 28
    if ([4, 6, 9, 11].includes(month)) return 30
    return 31
}

function padDatePart(value: number) {
    return String(value).padStart(2, "0")
}

function buildInvalidDateError(day: number, month: number, year: number) {
    const monthName = MONTH_NAMES[month - 1] ?? `month ${month}`
    return `${day} ${monthName} ${year} is not a valid date.`
}

export function parseReportDate(input: string): ParsedReportDate {
    const trimmed = input.trim()

    if (!trimmed) {
        return {
            success: false,
            error: "Enter a valid date, such as 20-06-26 or 2026-06-20.",
        }
    }

    const match = trimmed.match(/^(\d{1,4})([-/.])(\d{1,2})\2(\d{1,4})$/)

    if (!match) {
        return {
            success: false,
            error: "Enter a valid date, such as 20-06-26 or 2026-06-20.",
        }
    }

    const [, first, separator, second, third] = match
    const isIsoInput = first.length === 4 && (separator === "-" || separator === "/")
    const year = isIsoInput ? normalizeYear(first) : normalizeYear(third)
    const month = Number(second)
    const day = Number(isIsoInput ? third : first)

    if (
        !Number.isInteger(year)
        || !Number.isInteger(month)
        || !Number.isInteger(day)
        || year < 1000
        || month < 1
        || month > 12
        || day < 1
        || day > daysInMonth(year, month)
    ) {
        return {
            success: false,
            error: buildInvalidDateError(day, month, year),
        }
    }

    const isoDate = `${year}-${padDatePart(month)}-${padDatePart(day)}`

    return {
        success: true,
        isoDate,
        displayValue: `${day} ${MONTH_NAMES[month - 1]} ${year}`,
    }
}
