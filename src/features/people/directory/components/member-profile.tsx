import { MailIcon, MoreHorizontalIcon, PhoneIcon } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { Member } from "@/features/people/members/schemas/member"
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
    formatEntityDate,
    getInitials,
} from "../../shared/master-detail"
import type { DirectoryTab } from "../config/directory-view.config"

export function MemberProfileHeader({ member, assemblyName }: { member: Member; assemblyName?: string }) {
    return (
        <EntityProfileHeader
            avatar={(
                <Avatar className="size-16">
                    {member.avatar ? <AvatarImage src={member.avatar} alt="" /> : null}
                    <AvatarFallback className="text-lg font-semibold">{getInitials(member.full_name)}</AvatarFallback>
                </Avatar>
            )}
            title={member.full_name}
            status="Active member"
            facts={[
                { label: "Phone", value: displayValue(member.phone_number) },
                { label: "Email", value: displayValue(member.email) },
                { label: "Member since", value: formatEntityDate(member.membersince) },
                { label: "Assembly", value: assemblyName ?? `Assembly #${member.assembly}` },
            ]}
            actions={(
                <>
                    {member.email ? <Button asChild size="sm" variant="outline"><a href={`mailto:${member.email}`}><MailIcon aria-hidden="true" className="size-4" /> Message</a></Button> : null}
                    {member.phone_number ? <Button asChild size="sm" variant="outline"><a href={`tel:${member.phone_number}`}><PhoneIcon aria-hidden="true" className="size-4" /> Call</a></Button> : null}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild><Button size="icon" variant="ghost" aria-label="More member actions"><MoreHorizontalIcon className="size-4" /></Button></DropdownMenuTrigger>
                        <DropdownMenuContent align="end"><DropdownMenuItem disabled>More actions are not available</DropdownMenuItem></DropdownMenuContent>
                    </DropdownMenu>
                </>
            )}
        />
    )
}

function memberActivity(member: Member) {
    return [
        { id: "updated", title: "Profile updated", date: member.updated_at },
        { id: "created", title: "Profile created", date: member.created_at },
        ...(member.membersince ? [{ id: "joined", title: "Joined the assembly", date: member.membersince }] : []),
    ]
}

export function MemberOverview({ member, assemblyName, showNotes }: { member: Member; assemblyName?: string; showNotes: boolean }) {
    const groupCount = member.ministries.length + member.positions.length
    return (
        <div className="space-y-4">
            <EntityMetricGrid className="xl:grid-cols-5">
                <EntityMetricCard label="Attendance rate" value="—" />
                <EntityMetricCard label="Last attended" value="—" />
                <EntityMetricCard label="Giving YTD" value="—" />
                <EntityMetricCard label="Groups & ministry" value={groupCount} />
                <EntityMetricCard label="Member since" value={formatEntityDate(member.membersince)} />
            </EntityMetricGrid>
            <EntityOverviewGrid>
                <EntityTrendPanel />
                <EntityInfoPanel title="Member information" items={[
                    { label: "Full name", value: member.full_name },
                    { label: "Date of birth", value: formatEntityDate(member.date_of_birth) },
                    { label: "Gender", value: member.gender },
                    { label: "Relationship", value: displayValue(member.relationship) },
                    { label: "Occupation", value: displayValue(member.occupation) },
                    { label: "Assembly", value: assemblyName ?? `Assembly #${member.assembly}` },
                    { label: "Address", value: displayValue([member.address, member.city, member.province, member.country].filter(Boolean).join(", ")) },
                    { label: "Emergency contact", value: displayValue(member.emergency_contact_name) },
                ]} />
                <EntityActivityTimeline items={memberActivity(member)} />
                {showNotes ? <EntityNotesPanel notes={member.notes} title="Notes preview" /> : null}
            </EntityOverviewGrid>
        </div>
    )
}

export function MemberTabContent({ member, tab }: { member: Member; tab: DirectoryTab }) {
    if (tab === "groups") {
        const groups = [...member.positions, ...member.ministries]
        return <EntityInfoPanel title="Groups & ministry" items={groups.length ? groups.map((value, index) => ({ label: `Assignment ${index + 1}`, value })) : [{ label: "Assignments", value: "No groups or ministry assignments recorded." }]} />
    }
    if (tab === "activity") return <EntityActivityTimeline items={memberActivity(member)} />
    if (tab === "notes") return <EntityNotesPanel notes={member.notes} />
    const descriptions: Partial<Record<DirectoryTab, string>> = {
        attendance: "Per-member attendance history is not exposed by the current API.",
        giving: "Per-member giving totals are not exposed by the current profile API.",
        documents: "Member documents are not exposed by the current API.",
    }
    return <EntityUnavailablePanel title={tab[0].toUpperCase() + tab.slice(1)} description={descriptions[tab] ?? "No data is available for this section."} />
}
