import type { EntitySegment, EntityTab } from "../../shared/master-detail"

export const DIRECTORY_SEGMENTS: EntitySegment[] = [
    { value: "all", label: "All" },
    { value: "adults", label: "Adults" },
    { value: "children", label: "Children" },
    { value: "former", label: "Former" },
]

export const DIRECTORY_SEGMENT_VALUES = DIRECTORY_SEGMENTS.map((segment) => segment.value)

export type DirectoryTab = "overview" | "attendance" | "giving" | "groups" | "activity" | "documents" | "notes"

export const DIRECTORY_TAB_VALUES: DirectoryTab[] = [
    "overview", "attendance", "giving", "groups", "activity", "documents", "notes",
]

export function getDirectoryTabs(canViewSensitive: boolean): Array<EntityTab<DirectoryTab>> {
    return [
        { value: "overview", label: "Overview" },
        { value: "attendance", label: "Attendance" },
        { value: "giving", label: "Giving", visible: canViewSensitive },
        { value: "groups", label: "Groups & Ministry" },
        { value: "activity", label: "Activity" },
        { value: "documents", label: "Documents" },
        { value: "notes", label: "Notes", visible: canViewSensitive },
    ]
}
