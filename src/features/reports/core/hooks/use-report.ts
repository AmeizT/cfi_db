import { MonthlyReport } from "../schemas/report"
import { useQuery } from "@tanstack/react-query"
import { getReport } from "../services/get-report"
import { useActiveAssemblyId } from "@/hooks/query/use-user"
import { assemblyQueryKeys } from "@/lib/query-keys"

type ReportProps = {
    id: string | null
}

export function useReport({ id }: ReportProps) {
    const assemblyId = useActiveAssemblyId()
    return useQuery<MonthlyReport>({
        queryKey: assemblyQueryKeys.key(assemblyId, "report", id),
        queryFn: () => getReport(id!),
        enabled: Boolean(assemblyId && id),
    })
}
