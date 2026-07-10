import { NumericField, SummaryChip } from "../types/attendance"

export const NUMERIC_FIELDS: NumericField[] = [
    { key: "total_adults", label: "Adults", icon: "👤" },
    { key: "total_children", label: "Children", icon: "🧒" },
    { key: "total_visitors", label: "Visitors", icon: "🙋" },
    { key: "total_new_converts", label: "New Converts", icon: "✨" },
    { key: "total_altar_call", label: "Altar Call", icon: "🙏" },
    { key: "total_baptisms", label: "Baptisms", icon: "💧" },
    { key: "online_viewers", label: "Online", icon: "📺" },
    { key: "volunteers_on_duty", label: "Volunteers", icon: "🦺" },
    { key: "total_leaders_present", label: "Leaders", icon: "⭐" },
];

export const SERVICE_TYPES: string[] = ["Sunday", "Wednesday", "Friday", "Special"];

export const WEATHER_OPTIONS: string[] = ["Sunny", "Cloudy", "Rainy", "Stormy", "Windy", "Clear"];

export const SUMMARY_CHIPS: SummaryChip[] = [
    { key: "total_adults", label: "Adults", color: "#4ade80" },
    { key: "total_children", label: "Children", color: "#67e8f9" },
    { key: "total_visitors", label: "Visitors", color: "#a78bfa" },
    { key: "total_new_converts", label: "Converts", color: "#fb923c" },
    { key: "total_baptisms", label: "Baptisms", color: "#38bdf8" },
    { key: "online_viewers", label: "Online", color: "#e879f9" },
];
