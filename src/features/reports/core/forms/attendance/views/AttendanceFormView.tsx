"use client"

import { useState } from "react"
import { AttendanceGrid } from "../components/AttendanceGrid"
import { AttendanceDetailDrawer } from "../components/AttendanceDrawer"
import { AttendanceRecord } from "../types/attendance"


export default function AttendanceFormView() {

    const [records, setRecords] = useState<AttendanceRecord[]>([
        {
            timestamp: "2026-09-01",
            men: 58,
            women: 62,
            visitor_men: 5,
            visitor_women: 7,
            new_convert_men: 1,
            new_convert_women: 1,
            baptism_men: 1,
            baptism_women: 0,
            altar_call_men: 2,
            altar_call_women: 2,
            online_viewers: 20,
            volunteers_on_duty: 8,
            total_leaders_present: 6,
        },
    ])

    const [selected, setSelected] =
        useState<AttendanceRecord | null>(null)

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
