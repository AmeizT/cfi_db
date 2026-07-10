import type { MonthlyComplianceItem } from "../types/regional-modules"

export type MonthlyComplianceDisplayStatus =
    | "COMPLIANT"
    | "PARTIAL"
    | "DRAFT"
    | "NOT_SUBMITTED"

export const SECTION_ORDER = [
    "attendance",
    "tithes",
    "income",
    "expenditure",
    "remittance",
    "junior_members",
] as const

export const SECTION_META: Record<string, { short: string; label: string }> = {
    attendance: {
        short: "AT",
        label: "Attendance",
    },
    tithes: {
        short: "TI",
        label: "Tithes",
    },
    income: {
        short: "IN",
        label: "Income",
    },
    expenditure: {
        short: "EX",
        label: "Expenditure",
    },
    remittance: {
        short: "RM",
        label: "Remittance",
    },
    junior_members: {
        short: "JM",
        label: "Junior Members",
    },
}

export function clamp(value: number, min: number, max: number) {
    return Math.min(Math.max(value, min), max)
}

export function getMonthlyComplianceStatus(
    item: MonthlyComplianceItem
): MonthlyComplianceDisplayStatus {
    if (item.report_status === "SUBMITTED" && item.completion >= 100) {
        return "COMPLIANT"
    }

    if (item.report_status === "SUBMITTED") {
        return "PARTIAL"
    }

    if (item.report_status === "DRAFT") {
        return "DRAFT"
    }

    return "NOT_SUBMITTED"
}

export function getVisibleMonthlyCompliance(
    monthlyCompliance: MonthlyComplianceItem[] | undefined,
    selectedYear: number,
    now = new Date()
) {
    const currentYear = now.getFullYear()
    const currentMonth = now.getMonth() + 1
    const maxMonth =
        selectedYear < currentYear
            ? 12
            : selectedYear === currentYear
                ? currentMonth
                : 0

    return [...(monthlyCompliance ?? [])]
        .map((item) => {
            const [year, month] = item.period.split("-").map(Number)

            return {
                item,
                year,
                month,
            }
        })
        .filter(({ year, month }) => {
            return (
                Number.isFinite(year) &&
                Number.isFinite(month) &&
                year === selectedYear &&
                month >= 1 &&
                month <= maxMonth
            )
        })
        .sort((a, b) => a.item.period.localeCompare(b.item.period))
        .map(({ item }) => item)
}

export function getOrderedSectionKeys(
    sections: MonthlyComplianceItem["sections"]
) {
    const keys = Object.keys(sections ?? {})
    const knownKeys = SECTION_ORDER.filter((key) => keys.includes(key))
    const unknownKeys = keys
        .filter((key) => !SECTION_ORDER.includes(key as typeof SECTION_ORDER[number]))
        .sort((a, b) => a.localeCompare(b))

    return [...knownKeys, ...unknownKeys]
}

export function getSectionMeta(key: string) {
    return (
        SECTION_META[key] ?? {
            short: key.slice(0, 2).toUpperCase(),
            label: key
                .replaceAll("_", " ")
                .replace(/\b\w/g, (char) => char.toUpperCase()),
        }
    )
}
