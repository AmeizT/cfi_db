import { useQuery } from "@tanstack/react-query"
import { getComplianceReport } from "../services/get-compliance-report"
import { AssemblyComplianceReport } from "@/dal/types"
import { assemblyQueryKeys } from "@/lib/query-keys"

export function useComplianceReport(assemblyId: string) {
    return useQuery <AssemblyComplianceReport>({
        queryKey: assemblyQueryKeys.key(assemblyId, "complianceReport"),
        queryFn: () => getComplianceReport(assemblyId),
    })
}
