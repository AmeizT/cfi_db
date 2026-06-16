import { getMetaData } from "@/config/metadata"
import AttendanceVisualizations from "@/features/attendance/containers/Attendance"

const meta = getMetaData({ title: "Attendance Reports" })
export const metadata = { ...meta }

export default function AttendanceReportPage() {
    return (
        <AttendanceVisualizations />
    )
}