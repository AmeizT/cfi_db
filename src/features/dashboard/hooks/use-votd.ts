import { getVotd } from "../services/votd"
import { useQuery } from "@tanstack/react-query"

export function useVotd() {
    return useQuery({
        queryKey: ["votd"],
        queryFn: () => getVotd(),
        staleTime: 1000 * 60 * 60 * 24 // 24 hours
    })
}