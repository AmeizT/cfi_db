import { useQuery } from "@tanstack/react-query"
import { AttendanceResponse } from "@/dal/types"
import { queryKeys } from "@/components/ui/editable-cell"
import { getReportAttendance } from "../services/get-report-attendance"

export function useReportAttendance(reportId: string) {
    return useQuery<AttendanceResponse>({
        queryKey: queryKeys.attendance(reportId),
        queryFn: () => getReportAttendance(reportId),
    })
}