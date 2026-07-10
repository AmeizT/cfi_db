import { keepPreviousData, useQuery } from "@tanstack/react-query"
import {
    getSundaySchoolAggregates,
    getSundaySchoolAttendance,
    getSundaySchoolAttendanceDetail,
    type SundaySchoolAttendanceParams,
} from "../services/sunday-school-attendance"

export function useSundaySchoolAttendance(
    params: SundaySchoolAttendanceParams = {}
) {
    return useQuery({
        queryKey: ["people", "sunday-school-attendance", params],
        queryFn: () => getSundaySchoolAttendance(params),
        placeholderData: keepPreviousData,
    })
}

export function useSundaySchoolAttendanceDetail(id: string | number) {
    return useQuery({
        queryKey: ["people", "sunday-school-attendance", String(id)],
        queryFn: () => getSundaySchoolAttendanceDetail(id),
        enabled: Boolean(id),
    })
}

export function useSundaySchoolAggregates(
    params: SundaySchoolAttendanceParams = {}
) {
    return useQuery({
        queryKey: ["people", "sunday-school-attendance", "aggregates", params],
        queryFn: () => getSundaySchoolAggregates(params),
        placeholderData: keepPreviousData,
    })
}
