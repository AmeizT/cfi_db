import type { Attendance } from "@/dal/types"

export type AttendanceRecordDetail = Attendance & {
    assembly_name: string
    homecell_name: string | null
    report_status: string | null
    report_status_label: string
    can_edit: boolean
}

export class AttendanceRecordDetailError extends Error {
    status: number

    constructor(message: string, status: number) {
        super(message)
        this.name = "AttendanceRecordDetailError"
        this.status = status
    }
}
