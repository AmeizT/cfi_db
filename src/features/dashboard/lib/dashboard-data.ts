import {
  Box,
  CircleDollarSign,
  FilePlus2,
  Upload,
  UserPlus,
  type LucideIcon,
} from "lucide-react"

export interface PromptSuggestion {
  label: string
  prompt: string
}

export interface QuickAction {
  label: string
  href: string
  icon: LucideIcon
}

export interface DashboardStat {
  label: string
  value?: string
  badge?: {
    label: "HEALTHY" | "STABLE" | "STRAINED" | "CRITICAL"
    tone: "healthy" | "stable" | "strained" | "critical"
  }
  inlineNote?: string
  trend?: {
    direction: "up" | "down" | "neutral"
    label: string
  }
}

export const promptSuggestions: PromptSuggestion[] = [
  {
    label: "What's overdue this month?",
    prompt: "What's overdue across my reports this month?",
  },
  {
    label: "Summarize April's compliance",
    prompt: "Summarize April's compliance for Orwetoveni.",
  },
  {
    label: "Members joined this year?",
    prompt: "How many members have joined this year?",
  },
]

export const quickActions: QuickAction[] = [
  { label: "New Report", href: "/reports/new", icon: FilePlus2 },
  { label: "Add Member", href: "/members/new", icon: UserPlus },
  {
    label: "Log Contribution",
    href: "/finance/contributions/new",
    icon: CircleDollarSign,
  },
  { label: "Add Asset", href: "/assets/new", icon: Box },
  { label: "Upload Document", href: "/documents/upload", icon: Upload },
]

export const dashboardStats: DashboardStat[] = [
  {
    label: "Compliance Status",
    badge: { label: "STABLE", tone: "stable" },
  },
  {
    label: "Active Reports",
    value: "2",
    inlineNote: "April in progress",
  },
  {
    label: "This Month's Tithes",
    value: "NAD 12,450",
    trend: { direction: "up", label: "+8% vs March" },
  },
  {
    label: "Remittance Due",
    value: "NAD 1,245",
    trend: { direction: "neutral", label: "10% of tithes · due May 5" },
  },
  {
    label: "Attendance",
    value: "329",
    inlineNote: "Apr 12",
    trend: { direction: "down", label: "−8 vs prior week" },
  },
  {
    label: "Members",
    value: "284",
    trend: { direction: "up", label: "+3 this month" },
  },
]

export const verseOfTheDay = {
  date: "Wednesday, July 29",
  text: "Be anxious for nothing, but in everything, by prayer and petition, with thanksgiving, present your requests to God. And the peace of God, which surpasses all understanding, will guard your hearts and your minds in Christ Jesus.",
  reference: "Philippians 4:6-7",
  translation: "BSB",
  translationName: "Berean Standard Bible",
  chapterLabel: "Read Philippians 4",
  chapterHref: "/bible/philippians/4",
  sourceHref: "https://berean.bible/",
}
