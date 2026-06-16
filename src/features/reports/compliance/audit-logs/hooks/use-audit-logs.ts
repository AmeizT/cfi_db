import { useQuery } from "@tanstack/react-query";
import { getAuditLogs } from "../services/get-audit-logs";

export function useAuditLogs() {
    return useQuery({
        queryKey: ["audit_logs"],
        queryFn: () => getAuditLogs(),
    })
}