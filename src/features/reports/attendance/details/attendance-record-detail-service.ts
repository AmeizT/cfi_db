import { apiRoutes } from "@/config/urls"
import {
    AttendanceRecordDetailError,
    type AttendanceRecordDetail,
} from "./attendance-record-detail"

export async function getAttendanceRecordDetail(
    recordId: string | number
): Promise<AttendanceRecordDetail> {
    const response = await fetch(apiRoutes.attendance.detail(recordId), {
        credentials: "include",
        cache: "no-store",
    })
    const payload = await response.json().catch(() => null)

    if (!response.ok) {
        const message =
            typeof payload?.detail === "string"
                ? payload.detail
                : "The attendance record could not be loaded."
        throw new AttendanceRecordDetailError(message, response.status)
    }

    return payload as AttendanceRecordDetail
}
