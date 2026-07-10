import { useQuery } from "@tanstack/react-query"
import {
    getAttendanceAnalytics,
    getCashflowAnalytics,
    getTithesAnalytics,
    type AnalyticsScopeFilters,
} from "../services/get-ytd-report"

export function useTithesAnalytics(period: string) {
    return useQuery({
        queryKey: ["tithesAnalytics", period],
        queryFn: () => getTithesAnalytics(period),
    })
}

export function useCumulativeTithesAnalytics(
    period: string,
    scopeFilters: AnalyticsScopeFilters = {}
) {
    return useQuery({
        queryKey: ["cumulativeTithesAnalytics", period, scopeFilters],
        queryFn: () => getTithesAnalytics(period, scopeFilters),
    })
}

export function useAttendanceAnalytics(period: string) {
    return useQuery({
        queryKey: ["attendanceAnalytics", period],
        queryFn: () => getAttendanceAnalytics(period),
    })
}

export function useCashflowAnalytics(period: string) {
    return useQuery({
        queryKey: ["cashflowAnalytics", period],
        queryFn: () => getCashflowAnalytics(period),
    })
}
