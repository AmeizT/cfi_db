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
    total_adults: 0,
    total_children: 0,
    total_visitors: 0,
    total_new_converts: 0,
    total_altar_call: 0,
    total_baptisms: 0,
    online_viewers: 0,
    volunteers_on_duty: 0,
    total_leaders_present: 0,
  };
}

export const SEED: AttendanceRecord[] = [
  { id: 1, timestamp: "2025-03-02", service_type: "Sunday",    is_special_event: false, special_event_name: "",                weather: "Sunny",  preacher: "Pastor John",  sermon: "Walking by Faith",    scriptures: "Heb 11:1-6",   notes: "",                      total_adults: 312, total_children: 87, total_visitors: 24, total_new_converts: 8,  total_altar_call: 22, total_baptisms: 3, online_viewers: 145, volunteers_on_duty: 18, total_leaders_present: 34 },
  { id: 2, timestamp: "2025-02-23", service_type: "Sunday",    is_special_event: false, special_event_name: "",                weather: "Cloudy", preacher: "Pastor Sarah", sermon: "The Power of Praise", scriptures: "Ps 22:3",      notes: "Good turnout despite weather", total_adults: 289, total_children: 72, total_visitors: 31, total_new_converts: 5,  total_altar_call: 18, total_baptisms: 0, online_viewers: 201, volunteers_on_duty: 16, total_leaders_present: 28 },
  { id: 3, timestamp: "2025-02-19", service_type: "Wednesday", is_special_event: false, special_event_name: "",                weather: "Rainy",  preacher: "Elder Mike",   sermon: "Prayer & Fasting",   scriptures: "Matt 6:16-18", notes: "",                      total_adults: 134, total_children: 21, total_visitors: 9,  total_new_converts: 2,  total_altar_call: 7,  total_baptisms: 0, online_viewers: 89,  volunteers_on_duty: 10, total_leaders_present: 19 },
  { id: 4, timestamp: "2025-02-16", service_type: "Sunday",    is_special_event: true,  special_event_name: "Valentine's Sunday", weather: "Sunny", preacher: "Pastor John", sermon: "Love of God",        scriptures: "John 3:16",    notes: "Special couples event", total_adults: 401, total_children: 95, total_visitors: 67, total_new_converts: 14, total_altar_call: 38, total_baptisms: 7, online_viewers: 312, volunteers_on_duty: 24, total_leaders_present: 41 },
  { id: 5, timestamp: "2025-02-09", service_type: "Sunday",    is_special_event: false, special_event_name: "",                weather: "Clear",  preacher: "Pastor John",  sermon: "Renewed Strength",   scriptures: "Isa 40:31",    notes: "",                      total_adults: 276, total_children: 64, total_visitors: 19, total_new_converts: 4,  total_altar_call: 12, total_baptisms: 1, online_viewers: 178, volunteers_on_duty: 15, total_leaders_present: 26 },
];
