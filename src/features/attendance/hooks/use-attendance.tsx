import { useQuery } from "@tanstack/react-query"
import { getAttendance } from "../services/get-attendance"
import { useActiveAssemblyId } from "@/hooks/query/use-user"
import { assemblyQueryKeys } from "@/lib/query-keys"

export function useAttendance() {
    const assemblyId = useActiveAssemblyId()
    return useQuery({
        queryKey: assemblyQueryKeys.key(assemblyId, "attendance"),
        queryFn: () => getAttendance(),
        enabled: Boolean(assemblyId),
    })
}
