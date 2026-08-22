import { useQuery } from "@tanstack/react-query"

import { useActiveAssemblyId } from "@/hooks/query/use-user"
import { assemblyQueryKeys } from "@/lib/query-keys"
import { getAttendanceRecordDetail } from "./attendance-record-detail-service"

export function useAttendanceRecordDetail(recordId: string | number) {
    const assemblyId = useActiveAssemblyId()

    return useQuery({
        queryKey: assemblyQueryKeys.key(
            assemblyId,
            "people",
            "attendance",
            String(recordId)
        ),
        queryFn: () => getAttendanceRecordDetail(recordId),
        enabled: Boolean(assemblyId && recordId),
    })
}
