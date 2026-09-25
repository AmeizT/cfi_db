import { useQuery } from "@tanstack/react-query"
import { getUserClient } from "@/features/auth/services/get-user-client"
import { userQueryKeys } from "@/lib/query-keys"

export function useUser() {
    return useQuery({
        queryKey: userQueryKeys.current,
        queryFn: getUserClient,
        staleTime: 60_000,
    })
}

export function useActiveAssemblyId() {
    const { data: user } = useUser()
    return user?.church == null ? undefined : String(user.church)
}
