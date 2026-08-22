import { useQuery } from "@tanstack/react-query"
import { getTithes, getTrashedTithes } from "../services/get-tithes"
import { useActiveAssemblyId } from "@/hooks/query/use-user"
import { assemblyQueryKeys } from "@/lib/query-keys"

export function useTithes({ trashed = false } = {}) {
    const assemblyId = useActiveAssemblyId()
    return useQuery({
        queryKey: assemblyQueryKeys.key(assemblyId, trashed ? "trashed_tithes" : "tithes"),
        queryFn: trashed ? getTrashedTithes : getTithes,
        enabled: Boolean(assemblyId),
    })
}

export function useTrashedTithes() {
    const assemblyId = useActiveAssemblyId()
    return useQuery({
        queryKey: assemblyQueryKeys.key(assemblyId, "trashed_tithes"),
        queryFn: () => getTrashedTithes(),
        enabled: Boolean(assemblyId),
    })
}
