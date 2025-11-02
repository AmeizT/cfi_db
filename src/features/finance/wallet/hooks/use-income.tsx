import { useQuery } from "@tanstack/react-query"
import { getIncome } from "../services/get-operating-expenses"

export function useIncome() {
    return useQuery({
        queryKey: ["income"],
        queryFn: () => getIncome(),
    })
}