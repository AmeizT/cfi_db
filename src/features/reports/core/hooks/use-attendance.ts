import { useQuery } from "@tanstack/react-query"
import { AttendanceResponse } from "@/dal/types"
import { queryKeys } from "@/components/ui/editable-cell"
import { getReportAttendance } from "../services/get-report-attendance"

type PaginationParams = {
    page?: number
    pageSize?: number
}

export function useReportAttendance(
    reportId: string | undefined,
    pagination?: PaginationParams
) {
    return useQuery<AttendanceResponse>({
        queryKey: [...queryKeys.attendance(reportId ?? ""), pagination?.page ?? 1, pagination?.pageSize ?? 10],
        queryFn: () => getReportAttendance(reportId as string, pagination),
        enabled: !!reportId,
    })
}
