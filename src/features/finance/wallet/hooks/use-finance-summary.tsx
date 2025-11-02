import { useQuery } from "@tanstack/react-query"
import { useSearchParams } from "next/navigation"
import { getFinanceSummary } from "../services/get-finance-summary"
import { FinanceSummary } from "../../schemas/finance-summary"
import { parse, getMonth } from "date-fns"

export function useFinanceSummary() {
    const now = new Date()
    const searchParams = useSearchParams()

    const monthParam = searchParams.get("month")
    const yearParam = searchParams.get("year")

    let monthNum = now.getMonth() + 1

    if (monthParam) {
        try {
            const parsedFull = parse(monthParam, "MMMM", new Date())
            if (!isNaN(parsedFull.getTime())) {
                monthNum = getMonth(parsedFull) + 1
            } else {
                const parsedAbbr = parse(monthParam, "MMM", new Date())
                if (!isNaN(parsedAbbr.getTime())) {
                    monthNum = getMonth(parsedAbbr) + 1
                }
            }
        } catch {
            monthNum = getMonth(new Date()) + 1
        }
    }

    const month = String(monthNum).padStart(2, "0")
    const year = yearParam || String(now.getFullYear())

    const queryParams = `?month=${month}&year=${year}`

    return useQuery<FinanceSummary>({
        queryKey: ["finance", month, year],
        queryFn: () => getFinanceSummary(queryParams),
        enabled: !!month && !!year,
    })
}