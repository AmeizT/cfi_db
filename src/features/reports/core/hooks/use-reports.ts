import { useQuery } from "@tanstack/react-query"
import { getReports } from "../services/get-reports"
import { AssemblyReport } from "@/dal/types"

type ReportsParams = {
    year: string | undefined
    month?: string | null
}

export function useReports({ year, month }: ReportsParams) {
    let queryParams = `?year=${year}`
    if (month) {
        queryParams += `&month=${String(month).padStart(2, "0")}`
    }

    return useQuery({
        queryKey: ["reports", year, month ?? "all"],
        queryFn: () => getReports(queryParams),
        enabled: !!year,
    })
}