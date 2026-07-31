import { useQuery } from "@tanstack/react-query"
import { getIncome } from "../services/get-operating-expenses"
import { useActiveAssemblyId } from "@/hooks/query/use-user"
import { assemblyQueryKeys } from "@/lib/query-keys"

export function useIncome() {
    const assemblyId = useActiveAssemblyId()
    return useQuery({
        queryKey: assemblyQueryKeys.key(assemblyId, "income"),
        queryFn: () => getIncome(),
        enabled: Boolean(assemblyId),
    })
}
