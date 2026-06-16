import { useQuery } from "@tanstack/react-query"
import { FinanceResponse, getReportFinance } from "../services/get-report-finance"

export function useReportFinance(reportId: string) {
    return useQuery<FinanceResponse>({
        queryKey: ["reportFinance", reportId],
        queryFn: () => getReportFinance(reportId),
    })
}