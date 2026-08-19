import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { ChildDirectoryRow } from "@/features/people/children/schema"
import type { Member } from "@/features/people/members/schemas/member"
import { EntityListItem, getInitials } from "../../shared/master-detail"

function memberRoles(member: Member) {
    return [...member.positions, ...member.ministries].filter(Boolean).join(", ") || "Member"
}

export function DirectoryMemberListItem({ member, selected }: { member: Member; selected: boolean }) {
    return (
        <EntityListItem
            selected={selected}
            leading={(
                <Avatar className="size-10">
                    {member.avatar ? <AvatarImage src={member.avatar} alt="" /> : null}
                    <AvatarFallback>{getInitials(member.full_name)}</AvatarFallback>
                </Avatar>
            )}
            title={member.full_name}
            description={`${member.gender} · ${member.age ?? "Age unavailable"}`}
            meta={memberRoles(member)}
            aria-label={`Open ${member.full_name}'s profile`}
        />
    )
}

export function DirectoryChildListItem({ child, selected }: { child: ChildDirectoryRow; selected: boolean }) {
    return (
        <EntityListItem
            selected={selected}
            leading={<Avatar className="size-10"><AvatarFallback>{getInitials(child.full_name)}</AvatarFallback></Avatar>}
            title={child.full_name}
            description={`${child.gender} · ${child.age} years`}
            meta={child.guardian_name ? `Guardian: ${child.guardian_name}` : "Guardian not recorded"}
            aria-label={`Open ${child.full_name}'s profile`}
        />
    )
}
