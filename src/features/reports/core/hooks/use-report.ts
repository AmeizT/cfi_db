import { MonthlyReport } from "../schemas/report"
import { useQuery } from "@tanstack/react-query"
import { getReport } from "../services/get-report"

type ReportProps = {
    id: string | null
}

export function useReport({ id }: ReportProps) {
    return useQuery<MonthlyReport>({
        queryKey: ["report", id],
        queryFn: () => getReport(id!),
        enabled: !!id,
    })
}