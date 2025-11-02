import { useQuery } from "@tanstack/react-query"
import { getFlexibleExpenses, getFixedExpenses } from "../services/get-operating-expenses"

export function useFixedExpenses() {
    return useQuery({
        queryKey: ["fixedExpenses"],
        queryFn: () => getFixedExpenses(),
    })
}

export function useFlexibleExpenses() {
    return useQuery({
        queryKey: ["flexibleExpenses"],
        queryFn: () => getFlexibleExpenses(),
    })
}