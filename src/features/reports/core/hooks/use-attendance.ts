import { useQuery } from "@tanstack/react-query"
import { AttendanceResponse } from "@/dal/types"
import { queryKeys } from "@/components/ui/editable-cell"
import { getReportAttendance } from "../services/get-report-attendance"
import { useActiveAssemblyId } from "@/hooks/query/use-user"
import { assemblyQueryKeys } from "@/lib/query-keys"

type PaginationParams = {
    page?: number
    pageSize?: number
}

export function useReportAttendance(
    reportId: string | undefined,
    pagination?: PaginationParams
) {
    const assemblyId = useActiveAssemblyId()
    return useQuery<AttendanceResponse>({
        queryKey: assemblyQueryKeys.key(assemblyId, ...queryKeys.attendance(reportId ?? ""), pagination?.page ?? 1, pagination?.pageSize ?? 10),
        queryFn: () => getReportAttendance(reportId as string, pagination),
        enabled: Boolean(assemblyId && reportId),
    })
}
