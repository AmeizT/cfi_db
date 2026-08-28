import type { IconSvgElement } from "@hugeicons/react"
import type { LucideIcon } from "lucide-react"
import {
    Building2,
    CircleDollarSign,
    ClipboardCheck,
    FilePenLine,
    HandCoins,
    Package,
    PlusCircle,
    ReceiptText,
    Sparkles,
    UserPlus,
} from "lucide-react"
import { Banknote2Icon } from '@solar-icons/react/line-duotone/banknote-2'
import { BoxIcon } from '@solar-icons/react/line-duotone/box'
import { CalendarIcon } from '@solar-icons/react/line-duotone/calendar'
import { CodeScanIcon } from '@solar-icons/react/line-duotone/code-scan'
import { DocumentsIcon } from '@solar-icons/react/line-duotone/documents'
import { History2Icon } from '@solar-icons/react/line-duotone/history-2'
import { HomeSmileIcon } from '@solar-icons/react/line-duotone/home-smile'
import { HomeSmileIcon as HomeSmileIconBold } from '@solar-icons/react/bold/home-smile'
import { LibraryIcon } from '@solar-icons/react/line-duotone/library'
import { NotesIcon as NotesIconDuotone } from '@solar-icons/react/bold-duotone/notes'
import { NotesIcon as NotesIconLineDutone } from '@solar-icons/react/line-duotone/notes'
import { SaleSquareIcon } from '@solar-icons/react/line-duotone/sale-square'
import { ShieldIcon as ShieldIconDuotone } from '@solar-icons/react/bold-duotone/shield'
import { ShieldUpIcon } from '@solar-icons/react/line-duotone/shield-up'
import { RoundGraphIcon } from '@solar-icons/react/line-duotone/round-graph'
import { ThreeSquaresIcon } from '@solar-icons/react/line-duotone/three-squares'
import { UsersGroupRoundedIcon } from '@solar-icons/react/line-duotone/users-group-rounded'
import { WalletMoneyIcon } from '@solar-icons/react/line-duotone/wallet-money'
import { Widget6Icon } from '@solar-icons/react/line-duotone/widget-6'
import { Widget6Icon as Widget6IconBold } from '@solar-icons/react/bold/widget-6'
import type { ComponentType, SVGProps } from "react"
import { APP_ROUTES } from "./app-routes.ts"
import {
    createReportSectionWizardHref,
    type WorkflowReportSectionKey,
} from "@/features/report-wizard/config/report-routing"
import { CashOutIcon, DollarIcon, HomeAngle2Icon, Planet3Icon } from "@solar-icons/react/line-duotone";
import { JethroIcon } from "@/assets/icons/brand/jethro.tsx";

export type CustomSvgIcon = ComponentType<SVGProps<SVGSVGElement>>
export type NavigationIcon = IconSvgElement | CustomSvgIcon | LucideIcon

export type WorkspacePermission =
    | "manageAssemblies"
    | "viewRegionalReports"
    | "viewZone"

export type NavigationItem = {
    key: string
    label: string
    href: string
    icon: NavigationIcon
    activeIcon: NavigationIcon
    match?: string[]
    permission?: WorkspacePermission
    disabled?: boolean
    children?: NavigationItem[]
}

export type NavigationSection = {
    title?: string
    items: NavigationItem[]
}

export type QuickCreateAction = {
    key: string
    label: string
    description: string
    href: string
    icon: NavigationIcon
    permission?: WorkspacePermission
    disabled?: boolean
    reportSection?: WorkflowReportSectionKey
}

export type QuickCreateReportContext = {
    id: number | null
    status: string
    capabilities: { is_editable: boolean }
}

