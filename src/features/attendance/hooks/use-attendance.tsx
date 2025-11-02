import { useQuery } from "@tanstack/react-query"
import { getAttendance } from "../services/get-attendance"

export function useAttendance() {
    return useQuery({
        queryKey: ["attendance"],
        queryFn: () => getAttendance(),
    })
}