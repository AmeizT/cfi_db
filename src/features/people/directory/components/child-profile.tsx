import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import type { ChildDirectoryRow } from "@/features/people/children/schema"
import {
    displayValue,
    EntityActivityTimeline,
    EntityInfoPanel,
    EntityMetricCard,
    EntityMetricGrid,
    EntityOverviewGrid,
    EntityProfileHeader,
    EntityUnavailablePanel,
    formatEntityDate,
    getInitials,
} from "../../shared/master-detail"
import type { DirectoryTab } from "../config/directory-view.config"

export function ChildProfileHeader({ child, assemblyName }: { child: ChildDirectoryRow; assemblyName?: string }) {
    return (
        <EntityProfileHeader
            avatar={<Avatar className="size-16"><AvatarFallback className="text-lg font-semibold">{getInitials(child.full_name)}</AvatarFallback></Avatar>}
            title={child.full_name}
            status="Child member"
            facts={[
                { label: "Age", value: `${child.age} years` },
                { label: "Guardian", value: displayValue(child.guardian_name) },
                { label: "Member since", value: formatEntityDate(child.membersince) },
                { label: "Assembly", value: assemblyName ?? `Assembly #${child.church}` },
            ]}
        />
    )
}

export function ChildOverview({ child, assemblyName }: { child: ChildDirectoryRow; assemblyName?: string }) {
    const activity = [
        { id: "updated", title: "Profile updated", date: child.updated_at },
        { id: "created", title: "Profile created", date: child.created_at },
        { id: "joined", title: "Joined the assembly", date: child.membersince },
    ]
    return (
        <div className="space-y-4">
            <EntityMetricGrid>
                <EntityMetricCard label="Age" value={child.age} />
                <EntityMetricCard label="Attendance rate" value="—" />
                <EntityMetricCard label="Last attended" value="—" />
                <EntityMetricCard label="Member since" value={formatEntityDate(child.membersince)} />
            </EntityMetricGrid>
            <EntityOverviewGrid>
                <EntityInfoPanel title="Member information" items={[
                    { label: "Full name", value: child.full_name },
                    { label: "Date of birth", value: formatEntityDate(child.date_of_birth) },
                    { label: "Gender", value: child.gender },
                    { label: "Guardian", value: displayValue(child.guardian_name) },
                    { label: "Guardian relationship", value: displayValue(child.guardian_relationship) },
                    { label: "Assembly", value: assemblyName ?? `Assembly #${child.church}` },
                ]} />
                <EntityActivityTimeline items={activity} />
            </EntityOverviewGrid>
        </div>
    )
}

export function ChildTabContent({ child, tab }: { child: ChildDirectoryRow; tab: DirectoryTab }) {
    if (tab === "activity") return <EntityActivityTimeline items={[
        { id: "updated", title: "Profile updated", date: child.updated_at },
        { id: "created", title: "Profile created", date: child.created_at },
    ]} />
    return <EntityUnavailablePanel title={tab[0].toUpperCase() + tab.slice(1)} description={`No ${tab} data is exposed for child profiles by the current API.`} />
}
