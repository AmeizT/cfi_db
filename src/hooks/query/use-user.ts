import { useQuery } from "@tanstack/react-query"
import { getUser } from "@/features/auth/services/get-user"
import { userQueryKeys } from "@/lib/query-keys"

export function useUser() {
    return useQuery({
        queryKey: userQueryKeys.current,
        queryFn: getUser,
    })
}

export function useActiveAssemblyId() {
    const { data: user } = useUser()
    return user?.church == null ? undefined : String(user.church)
}
