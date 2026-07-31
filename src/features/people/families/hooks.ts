import { useQuery } from "@tanstack/react-query"
import { useActiveAssemblyId } from "@/hooks/query/use-user"
import { assemblyQueryKeys, keepPreviousAssemblyData } from "@/lib/query-keys"
import { getHouseholds, type HouseholdParams } from "./service"

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
