import { useQuery } from "@tanstack/react-query"
import { getReports } from "../services/get-reports"

type ReportsParams = {
    year: string | undefined
    month?: string | null
    page?: number
    pageSize?: number
    enabled?: boolean
}

export function useReports({ year, month, page, pageSize, enabled }: ReportsParams) {
    const params = new URLSearchParams()

    if (year) {
        params.set("year", year)
    }

    if (month) {
        params.set("month", String(month).padStart(2, "0"))
    }

    if (page) {
        params.set("page", String(page))
    }

    if (pageSize) {
        params.set("page_size", String(pageSize))
    }

    const queryString = params.toString()
    const queryParams = queryString ? `?${queryString}` : ""

    return useQuery({
        queryKey: ["reports", year ?? "all-years", month ?? "all", page ?? 1, pageSize ?? 10],
        queryFn: () => getReports(queryParams),
        enabled: enabled ?? !!year,
    })
}
