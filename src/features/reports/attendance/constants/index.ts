import { NumericField, SummaryChip } from "../types/attendance"

export const NUMERIC_FIELDS: NumericField[] = [
    { key: "adults", label: "Adults", icon: "👤" },
    { key: "children", label: "Children", icon: "🧒" },
    { key: "guest_attendance", label: "Guests", icon: "🙋" },
    { key: "new_converts", label: "New Converts", icon: "✨" },
    { key: "altar_call", label: "Altar Call", icon: "🙏" },
    { key: "baptisms", label: "Baptisms", icon: "💧" },
    { key: "online_viewers", label: "Online", icon: "📺" },
    { key: "volunteers_on_duty", label: "Volunteers", icon: "🦺" },
    { key: "total_leaders_present", label: "Leaders", icon: "⭐" },
];

export const SERVICE_TYPES: string[] = ["Sunday", "Wednesday", "Friday", "Special"];

export const WEATHER_OPTIONS: string[] = ["Sunny", "Cloudy", "Rainy", "Stormy", "Windy", "Clear"];

export const SUMMARY_CHIPS: SummaryChip[] = [
    { key: "adults", label: "Adults", color: "#4ade80" },
    { key: "children", label: "Children", color: "#67e8f9" },
    { key: "guest_attendance", label: "Guests", color: "#a78bfa" },
    { key: "new_converts", label: "Converts", color: "#fb923c" },
    { key: "baptisms", label: "Baptisms", color: "#38bdf8" },
    { key: "online_viewers", label: "Online", color: "#e879f9" },
];
