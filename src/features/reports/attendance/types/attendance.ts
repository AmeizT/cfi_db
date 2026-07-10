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
  total_adults: number;
  total_children: number;
  total_visitors: number;
  total_new_converts: number;
  total_altar_call: number;
  total_baptisms: number;
  online_viewers: number;
  volunteers_on_duty: number;
  total_leaders_present: number;
}

export interface NumericField {
  key: keyof Pick<
    AttendanceRecord,
    | "total_adults"
    | "total_children"
    | "total_visitors"
    | "total_new_converts"
    | "total_altar_call"
    | "total_baptisms"
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
