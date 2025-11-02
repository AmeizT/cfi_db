import { useQuery } from "@tanstack/react-query"
import { getMembers } from "@/features/people/services/get-members"

export function useMembers() {
    return useQuery({
        queryKey: ["members"],
        queryFn: () => getMembers(),
    })
}