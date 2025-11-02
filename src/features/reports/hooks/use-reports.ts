import { MonthlyReport } from "../schemas/report"
import { useQuery } from "@tanstack/react-query"
import { getReports } from "../services/get-reports"

type UseReportsParams = {
    year: string | null
    month?: string | null
}

export function useReports({ year, month }: UseReportsParams) {
    let queryParams = `?year=${year}`
    if (month) {
        queryParams += `&month=${String(month).padStart(2, "0")}`
    }

    return useQuery<MonthlyReport[]>({
        queryKey: ["reports", year, month ?? "all"],
        queryFn: () => getReports(queryParams),
        enabled: !!year,
    })
}