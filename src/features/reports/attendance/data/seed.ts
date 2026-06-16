import { AttendanceRecord } from "../types/attendance";

let nextId = 6;

export function makeEmpty(): AttendanceRecord {
  return {
    id: nextId++,
    timestamp: new Date().toISOString().split("T")[0],
    service_type: "Sunday",
    is_special_event: false,
    special_event_name: "",
    weather: "",
    preacher: "",
    sermon: "",
    scriptures: "",
    notes: "",
    adults: 0,
    children: 0,
    guest_attendance: 0,
    new_converts: 0,
    altar_call: 0,
    baptisms: 0,
    online_viewers: 0,
    volunteers_on_duty: 0,
    total_leaders_present: 0,
  };
}

export const SEED: AttendanceRecord[] = [
  { id: 1, timestamp: "2025-03-02", service_type: "Sunday",    is_special_event: false, special_event_name: "",                weather: "Sunny",  preacher: "Pastor John",  sermon: "Walking by Faith",    scriptures: "Heb 11:1-6",   notes: "",                      adults: 312, children: 87, guest_attendance: 24, new_converts: 8,  altar_call: 22, baptisms: 3, online_viewers: 145, volunteers_on_duty: 18, total_leaders_present: 34 },
  { id: 2, timestamp: "2025-02-23", service_type: "Sunday",    is_special_event: false, special_event_name: "",                weather: "Cloudy", preacher: "Pastor Sarah", sermon: "The Power of Praise", scriptures: "Ps 22:3",      notes: "Good turnout despite weather", adults: 289, children: 72, guest_attendance: 31, new_converts: 5,  altar_call: 18, baptisms: 0, online_viewers: 201, volunteers_on_duty: 16, total_leaders_present: 28 },
  { id: 3, timestamp: "2025-02-19", service_type: "Wednesday", is_special_event: false, special_event_name: "",                weather: "Rainy",  preacher: "Elder Mike",   sermon: "Prayer & Fasting",   scriptures: "Matt 6:16-18", notes: "",                      adults: 134, children: 21, guest_attendance: 9,  new_converts: 2,  altar_call: 7,  baptisms: 0, online_viewers: 89,  volunteers_on_duty: 10, total_leaders_present: 19 },
  { id: 4, timestamp: "2025-02-16", service_type: "Sunday",    is_special_event: true,  special_event_name: "Valentine's Sunday", weather: "Sunny", preacher: "Pastor John", sermon: "Love of God",        scriptures: "John 3:16",    notes: "Special couples event", adults: 401, children: 95, guest_attendance: 67, new_converts: 14, altar_call: 38, baptisms: 7, online_viewers: 312, volunteers_on_duty: 24, total_leaders_present: 41 },
  { id: 5, timestamp: "2025-02-09", service_type: "Sunday",    is_special_event: false, special_event_name: "",                weather: "Clear",  preacher: "Pastor John",  sermon: "Renewed Strength",   scriptures: "Isa 40:31",    notes: "",                      adults: 276, children: 64, guest_attendance: 19, new_converts: 4,  altar_call: 12, baptisms: 1, online_viewers: 178, volunteers_on_duty: 15, total_leaders_present: 26 },
];
