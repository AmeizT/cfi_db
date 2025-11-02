import { getYear } from "date-fns"

export function getYears(startYear: number): number[] {
    const currentYear = getYear(new Date())

    return Array.from(
        { length: currentYear - startYear + 1 },
        (_, i) => startYear + i
    )
}