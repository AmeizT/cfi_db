import type { QueryClient, QueryKey } from "@tanstack/react-query"
import { getUser } from "@/features/auth/services/get-user"
import type { User } from "@/features/auth/schemas/user"

export const userQueryKeys = {
    current: ["user"] as const,
}

export const assemblyQueryKeys = {
    all: ["assembly"] as const,
    scope: (assemblyId: string | number | null | undefined) =>
        [...assemblyQueryKeys.all, assemblyId == null ? "pending" : String(assemblyId)] as const,
    key: (
        assemblyId: string | number | null | undefined,
        ...parts: readonly unknown[]
    ) => [...assemblyQueryKeys.scope(assemblyId), ...parts] as const,
}

export function isAssemblyQuery(query: { queryKey: QueryKey }) {
    return query.queryKey[0] === assemblyQueryKeys.all[0]
}

/** Keeps paginated data only when both queries belong to the same assembly. */
export function keepPreviousAssemblyData<T>(
    previousData: T | undefined,
    previousQuery: { queryKey: QueryKey } | undefined,
    nextQueryKey: QueryKey,
) {
    return previousQuery?.queryKey[1] === nextQueryKey[1]
        ? previousData
        : undefined
}

export async function refreshAfterAssemblySwitch(
    queryClient: QueryClient,
    assemblyId: string | number,
) {
    await queryClient.cancelQueries({ predicate: isAssemblyQuery })

    // Move consumers to the new key before any assembly request can render again.
    queryClient.setQueryData<User | undefined>(userQueryKeys.current, (user) => {
        if (!user) return user
        const assembly = user.assemblies?.find(
            (item) => String(item.id) === String(assemblyId),
        )
        return { ...user, church: Number(assemblyId), assembly: assembly ?? user.assembly }
    })

    queryClient.removeQueries({ predicate: isAssemblyQuery })
    await queryClient.invalidateQueries({ queryKey: userQueryKeys.current, exact: true })
    await queryClient.fetchQuery({
        queryKey: userQueryKeys.current,
        queryFn: getUser,
        staleTime: 0,
    })
    await queryClient.refetchQueries({ predicate: isAssemblyQuery, type: "active" })
}
