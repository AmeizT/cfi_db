"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Building2, Box, ChevronRight, FileText, LayoutTemplate, Link2, UploadCloud, UserRound, UsersRound, type LucideIcon } from "lucide-react"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuGroup, DropdownMenuSeparator, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useActiveAssemblyId, useUser } from "@/hooks/query/use-user"
import { useCurrentReport } from "@/features/reports/workflow/hooks"
import { createMonthlyReportHref, getMonthlyReportResumeSection, getMonthlyReportUploadHref } from "../monthly-report/routing"
import { MemberQuickAdd } from "@/features/people/members/components/MemberQuickAdd"
import { HouseholdQuickAdd } from "@/features/people/households/components/HouseholdQuickAdd"
import { AssetQuickAdd } from "@/features/finance/assets/components/AssetQuickAdd"
import { HomecellForm } from "../forms/HomecellForm"

import { usesRegionalShell } from "@/features/regional-shell/scope"
import { AssemblyForm } from "../forms/AssemblyForm"

type Entity = "assembly" | "member" | "household" | "asset" | "cell-group"
type OpenQuickAdd = (entity: Entity, opener: HTMLElement | null) => void
const LauncherContext = React.createContext<OpenQuickAdd | null>(null)

export function NewLauncherProvider({ children }: { children: React.ReactNode }) {
    const [entity, setEntity] = React.useState<Entity | null>(null)
    const open = entity !== null
    const contentRef = React.useRef<HTMLDivElement>(null)
    const assemblyId = useActiveAssemblyId()
    const openerRef = React.useRef<HTMLElement | null>(null)
    const openLauncher = React.useCallback<OpenQuickAdd>((nextEntity, opener) => {
        openerRef.current = opener
        setEntity(nextEntity)
    }, [])
    const changeOpen = (next: boolean) => {
        if (!next && contentRef.current?.querySelector('[aria-busy="true"]')) return
        if (!next) setEntity(null)
    }
    return <LauncherContext.Provider value={openLauncher}>
        {children}
        <Dialog open={open} onOpenChange={changeOpen}>
            <DialogContent ref={contentRef} className="max-h-[90dvh] overflow-y-auto sm:max-w-4xl"
                onCloseAutoFocus={(event) => {
                    if (openerRef.current?.isConnected) {
                        event.preventDefault()
                        openerRef.current.focus()
                    }
                }}
                onClick={(event) => {
                    // Full-form links belong to the shared forms; dismiss the launcher on navigation.
                    if (!event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey
                        && event.target instanceof Element && event.target.closest('a[href^="/"]')) {
                        changeOpen(false)
                    }
                }}
            >
                <DialogHeader><DialogTitle>New {actions.find(action => action.key === entity)?.label}</DialogTitle><DialogDescription>{entity === "assembly" ? "Create a new Assembly." : "Add a record to your active assembly."}</DialogDescription></DialogHeader>
                {entity && <QuickAddForm key={assemblyId} entity={entity} onCancel={() => changeOpen(false)} onCreated={() => setEntity(null)} />}
            </DialogContent>
        </Dialog>
    </LauncherContext.Provider>
}

const actions = [
    { key: "assembly", label: "Assembly", description: "Create a new Assembly", icon: Building2 },
    { key: "member", label: "Member", description: "Add a new member", icon: UserRound },
    { key: "household", label: "Household", description: "Create a new household", icon: UsersRound },
    { key: "cell-group", label: "Cell Group", description: "Create a new cell group", icon: Link2 },
    { key: "asset", label: "Asset", description: "Add a new asset", icon: Box },
] as const

function QuickAddForm({ entity, onCancel, onCreated }: {
    entity: Entity
    onCancel: () => void
    onCreated: () => void
}) {
    switch (entity) {
        case "assembly":
            return <AssemblyForm onCancel={onCancel} onCreated={onCreated} />
        case "member": 
            return <MemberQuickAdd onCancel={onCancel} onCreated={onCreated} />
        case "household": 
            return <HouseholdQuickAdd onCancel={onCancel} onCreated={onCreated} />
        case "cell-group": 
            return <HomecellForm onCancel={onCancel} onCreated={onCreated} />
        case "asset": 
            return <AssetQuickAdd onCancel={onCancel} onCreated={onCreated} />
    }
}

