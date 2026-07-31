import { MonthlyReport } from "../schemas/report"
import { useQuery } from "@tanstack/react-query"
import { getReportDetails } from "../services/get-report-details"
import { useActiveAssemblyId } from "@/hooks/query/use-user"
import { assemblyQueryKeys } from "@/lib/query-keys"

type Props = {
    pkey: string
    endpoint: string 
}

export function useReportDetails({ pkey, endpoint }: Props) {
    const assemblyId = useActiveAssemblyId()
    return useQuery<MonthlyReport>({
        queryKey: assemblyQueryKeys.key(assemblyId, "reportDetails", pkey),
        queryFn: () => getReportDetails({pkey, endpoint}),
        enabled: Boolean(assemblyId && endpoint),
    })
}
