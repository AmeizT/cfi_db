import { useQuery } from "@tanstack/react-query"
import {
    getSundaySchoolAggregates,
    getSundaySchoolAttendance,
    getSundaySchoolAttendanceDetail,
    type SundaySchoolAttendanceParams,
} from "../services/sunday-school-attendance"
import { useActiveAssemblyId } from "@/hooks/query/use-user"
import { assemblyQueryKeys } from "@/lib/query-keys"

export function useSundaySchoolAttendance(
    params: SundaySchoolAttendanceParams = {}
) {
    const assemblyId = useActiveAssemblyId()
    return useQuery({
        queryKey: assemblyQueryKeys.key(assemblyId, "people", "sunday-school-attendance", params),
        queryFn: () => getSundaySchoolAttendance(params),
        enabled: Boolean(assemblyId),
    })
}

export function useSundaySchoolAttendanceDetail(id: string | number) {
    const assemblyId = useActiveAssemblyId()
    return useQuery({
        queryKey: assemblyQueryKeys.key(assemblyId, "people", "sunday-school-attendance", String(id)),
        queryFn: () => getSundaySchoolAttendanceDetail(id),
        enabled: Boolean(assemblyId && id),
    })
}

export function useSundaySchoolAggregates(
    params: SundaySchoolAttendanceParams = {}
) {
    const assemblyId = useActiveAssemblyId()
    return useQuery({
        queryKey: assemblyQueryKeys.key(assemblyId, "people", "sunday-school-attendance", "aggregates", params),
        queryFn: () => getSundaySchoolAggregates(params),
        enabled: Boolean(assemblyId),
    })
}