export function resolveQuickCreateHref(
    action: QuickCreateAction,
    report?: QuickCreateReportContext,
) {
    if (!action.reportSection) return action.href
    if (
        !report?.id
        || !report.capabilities.is_editable
        || report.status === "submitted"
        || report.status === "locked"
    ) {
        return APP_ROUTES.reports.current
    }
    return createReportSectionWizardHref(action.reportSection, {
        method: "manual-entry",
        report_id: report.id,
        amendment_context: report.status === "reopened" ? "reopened" : null,
    })
}

const financeItems: NavigationItem[] = [
    {
        key: "finance-tithes",
        label: "Tithes",
        href: APP_ROUTES.finance.tithes,
        icon: DollarIcon,
        activeIcon: DollarIcon,
    },
    {
        key: "finance-revenue",
        label: "Revenue",
        href: APP_ROUTES.finance.revenue,
        icon: Banknote2Icon,
        activeIcon: Banknote2Icon,
    },
    {
        key: "finance-expenses",
        label: "Expenses",
        href: APP_ROUTES.finance.expenses,
        icon: CashOutIcon,
        activeIcon: CashOutIcon,
    },
    {
        key: "finance-statements",
        label: "Statements",
        href: APP_ROUTES.finance.statements,
        match: [
            "/finance/financial-activity/statement",
            "/finance/financial-activity/cumulative",
        ],
        icon: DocumentsIcon,
        activeIcon: DocumentsIcon,
    },
    {
        key: "finance-remittance",
        label: "Remittance",
        href: APP_ROUTES.finance.remittance,
        icon: SaleSquareIcon,
        activeIcon: SaleSquareIcon,
    },
]

const engagementItems: NavigationItem[] = [
    {
        key: "engagement-attendance",
        label: "Attendance",
        href: APP_ROUTES.engagement.attendance,
        icon: CalendarIcon,
        activeIcon: CalendarIcon,
    },
    {
        key: "engagement-outreach",
        label: "Outreach",
        href: APP_ROUTES.engagement.outreach,
        icon: DocumentsIcon,
        activeIcon: DocumentsIcon,
    },
    {
        key: "engagement-activities",
        label: "Activities",
        href: APP_ROUTES.engagement.activities,
        icon: History2Icon,
        activeIcon: History2Icon,
    },
    {
        key: "engagement-check-ins",
        label: "Check-ins",
        href: APP_ROUTES.engagement.checkIns,
        icon: CodeScanIcon,
        activeIcon: CodeScanIcon,
    },
]

