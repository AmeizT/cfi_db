import Link from "next/link"
import { MailIcon, MoreHorizontalIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { Household, HouseholdDetail } from "../../families/schema"
import {
    displayValue,
    EntityActivityTimeline,
    EntityInfoPanel,
    EntityMetricCard,
    EntityMetricGrid,
    EntityNotesPanel,
    EntityOverviewGrid,
    EntityProfileHeader,
    EntityTrendPanel,
    EntityUnavailablePanel,
    getInitials,
} from "../../shared/master-detail"
import type { HouseholdTab } from "../config/households-view.config"
import { HouseholdAvatar } from "./household-avatar"
import { HouseholdFormDialog } from "./household-form-dialog"

function isDetail(household: Household | HouseholdDetail): household is HouseholdDetail {
    return "members" in household
}

function householdActivity(household: Household | HouseholdDetail) {
    const members = isDetail(household) ? household.members : []
    return [
        { id: "updated", title: "Household updated", date: household.updated_at },
        ...members.slice(0, 3).map((member) => ({ id: `joined-${member.id}`, title: `${member.member_full_name} joined the household`, description: member.role, date: member.joined_on })),
        { id: "created", title: "Household created", date: household.created_at },
    ]
}

export function HouseholdProfileHeader({ household, canManage }: { household: Household | HouseholdDetail; canManage: boolean }) {
    return (
        <EntityProfileHeader
            avatar={<HouseholdAvatar household={household} large />}
            title={household.name}
            status={household.status === "active" ? "Active household" : `${household.status} household`}
            statusVariant={household.status === "active" ? "secondary" : "outline"}
            facts={[
                { label: "Address", value: displayValue(household.location) },
                { label: "Primary contact", value: displayValue(household.head_of_household) },
                { label: "Phone", value: displayValue(household.phone_number) },
                { label: "Assembly", value: isDetail(household) ? household.assembly_name : `Assembly #${household.assembly}` },
            ]}
            actions={(
                <>
                    {canManage ? <HouseholdFormDialog household={household} /> : null}
                    {household.email ? <Button asChild size="sm" variant="outline"><a href={`mailto:${household.email}`}><MailIcon aria-hidden="true" className="size-4" /> Message</a></Button> : null}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild><Button size="icon" variant="ghost" aria-label="More household actions"><MoreHorizontalIcon className="size-4" /></Button></DropdownMenuTrigger>
                        <DropdownMenuContent align="end"><DropdownMenuItem disabled>No additional actions available</DropdownMenuItem></DropdownMenuContent>
                    </DropdownMenu>
                </>
            )}
        />
    )
}

export function HouseholdMembersPanel({ household }: { household: Household | HouseholdDetail }) {
    const members = isDetail(household) ? household.members : []
    return (
        <section className="rounded-lg border border-border-subtle bg-card p-4">
            <h2 className="font-semibold text-foreground">Household members</h2>
            {members.length ? (
                <div className="mt-3 divide-y divide-border-subtle">
                    {members.map((member) => (
                        <Link
                            key={member.member_key}
                            href={`/members/directory?segment=all&selected=${encodeURIComponent(member.member_key)}`}
                            className="flex items-center gap-3 rounded-md px-2 py-3 outline-none hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring"
                        >
                            <Avatar className="size-9">
                                {member.avatar ? <AvatarImage src={member.avatar} alt="" /> : null}
                                <AvatarFallback>{getInitials(member.member_full_name)}</AvatarFallback>
                            </Avatar>
                            <div className="min-w-0 flex-1"><div className="truncate text-sm font-medium text-foreground">{member.member_full_name}</div><div className="text-xs capitalize text-muted-foreground">{member.role.replaceAll("_", " ")}</div></div>
                            {member.is_primary_contact ? <span className="text-xs font-medium text-primary">Primary</span> : null}
                        </Link>
                    ))}
                </div>
            ) : <p className="mt-3 text-sm text-muted-foreground">No active household members are recorded.</p>}
        </section>
    )
}

export function HouseholdOverview({ household, showNotes }: { household: Household | HouseholdDetail; showNotes: boolean }) {
    return (
        <div className="space-y-4">
            <EntityMetricGrid className="xl:grid-cols-5">
                <EntityMetricCard label="Total members" value={household.active_member_count} />
                <EntityMetricCard label="Children" value={isDetail(household) ? household.minor_count : "—"} />
                <EntityMetricCard label="Attendance rate" value="—" />
                <EntityMetricCard label="Giving YTD" value="—" />
                <EntityMetricCard label="Primary assembly" value={isDetail(household) ? household.assembly_name : `#${household.assembly}`} />
            </EntityMetricGrid>
            <EntityOverviewGrid>
                <HouseholdMembersPanel household={household} />
                <EntityTrendPanel title="Household attendance trend" />
                <EntityInfoPanel title="Household information" items={[
                    { label: "Household name", value: household.name },
                    { label: "Status", value: household.status },
                    { label: "Primary contact", value: displayValue(household.head_of_household) },
                    { label: "Phone", value: displayValue(household.phone_number) },
                    { label: "Email", value: displayValue(household.email) },
                    { label: "Address", value: displayValue(household.location) },
                ]} />
                <EntityActivityTimeline items={householdActivity(household)} />
                {showNotes ? <EntityNotesPanel notes={household.notes} title="Notes preview" /> : null}
            </EntityOverviewGrid>
        </div>
    )
}

export function HouseholdTabContent({ household, tab }: { household: Household | HouseholdDetail; tab: HouseholdTab }) {
    if (tab === "members") return <HouseholdMembersPanel household={household} />
    if (tab === "activity") return <EntityActivityTimeline items={householdActivity(household)} />
    if (tab === "notes") return <EntityNotesPanel notes={household.notes} />
    return <EntityUnavailablePanel title={tab[0].toUpperCase() + tab.slice(1)} description={`Per-household ${tab} data is not exposed by the current API.`} />
}
