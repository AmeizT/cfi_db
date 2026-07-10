"use client"

import React from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Drawer } from "vaul"
import { Settings, X } from "lucide-react"

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { WorkbenchQuickEntry } from "@/features/report-wizard/components/quick-entry/WorkbenchQuickEntry"
import { useReports } from "@/features/reports/core/hooks/use-reports"
import {
    createReportWizardHref,
    formatReportWizardPeriod,
    getReportWizardSectionByPathname,
    getReportWizardSections,
    isPartialReportWizardReport,
    toReportWizardList,
    type ReportWizardSection,
} from "@/features/report-wizard/config/report-types"
import { cn } from "@/lib/utils"
import { HugeiconsIcon } from "@hugeicons/react"
import { AiBrain01Icon, MagicWand05Icon } from "@hugeicons/core-free-icons"

function ReportWizardWorkbench({
    section,
    reportId,
    onClose,
}: {
    section: ReportWizardSection
    reportId: string | null
    onClose: () => void
}) {
    const year = String(new Date().getFullYear())
    const reportsQuery = useReports({ year })
    const reports = React.useMemo(
        () => toReportWizardList(reportsQuery.data),
        [reportsQuery.data]
    )
    const activeReport = React.useMemo(() => {
        if (reportId) {
            return reports.find((report) => String(report.id) === reportId) ?? null
        }

        return reports.find(isPartialReportWizardReport) ?? null
    }, [reportId, reports])
    const activeSectionStatus = activeReport
        ? getReportWizardSections(activeReport).find((item) => item.name === section.backendId)
        : undefined

    return (
        <WorkbenchQuickEntry
            initialReportType={section.backendId}
            currentSectionId={section.backendId}
            contextLabel={activeReport?.assembly?.name ?? "Current assembly"}
            periodLabel={activeReport ? formatReportWizardPeriod(activeReport) : undefined}
            sectionStatusId={activeSectionStatus?.id}
            onClose={onClose}
        />
    )
}

export default function AppWorkbench() {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const [manualOpen, setManualOpen] = React.useState(false)
    const method = searchParams.get("method")
    const reportId = searchParams.get("report_id")
    const reportWizardSection = React.useMemo(
        () => pathname.includes("/report-wizard/create")
            ? getReportWizardSectionByPathname(pathname)
            : null,
        [pathname]
    )
    const isReportWizardQuickEntry = Boolean(reportWizardSection && method === "quick-entry")
    const open = manualOpen || isReportWizardQuickEntry

    const closeQuickEntryRoute = React.useCallback(() => {
        if (!reportWizardSection || method !== "quick-entry") return

        router.replace(createReportWizardHref(reportWizardSection.id, {
            method: "manual-entry",
            report_id: reportId,
        }), { scroll: false })
    }, [method, reportId, reportWizardSection, router])

    const handleOpenChange = React.useCallback((nextOpen: boolean) => {
        setManualOpen(nextOpen)

        if (!nextOpen) {
            closeQuickEntryRoute()
        }
    }, [closeQuickEntryRoute])

    const tooltipText = open ? "Close Workbench" : "Open Workbench"

    return (
        <Drawer.Root open={open} onOpenChange={handleOpenChange} direction="bottom">
            <Tooltip>
                <TooltipTrigger asChild>
                    <button
                        type="button"
                        aria-label={tooltipText}
                        aria-pressed={open}
                        onClick={() => handleOpenChange(!open)}
                        className={cn(
                            "fixed right-6 z-70 flex size-13 items-center justify-center rounded-full border-0 border-border-subtle bg-user-theme text-white shadow-lg shadow-black/20 outline-none transition-all duration-200 hover:scale-105 focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2 dark:bg-neutral-700 dark:text-neutral-950 dark:focus-visible:ring-white bottom-6",
                            // open
                            //     ? "top-6 rotate-90 bg-neutral-800 dark:bg-neutral-100"
                            //     : "bottom-6 rotate-0"
                        )}
                    >
                        <HugeiconsIcon icon={AiBrain01Icon} className="size-6" />
                    </button>
                </TooltipTrigger>
                <TooltipContent side="left" sideOffset={10} className="z-80">
                    {tooltipText}
                </TooltipContent>
            </Tooltip>

            <Drawer.Portal>
                {/* <Drawer.Overlay className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" /> */}
                <Drawer.Content
                    className="right-2.5 bottom-2.5 fixed z-60 flex h-4/5 w-[calc(100vw-1rem)] max-w-[calc(100vw-1rem)] outline-none sm:w-120 lg:w-1/3"
                    style={{ '--initial-transform': 'calc(100% + 8px)' } as React.CSSProperties}
                >
                    <Drawer.Title className="sr-only">Workbench</Drawer.Title>
                    {reportWizardSection ? (
                        <ReportWizardWorkbench
                            key={`${reportWizardSection.id}-${reportId ?? "new"}`}
                            section={reportWizardSection}
                            reportId={reportId}
                            onClose={() => handleOpenChange(false)}
                        />
                    ) : (
                        <WorkbenchQuickEntry onClose={() => handleOpenChange(false)} />
                    )}
                </Drawer.Content>
            </Drawer.Portal>
        </Drawer.Root>
    )
}
