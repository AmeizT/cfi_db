export type AttendanceRecord = {
    id?: number
    timestamp: string

    men: number
    women: number
    visitor_men: number
    visitor_women: number
    new_convert_men: number
    new_convert_women: number
    baptism_men: number
    baptism_women: number
    altar_call_men: number
    altar_call_women: number
    online_viewers: number
    volunteers_on_duty: number
    total_leaders_present: number
    service_type?: string
    is_special_event?: boolean
    special_event_name?: string

    preacher?: string
    sermon?: string
    scriptures?: string
    weather?: string | null
    notes?: string
}
