import { useQuery } from "@tanstack/react-query"
import { getFlexibleExpenses, getFixedExpenses } from "../services/get-operating-expenses"
import { useActiveAssemblyId } from "@/hooks/query/use-user"
import { assemblyQueryKeys } from "@/lib/query-keys"

export function useFixedExpenses() {
    const assemblyId = useActiveAssemblyId()
    return useQuery({
        queryKey: assemblyQueryKeys.key(assemblyId, "fixedExpenses"),
        queryFn: () => getFixedExpenses(),
        enabled: Boolean(assemblyId),
    })
}

export function useFlexibleExpenses() {
    const assemblyId = useActiveAssemblyId()
    return useQuery({
        queryKey: assemblyQueryKeys.key(assemblyId, "flexibleExpenses"),
        queryFn: () => getFlexibleExpenses(),
        enabled: Boolean(assemblyId),
    })
}
