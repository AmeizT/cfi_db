export interface AttendanceRecord {
  id: number;
  timestamp: string;
  service_type: string;
  is_special_event: boolean;
  special_event_name: string;
  weather: string;
  preacher: string;
  sermon: string;
  scriptures: string;
  notes: string;
  adults: number;
  children: number;
  guest_attendance: number;
  new_converts: number;
  altar_call: number;
  baptisms: number;
  online_viewers: number;
  volunteers_on_duty: number;
  total_leaders_present: number;
}

export interface NumericField {
  key: keyof Pick<
    AttendanceRecord,
    | "adults"
    | "children"
    | "guest_attendance"
    | "new_converts"
    | "altar_call"
    | "baptisms"
    | "online_viewers"
    | "volunteers_on_duty"
    | "total_leaders_present"
  >;
  label: string;
  icon: string;
}

export interface SummaryChip {
  key: NumericField["key"];
  label: string;
  color: string;
}

export interface ServiceBadgeColors {
  bg: string;
  text: string;
  border: string;
}
