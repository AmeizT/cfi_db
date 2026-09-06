import type { LucideIcon } from "lucide-react"

export type SetupTab = "manual" | "uploads"
export type CreateView = "hub" | "setup" | "wizard"
export type SaveState = "saved" | "saving"
export type StepStatus = "not_started" | "submitted" | "skipped"

export type CardAccent =
    | "purple"
    | "gold"
    | "rose"
    | "blue"
    | "teal"

export type CreateCardItem = {
    title: string
    description: string
    icon: LucideIcon
    action: "report" | "templates" | "setup" | "toast" | "form"
    href?: string
    tab?: SetupTab
    accent?: CardAccent
}

export type WizardStep = {
    key:
        | "attendance"
        | "sunday_school"
        | "tithes"
        | "other_revenue"
        | "overhead"
        | "variable"
        | "review"
    title: string
    status: StepStatus
    optional?: boolean
}

export type AttendanceRow = {
    key: string
    label: string
    special?: boolean
}

export type AttendanceData = Record<string, Record<string, string>>

export type LedgerItem = {
    category?: string
    source?: string
    desc?: string
    amount: string
}
