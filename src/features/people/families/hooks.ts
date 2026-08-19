import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useActiveAssemblyId } from "@/hooks/query/use-user"
import { assemblyQueryKeys, keepPreviousAssemblyData } from "@/lib/query-keys"
import { createHousehold, getHousehold, getHouseholds, updateHousehold, type HouseholdParams } from "./service"

export function useHouseholds(params: HouseholdParams) {
    const assemblyId = useActiveAssemblyId()
    const queryKey = assemblyQueryKeys.key(assemblyId, "people", "households", params)
    return useQuery({
        queryKey,
        queryFn: () => getHouseholds(params),
        enabled: Boolean(assemblyId),
        placeholderData: (data, query) => keepPreviousAssemblyData(data, query, queryKey),
    })
}

export function useCreateHousehold() {
    const assemblyId = useActiveAssemblyId()
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: createHousehold,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: assemblyQueryKeys.key(assemblyId, "people", "households") }),
    })
}

export function useUpdateHousehold() {
    const assemblyId = useActiveAssemblyId()
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: updateHousehold,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: assemblyQueryKeys.scope(assemblyId) }),
    })
}

export function useHousehold(id?: string | null) {
    const assemblyId = useActiveAssemblyId()
    return useQuery({
        queryKey: assemblyQueryKeys.key(assemblyId, "people", "household", id ?? "none"),
        queryFn: () => getHousehold(id!),
        enabled: Boolean(assemblyId && id),
    })
}
