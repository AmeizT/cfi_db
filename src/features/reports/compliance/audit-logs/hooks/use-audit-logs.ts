import { useQuery } from "@tanstack/react-query";
import { getAuditLogs } from "../services/get-audit-logs";
import { useActiveAssemblyId } from "@/hooks/query/use-user"
import { assemblyQueryKeys } from "@/lib/query-keys"

export function useAuditLogs() {
    const assemblyId = useActiveAssemblyId()
    return useQuery({
        queryKey: assemblyQueryKeys.key(assemblyId, "audit_logs"),
        queryFn: () => getAuditLogs(),
        enabled: Boolean(assemblyId),
    })
}
