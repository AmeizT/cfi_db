import { useQuery } from "@tanstack/react-query"
import { FinanceResponse, getReportFinance } from "../services/get-report-finance"

type PaginationParams = {
    page?: number
    pageSize?: number
}

export function useReportFinance(
    reportId: string | undefined,
    pagination?: PaginationParams
) {
    return useQuery<FinanceResponse>({
        queryKey: ["reportFinance", reportId, pagination?.page ?? 1, pagination?.pageSize ?? 10],
        queryFn: () => getReportFinance(reportId as string, pagination),
        enabled: !!reportId,
    })
}
