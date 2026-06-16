"use client"

import { useState } from "react"
import { AttendanceGrid } from "../components/AttendanceGrid"
import { AttendanceDetailDrawer } from "../components/AttendanceDrawer"
import { AttendanceRecord } from "../types/attendance"


export default function AttendanceFormView() {

    const [records, setRecords] = useState<AttendanceRecord[]>([
        {
            timestamp: "2026-09-01",
            adults: 120,
            children: 40,
            guest_attendance: 12,
            new_converts: 2,
            baptisms: 1,
            altar_call: 4,
            online_viewers: 20,
            volunteers_on_duty: 8,
            total_leaders_present: 6,
        },
    ])

    const [selected, setSelected] =
        useState<AttendanceRecord | null>(null)

    const updateCell = (
        date: string,
        metric: keyof Omit<AttendanceRecord, 'timestamp'>,
        value: number
    ) => {

        setRecords((prev) =>
            prev.map((record) =>
                record.timestamp === date
                    ? { ...record, [metric]: value }
                    : record
            )
        )
    }

    const updateRecord = async (updated: AttendanceRecord): Promise<void> => {
        setRecords((prev) =>
            prev.map((r) =>
                r.timestamp === updated.timestamp ? updated : r
            )
        )
    }

    const openDetails = (record: AttendanceRecord): void => {
        setSelected(record)
    }

    const currentDate = new Date()
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth() + 1

    return (
        <div className="space-y-6">

            <AttendanceGrid 
                year={year} 
                month={month} 
                records={records} 
                updateRecord={updateRecord} 
                openDetails={openDetails}                
            />

            <AttendanceDetailDrawer
                record={selected}
                close={() => setSelected(null)}
                updateRecord={updateRecord}
            />

        </div>
    )
}