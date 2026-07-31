import { useQuery } from "@tanstack/react-query"
import { FinanceResponse, getReportFinance } from "../services/get-report-finance"
import { useActiveAssemblyId } from "@/hooks/query/use-user"
import { assemblyQueryKeys } from "@/lib/query-keys"

type PaginationParams = {
    page?: number
    pageSize?: number
}

export function useReportFinance(
    reportId: string | undefined,
    pagination?: PaginationParams
) {
    const assemblyId = useActiveAssemblyId()
    return useQuery<FinanceResponse>({
        queryKey: assemblyQueryKeys.key(assemblyId, "reportFinance", reportId, pagination?.page ?? 1, pagination?.pageSize ?? 10),
        queryFn: () => getReportFinance(reportId as string, pagination),
        enabled: Boolean(assemblyId && reportId),
    })
}
