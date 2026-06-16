import { MonthlyReport } from "../schemas/report"
import { useQuery } from "@tanstack/react-query"
import { getReportDetails } from "../services/get-report-details"

type Props = {
    pkey: string
    endpoint: string 
}

export function useReportDetails({ pkey, endpoint }: Props) {
    return useQuery<MonthlyReport>({
        queryKey: ["reportDetails", pkey],
        queryFn: () => getReportDetails({pkey, endpoint}),
        enabled: !!endpoint,
    })
}