import { StatusConfigProps } from "../types/status.types";

export const STATUS_CONFIG: StatusConfigProps = {
    finalized: {
        label: "Finalized",
        dot: "#4ade80",
        text: "#4ade80",
        bg: "rgba(74,222,128,0.08)",
        border: "rgba(74,222,128,0.2)",
        icon: "✓"
    },
    draft: {
        label: "Draft",
        dot: "#fb923c",
        text: "#fb923c",
        bg: "rgba(251,146,60,0.08)",
        border: "rgba(251,146,60,0.2)",
        icon: "◐"
    },
    reviewed: {
        label: "Incomplete",
        dot: "#374151",
        text: "#6b7280",
        bg: "rgba(55,65,81,0.15)",
        border: "rgba(55,65,81,0.3)",
        icon: "○"
    },
}