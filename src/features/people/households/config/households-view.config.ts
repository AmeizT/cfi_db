import type { EntityTab } from "../../shared/master-detail"

export type HouseholdTab = "overview" | "members" | "attendance" | "giving" | "activity" | "notes"

export const HOUSEHOLD_TAB_VALUES: HouseholdTab[] = ["overview", "members", "attendance", "giving", "activity", "notes"]

export function getHouseholdTabs(canViewSensitive: boolean): Array<EntityTab<HouseholdTab>> {
    return [
        { value: "overview", label: "Overview" },
        { value: "members", label: "Members" },
        { value: "attendance", label: "Attendance" },
        { value: "giving", label: "Giving", visible: canViewSensitive },
        { value: "activity", label: "Activity" },
        { value: "notes", label: "Notes", visible: canViewSensitive },
    ]
}
