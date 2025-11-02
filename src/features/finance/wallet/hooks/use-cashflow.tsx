import { useQuery } from "@tanstack/react-query"
import { useSearchParams } from "next/navigation"
import { getCashflow } from "../services/get-cashflow"

export function useCashflow() {
    const now = new Date()
    const searchParams = useSearchParams()

    const fy = searchParams.get("fy")

    const year = fy || String(now.getFullYear())

    const queryParams = `?year=${year}`

    return useQuery({
        queryKey: ["cashflow", year],
        queryFn: () => getCashflow(queryParams),
        enabled: !!year,
    })
}