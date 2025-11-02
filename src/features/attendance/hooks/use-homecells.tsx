import { useQuery } from "@tanstack/react-query"
import { getHomecells } from "../services/get-homecells"

export function useHomecell() {
    return useQuery({
        queryKey: ["homecells"],
        queryFn: () => getHomecells(),
    })
}