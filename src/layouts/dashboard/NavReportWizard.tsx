"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { HugeiconsIcon } from "@hugeicons/react"
import {
    DownloadIcon,
    FileSpreadsheetIcon,
    FileTextIcon,
    PrinterIcon,
} from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuBadge,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import {
    REPORT_WIZARD_SECTIONS,
    getReportWizardSectionByPathname,
    isPartialReportWizardReport,
    toReportWizardList,
    type ReportWizardSection,
    type ReportWizardTemplateFormat,
} from "@/features/report-wizard/config/report-types"
import { cn } from "@/lib/utils"
import type { NavGroup, NavItem } from "../navigation/types"

type NavReportWizardProps = {
    menu: NavGroup[]
    reportsData?: unknown
}

const TEMPLATE_FORMATS: Array<{
    id: ReportWizardTemplateFormat
    label: string
    unavailableLabel: string
    icon: React.ElementType
}> = [
    {
        id: "excel",
        label: "Excel template",
        unavailableLabel: "Excel unavailable",
        icon: FileSpreadsheetIcon,
    },
    {
        id: "csv",
        label: "CSV template",
        unavailableLabel: "CSV unavailable",
        icon: FileTextIcon,
    },
    {
        id: "print",
        label: "Ready-to-print form",
        unavailableLabel: "Print form unavailable",
        icon: PrinterIcon,
    },
]

function isItemActive(pathname: string, item: NavItem) {
    const href = item.href?.split("?")[0] ?? ""

    if (href === "/report-wizard") {
        return pathname === href || pathname.startsWith("/report-wizard/create")
    }

    return item.exact
        ? pathname === href
        : Boolean(href) && (pathname === href || pathname.startsWith(`${href}/`))
}

function TemplateFormatItems({ section }: { section: ReportWizardSection }) {
    return (
        <>
            {TEMPLATE_FORMATS.map((format) => {
                const Icon = format.icon
                const href = section.templateUrls[format.id]

                if (!href) {
                    return (
                        <DropdownMenuItem key={format.id} disabled>
                            <Icon className="size-4" />
                            <span>{format.unavailableLabel}</span>
                        </DropdownMenuItem>
                    )
                }

                return (
                    <DropdownMenuItem key={format.id} asChild>
                        <a href={href}>
                            <Icon className="size-4" />
                            <span>{format.label}</span>
                        </a>
                    </DropdownMenuItem>
                )
            })}
        </>
    )
}

function TemplateDownloadMenu({ activeSection }: { activeSection: ReportWizardSection | null }) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <SidebarMenuButton type="button" aria-label="Download Template">
                    <DownloadIcon className="size-5.5" />
                    <span>Download Template</span>
                </SidebarMenuButton>
            </DropdownMenuTrigger>

            <DropdownMenuContent side="right" align="start" className="w-64">
                {activeSection ? (
                    <>
                        <DropdownMenuLabel>
                            {activeSection.label}
                        </DropdownMenuLabel>
                        <TemplateFormatItems section={activeSection} />
                    </>
                ) : (
                    <>
                        <DropdownMenuLabel>
                            Choose report type
                        </DropdownMenuLabel>
                        {REPORT_WIZARD_SECTIONS.map((section) => (
                            <DropdownMenuSub key={section.id}>
                                <DropdownMenuSubTrigger>
                                    {section.label}
                                </DropdownMenuSubTrigger>
                                <DropdownMenuSubContent className="w-56">
                                    <DropdownMenuLabel>
                                        {section.label}
                                    </DropdownMenuLabel>
                                    <TemplateFormatItems section={section} />
                                </DropdownMenuSubContent>
                            </DropdownMenuSub>
                        ))}
                    </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <Link href="/report-wizard">
                        <DownloadIcon className="size-4" />
                        <span>Open report wizard</span>
                    </Link>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

function ReportWizardItem({
    item,
    pathname,
    inProgressCount,
}: {
    item: NavItem
    pathname: string
    inProgressCount: number
}) {
    const isActive = isItemActive(pathname, item)
    const showBadge = item.label === "In Progress" && inProgressCount > 0

    return (
        <SidebarMenuItem className="flex justify-center">
            <SidebarMenuButton
                asChild
                tooltip={item.label}
                isActive={isActive}
                className={cn(
                    "font-[450] transition-colors duration-75",
                    isActive && "bg-theme-50 text-theme-700 hover:bg-theme-100 dark:bg-primary/10 dark:text-primary"
                )}
            >
                <Link href={item.href ?? "#"}>
                    <HugeiconsIcon icon={item.icon} strokeWidth={2} />
                    <span>{item.label}</span>
                </Link>
            </SidebarMenuButton>
            {showBadge ? (
                <SidebarMenuBadge className="bg-primary/10 text-primary">
                    {inProgressCount}
                </SidebarMenuBadge>
            ) : null}
        </SidebarMenuItem>
    )
}

export function NavReportWizard({ menu, reportsData }: NavReportWizardProps) {
    const pathname = usePathname()
    const activeSection = getReportWizardSectionByPathname(pathname)
    const inProgressCount = React.useMemo(() => {
        return toReportWizardList(reportsData)
            .filter(isPartialReportWizardReport)
            .length
    }, [reportsData])

    return (
        <div className="flex w-full flex-col gap-2">
            {menu.map((group) => (
                <div key={group.id} className="flex flex-col items-center">
                    <SidebarGroup className="p-0">
                        <SidebarGroupLabel className="px-2 text-xs font-semibold text-muted-foreground">
                            {group.label}
                        </SidebarGroupLabel>
                        <SidebarMenu>
                            {group.items.map((item) => (
                                item.label === "Download Template" ? (
                                    <SidebarMenuItem key={item.label} className="flex justify-center">
                                        <TemplateDownloadMenu activeSection={activeSection} />
                                    </SidebarMenuItem>
                                ) : (
                                    <ReportWizardItem
                                        key={item.label}
                                        item={item}
                                        pathname={pathname}
                                        inProgressCount={inProgressCount}
                                    />
                                )
                            ))}
                        </SidebarMenu>
                    </SidebarGroup>
                </div>
            ))}
        </div>
    )
}