/** The single global navigation tree used by the sidebar and search. */
export const workspaceNavigation: NavigationSection[] = [
    {
        items: [
            {
                key: "home",
                label: "Home",
                href: APP_ROUTES.home,
                icon: HomeSmileIcon,
                activeIcon: HomeSmileIconBold,
            },
        ],
    },
    {
        title: "AI Assistant",
        items: [
            {
                key: "jethro-ai",
                label: "Jethro AI",
                href: APP_ROUTES.ai,
                icon: JethroIcon,
                activeIcon: JethroIcon,
            },
        ],
    },
    {
        title: "Reporting",
        items: [
            {
                key: "reports-overview",
                label: "Reports Overview",
                href: APP_ROUTES.reports.overview,
                icon: Widget6Icon,
                activeIcon: Widget6IconBold,
            },
            {
                key: "current-report",
                label: "Current Report",
                href: APP_ROUTES.reports.current,
                match: ["/report-wizard"],
                icon: NotesIconLineDutone,
                activeIcon: NotesIconDuotone,
            },
            {
                key: "report-activity",
                label: "Report Activity",
                href: APP_ROUTES.reports.activity,
                match: ["/reports/period", "/reports/submitted"],
                icon: History2Icon,
                activeIcon: History2Icon,
            },
            {
                key: "compliance",
                label: "Compliance",
                href: APP_ROUTES.reports.compliance,
                icon: ShieldUpIcon,
                activeIcon: ShieldIconDuotone,
            },
            {
                key: "performance",
                label: "Performance",
                href: APP_ROUTES.reports.performance,
                icon: RoundGraphIcon,
                activeIcon: RoundGraphIcon,
            },
            // {
            //     key: "insights",
            //     label: "Insights",
            //     href: APP_ROUTES.reports.insights,
            //     icon: Sparkles,
            //     activeIcon: Sparkles,
            // },
        ],
    },
    {
        title: "Operations",
        items: [
            {
                key: "finance",
                label: "Finance",
                href: financeItems[0].href,
                icon: WalletMoneyIcon,
                activeIcon: WalletMoneyIcon,
                children: financeItems,
            },
            {
                key: "engagement",
                label: "Engagement",
                href: engagementItems[0].href,
                icon: Planet3Icon,
                activeIcon: Planet3Icon,
                children: engagementItems,
            },
        ],
    },
    {
        title: "Organization",
        items: [
            {
                key: "members",
                label: "Members",
                href: APP_ROUTES.members.root,
                match: ["/members"],
                icon: UsersGroupRoundedIcon,
                activeIcon: UsersGroupRoundedIcon,
            },
            {
                key: "communities",
                label: "Communities",
                href: APP_ROUTES.spaces,
                icon: ThreeSquaresIcon,
                activeIcon: ThreeSquaresIcon,
            },
            {
                key: "assets",
                label: "Assets",
                href: APP_ROUTES.assets,
                icon: BoxIcon,
                activeIcon: BoxIcon,
            },
            {
                key: "library",
                label: "Library",
                href: APP_ROUTES.library,
                icon: LibraryIcon,
                activeIcon: LibraryIcon,
            },
        ],
    },
    {
        title: "Administration",
        items: [
            {
                key: "assemblies",
                label: "Assemblies",
                href: "/administration/assemblies",
                icon: Building2,
                activeIcon: Building2,
                permission: "manageAssemblies",
            },
            {
                key: "zone",
                label: "Zone",
                href: "/zone",
                icon: ClipboardCheck,
                activeIcon: ClipboardCheck,
                permission: "viewZone",
            },
        ],
    },
]

export const quickCreateActions: QuickCreateAction[] = [
    {
        key: "continue-report",
        label: "Continue current report",
        description: "Open the report workspace",
        href: APP_ROUTES.reports.current,
        icon: FilePenLine,
    },
    {
        key: "attendance",
        label: "Record attendance",
        description: "Add an attendance record",
        href: createReportSectionWizardHref("general_attendance"),
        reportSection: "general_attendance",
        icon: ClipboardCheck,
    },
    {
        key: "tithe",
        label: "Record tithe",
        description: "Add a tithe entry",
        href: createReportSectionWizardHref("tithes"),
        reportSection: "tithes",
        icon: HandCoins,
    },
    {
        key: "revenue",
        label: "Add revenue",
        description: "Record revenue received",
        href: createReportSectionWizardHref("revenue"),
        reportSection: "revenue",
        icon: CircleDollarSign,
    },
    {
        key: "operating-expense",
        label: "Add operating expense",
        description: "Record an operating expense",
        href: createReportSectionWizardHref("operating_expenses"),
        reportSection: "operating_expenses",
        icon: ReceiptText,
    },
    {
        key: "activity-expense",
        label: "Add activity or other expense",
        description: "Record another expense",
        href: createReportSectionWizardHref("activity_other_expenses"),
        reportSection: "activity_other_expenses",
        icon: PlusCircle,
    },
    {
        key: "member",
        label: "Create member",
        description: "Open member onboarding",
        href: APP_ROUTES.members.onboarding,
        icon: UserPlus,
    },
    {
        key: "homecell",
        label: "Create homecell",
        description: "Open the homecell workspace",
        href: "/spaces/home-cells",
        icon: Building2,
    },
    {
        key: "asset",
        label: "Register asset",
        description: "Open the asset register",
        href: APP_ROUTES.assets,
        icon: Package,
    },
]

export function getWorkspaceNavigationSections() {
    return workspaceNavigation
}
