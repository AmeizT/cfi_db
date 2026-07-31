import { useQuery } from "@tanstack/react-query"
import {
    getAttendanceAnalytics,
    getCashflowAnalytics,
    getTithesAnalytics,
    type AnalyticsScopeFilters,
} from "../services/get-ytd-report"
import { useActiveAssemblyId } from "@/hooks/query/use-user"
import { assemblyQueryKeys } from "@/lib/query-keys"

export function useTithesAnalytics(period: string) {
    const assemblyId = useActiveAssemblyId()
    return useQuery({
        queryKey: assemblyQueryKeys.key(assemblyId, "tithesAnalytics", period),
        queryFn: () => getTithesAnalytics(period),
        enabled: Boolean(assemblyId),
    })
}

export function useCumulativeTithesAnalytics(
    period: string,
    scopeFilters: AnalyticsScopeFilters = {}
) {
    const assemblyId = useActiveAssemblyId()
    return useQuery({
        queryKey: assemblyQueryKeys.key(assemblyId, "cumulativeTithesAnalytics", period, scopeFilters),
        queryFn: () => getTithesAnalytics(period, scopeFilters),
        enabled: Boolean(assemblyId),
    })
}

export function useAttendanceAnalytics(
    period: string,
    scopeFilters: AnalyticsScopeFilters = {}
) {
    const assemblyId = useActiveAssemblyId()
    return useQuery({
        queryKey: assemblyQueryKeys.key(assemblyId, "attendanceAnalytics", period, scopeFilters),
        queryFn: () => getAttendanceAnalytics(period, scopeFilters),
        enabled: Boolean(assemblyId),
    })
}

export function useCashflowAnalytics(
    period: string,
    scopeFilters: AnalyticsScopeFilters = {}
) {
    const assemblyId = useActiveAssemblyId()
    return useQuery({
        queryKey: assemblyQueryKeys.key(assemblyId, "cashflowAnalytics", period, scopeFilters),
        queryFn: () => getCashflowAnalytics(period, scopeFilters),
        enabled: Boolean(assemblyId),
    })
}
