export type AttendanceRecord = {
    id?: number
    timestamp: string

    adults: number
    children: number
    guest_attendance: number
    new_converts: number
    baptisms: number
    altar_call: number
    online_viewers: number
    volunteers_on_duty: number
    total_leaders_present: number

    preacher?: string
    sermon?: string
    scriptures?: string
    weather?: string
    notes?: string
}