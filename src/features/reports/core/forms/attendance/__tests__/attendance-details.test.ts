import assert from "node:assert/strict"
import test from "node:test"

import { hasAttendanceDetails } from "../components/AttendanceGrid"
import { serializeAttendanceRecord } from "../views/AttendanceFormView"
import type { AttendanceRecord } from "../types/attendance"

const record: AttendanceRecord = {
    id: 12,
    timestamp: "2026-07-05",
    service_type: "sunday",
    men: 10,
    women: 12,
    visitor_men: 3,
    visitor_women: 4,
    new_convert_men: 1,
    new_convert_women: 2,
    baptism_men: 0,
    baptism_women: 1,
    altar_call_men: 2,
    altar_call_women: 3,
    online_viewers: 8,
    volunteers_on_duty: 5,
    total_leaders_present: 4,
}

test("attendance details affordance changes when metadata is present", () => {
    assert.equal(hasAttendanceDetails(record), false)
    assert.equal(hasAttendanceDetails({ ...record, preacher: "E. Zhuwao" }), true)
    assert.equal(hasAttendanceDetails({ ...record, is_special_event: true }), true)
})

test("attendance detail saves keep numeric metrics and supported metadata", () => {
    const payload = serializeAttendanceRecord({
        ...record,
        is_special_event: true,
        special_event_name: "Family Sunday",
        preacher: "E. Zhuwao",
        sermon: "Faith in action",
        scriptures: "James 2:14-26",
        weather: "sunny",
        notes: "Full morning service",
    })

    assert.equal(payload.men, 10)
    assert.equal(payload.women, 12)
    assert.equal(payload.visitor_men, 3)
    assert.equal(payload.is_special_event, true)
    assert.equal(payload.special_event_name, "Family Sunday")
    assert.equal(payload.preacher, "E. Zhuwao")
    assert.equal(payload.sermon, "Faith in action")
    assert.equal(payload.scriptures, "James 2:14-26")
    assert.equal(payload.weather, "sunny")
    assert.equal(payload.notes, "Full morning service")
})
