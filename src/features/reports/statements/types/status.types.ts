export interface StatusItemProps {
    label: string
    dot: string
    text: string
    bg: string
    border: string
    icon: string
}

export interface StatusConfigProps {
    finalized: StatusItemProps
    draft: StatusItemProps
    reviewed: StatusItemProps
    approved?: StatusItemProps
    archived?: StatusItemProps
}

export type ReportStatus = "draft" | "finalized" | "reviewed" | "approved" | "archived"