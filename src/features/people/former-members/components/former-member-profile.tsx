"use client"

import * as React from "react"
import Link from "next/link"
import { HistoryIcon, RotateCcwIcon } from "lucide-react"
import { toast } from "sonner"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { APP_ROUTES } from "@/config/app-routes"
import { useReadmitFormerMember } from "../hooks"
import type { FormerMember, FormerMemberDetail } from "../schema"
import {
    displayValue,
    EntityActivityTimeline,
    EntityInfoPanel,
    EntityMetricCard,
    EntityMetricGrid,
    EntityNotesPanel,
    EntityOverviewGrid,
    EntityProfileHeader,
    EntityUnavailablePanel,
    formatEntityDate,
    getInitials,
} from "../../shared/master-detail"
import type { DirectoryTab } from "../../directory/config/directory-view.config"

type FormerProfile = FormerMember & Partial<FormerMemberDetail>

function formerActivity(former: FormerProfile) {
    return [
        ...(former.transfer ? [{ id: "transfer", title: "Transfer recorded", description: `Transfer #${former.transfer}`, date: former.ended_on }] : []),
        { id: "ended", title: "Profile archived", description: former.end_reason || "Membership ended", date: former.ended_on },
        { id: "last-service", title: "Last service attended", description: "Attendance date is unavailable from the current API", date: null },
        { id: "joined", title: "Membership began", date: former.joined_on },
    ]
}

export function FormerMemberProfileHeader({ former, canManage }: { former: FormerProfile; canManage: boolean }) {
    const [restoreOpen, setRestoreOpen] = React.useState(false)
    const readmit = useReadmitFormerMember()
    return (
        <>
            <EntityProfileHeader
                avatar={(
                    <Avatar className="size-16">
                        {former.avatar ? <AvatarImage src={former.avatar} alt="" /> : null}
                        <AvatarFallback className="text-lg font-semibold">{getInitials(former.member_full_name)}</AvatarFallback>
                    </Avatar>
                )}
                title={former.member_full_name}
                status={former.has_been_readmitted ? "Readmitted" : "Former member"}
                statusVariant="outline"
                facts={[
                    { label: "Phone", value: displayValue(former.phone_number) },
                    { label: "Email", value: displayValue(former.email) },
                    { label: "Former assembly", value: former.former_assembly_name },
                    { label: "Date left", value: formatEntityDate(former.ended_on) },
                ]}
                actions={(
                    <>
                        {canManage && !former.has_been_readmitted ? <Button type="button" size="sm" onClick={() => setRestoreOpen(true)}><RotateCcwIcon aria-hidden="true" className="size-4" /> Restore</Button> : null}
                        <Button asChild size="sm" variant="outline"><Link href={`${APP_ROUTES.members.transfers}?search=${encodeURIComponent(former.member_full_name)}`}><HistoryIcon aria-hidden="true" className="size-4" /> Transfer history</Link></Button>
                    </>
                )}
            />
            <AlertDialog open={restoreOpen} onOpenChange={setRestoreOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Restore {former.member_full_name}?</AlertDialogTitle>
                        <AlertDialogDescription>This creates a new active assembly membership and preserves the former membership record for audit history.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={readmit.isPending}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            disabled={readmit.isPending}
                            onClick={(event) => {
                                event.preventDefault()
                                readmit.mutate(former.id, {
                                    onSuccess: () => { toast.success("Member restored successfully."); setRestoreOpen(false) },
                                    onError: (error) => toast.error(error.message),
                                })
                            }}
                        >{readmit.isPending ? "Restoring…" : "Restore member"}</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}

export function FormerMemberOverview({ former }: { former: FormerProfile }) {
    return (
        <div className="space-y-4">
            <EntityMetricGrid className="xl:grid-cols-5">
                <EntityMetricCard label="Exit reason" value={displayValue(former.end_reason)} />
                <EntityMetricCard label="Last attended" value="—" />
                <EntityMetricCard label="Member since" value={formatEntityDate(former.member_since ?? former.joined_on)} />
                <EntityMetricCard label="Former assembly" value={former.former_assembly_name} />
                <EntityMetricCard label="Household" value={displayValue(former.household_name)} />
            </EntityMetricGrid>
            <EntityOverviewGrid>
                <EntityActivityTimeline title="History & activity" items={formerActivity(former)} />
                <EntityInfoPanel title="Former member information" items={[
                    { label: "Full name", value: former.member_full_name },
                    { label: "Former assembly", value: former.former_assembly_name },
                    { label: "Joined", value: formatEntityDate(former.joined_on) },
                    { label: "Left", value: formatEntityDate(former.ended_on) },
                    { label: "Exit reason", value: displayValue(former.end_reason) },
                    { label: "Current assembly", value: displayValue(former.current_assembly_name) },
                ]} />
                <EntityNotesPanel notes={former.end_notes} title="Notes preview" />
            </EntityOverviewGrid>
        </div>
    )
}

export function FormerMemberTabContent({ former, tab }: { former: FormerProfile; tab: DirectoryTab }) {
    if (tab === "activity") return <EntityActivityTimeline title="History & activity" items={formerActivity(former)} />
    if (tab === "notes") return <EntityNotesPanel notes={former.end_notes} />
    return <EntityUnavailablePanel title={tab[0].toUpperCase() + tab.slice(1)} description={`No ${tab} data is exposed for former-member records by the current API.`} />
}
