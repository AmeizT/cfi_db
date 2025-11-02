import { useQuery } from "@tanstack/react-query"
import { getUser } from "@/features/auth/services/get-user"

export function useUser() {
    return useQuery({
        queryKey: ["user"],
        queryFn: getUser,
    })
}