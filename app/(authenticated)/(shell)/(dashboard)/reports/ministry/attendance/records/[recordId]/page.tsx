import { AttendanceRecordDetailsView } from "@/features/reports/attendance/details/AttendanceRecordDetailsView"

export default async function ReportAttendanceRecordPage({
    params,
}: {
    params: Promise<{ recordId: string }>
}) {
    const { recordId } = await params

    return <AttendanceRecordDetailsView recordId={recordId} />
}
