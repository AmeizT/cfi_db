import { useQuery } from "@tanstack/react-query"
import { getComplianceReport } from "../services/get-compliance-report"
import { AssemblyComplianceReport } from "@/dal/types"

export function useComplianceReport(assemblyId: string) {
    return useQuery <AssemblyComplianceReport>({
        queryKey: ["complianceReport", assemblyId],
        queryFn: () => getComplianceReport(assemblyId),
    })
}