const generateLinks = [
    { label: "Templates", description: "Start from a saved template", href: "/record-center/templates", icon: LayoutTemplate },
] as const

type PendingAction = { entity: Entity } | { href: string }

export function NewLauncherMenu({ children, onAction }: { children: React.ReactElement; onAction?: () => void }) {
    const openQuickAdd = React.useContext(LauncherContext)
    if (!openQuickAdd) throw new Error("New launcher must be used within AppShell")
    const triggerRef = React.useRef<HTMLButtonElement>(null)
    const pendingAction = React.useRef<PendingAction | null>(null)
    const router = useRouter()
    const user = useUser()
    if (usesRegionalShell(user.data)) return null
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild ref={triggerRef}>
                {children}
            </DropdownMenuTrigger>

            <DropdownMenuContent
                align="start"
                collisionPadding={8}
                className="z-110 w-[min(22rem,calc(100vw-1rem))] rounded-3xl p-2.5"
                onCloseAutoFocus={event => {
                    const action = pendingAction.current
                    pendingAction.current = null
                    if (!action) return
                    event.preventDefault()
                    // Wait for the menu to close before opening a dialog or navigating.
                    if ("entity" in action) openQuickAdd(action.entity, triggerRef.current)
                    else router.push(action.href)
                    onAction?.()
                }}
            >
                <DropdownMenuGroup aria-label="Generate">
                    <DropdownMenuLabel className="px-3 pt-2 pb-1.5 text-xs font-semibold text-muted-foreground">Generate</DropdownMenuLabel>
                    <MonthlyReportItem onSelect={href => { pendingAction.current = { href } }} />
                    <ReportUploadsItem onSelect={href => { pendingAction.current = { href } }} />
                    {generateLinks.map(action => (
                        <LauncherItem key={action.href} {...action} onSelect={() => { pendingAction.current = { href: action.href } }} />
                    ))}
                </DropdownMenuGroup>

                <DropdownMenuSeparator className="mx-2 my-2 bg-border-subtle" />

                <DropdownMenuGroup aria-label="Records">
                    <DropdownMenuLabel className="px-3 pt-1.5 pb-1.5 text-xs font-semibold text-muted-foreground">Records</DropdownMenuLabel>
                    {actions.filter(action => action.key !== "assembly" || user.data?.can_create_assembly).map(action => (
                        <LauncherItem
                            key={action.key}
                            label={action.label}
                            description={action.description}
                            icon={action.icon}
                            onSelect={() => { pendingAction.current = { entity: action.key } }}
                        />
                    ))}
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

function LauncherItem({ label, description, icon: Icon, disabled, onSelect }: {
    label: string
    description: string
    icon: LucideIcon
    disabled?: boolean
    onSelect: () => void
}) {
    return (
        <DropdownMenuItem textValue={label} disabled={disabled} onSelect={onSelect}
            className="h-auto min-h-16 gap-3 rounded-xl px-3 py-2.5">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-assembly-theme-500/15 text-assembly-theme-600 dark:text-assembly-theme-400">
                <Icon aria-hidden="true" strokeWidth={1.75} className="size-5 text-inherit" />
            </span>
            <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold text-foreground">{label}</span>
                <span className="block text-xs leading-relaxed text-muted-foreground">{description}</span>
            </span>
            <ChevronRight aria-hidden="true" strokeWidth={1.75} className="size-4 shrink-0 text-muted-foreground" />
        </DropdownMenuItem>
    )
}

function MonthlyReportItem({ onSelect }: { onSelect: (href: string) => void }) {
    const reportQuery = useCurrentReport()
    const report = reportQuery.data
    const href = report?.id ? createMonthlyReportHref(getMonthlyReportResumeSection(report), { report_id: report.id }) : "/record-center"

    return <LauncherItem
        label="Monthly Report"
        description="Create a new monthly report"
        icon={FileText}
        disabled={reportQuery.isLoading}
        onSelect={() => onSelect(href)}
    />
}

function ReportUploadsItem({ onSelect }: { onSelect: (href: string) => void }) {
    const reportQuery = useCurrentReport()
    return <LauncherItem
        label="Uploads"
        description="Excel & OCR report uploads"
        icon={UploadCloud}
        disabled={reportQuery.isLoading}
        onSelect={() => onSelect(getMonthlyReportUploadHref(reportQuery.data))}
    />
}
