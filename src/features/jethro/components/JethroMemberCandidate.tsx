import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import type { JethroMemberCandidate as Candidate } from "../schemas/jethro"

export function JethroMemberCandidate({ member, disabled, onSelect }: {
    member: Candidate
    disabled: boolean
    onSelect: () => void
}) {
    const initials = member.full_name.split(" ").slice(0, 2).map((word) => word[0]).join("")
    return (
        <Button
            type="button"
            variant="outline"
            className="h-auto w-full justify-start gap-3 p-3 text-left"
            disabled={disabled}
            onClick={onSelect}
        >
            <Avatar className="size-9 shrink-0">
                {member.avatar && <AvatarImage src={member.avatar} alt="" />}
                <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <span className="min-w-0 flex-1">
                <span className="block truncate font-medium">{member.full_name}</span>
                <span className="block truncate text-xs font-normal text-muted-foreground">
                    {member.member_number} · {member.membership_status}
                    {member.gender ? ` · ${member.gender}` : ""}
                </span>
                <span className="block truncate text-xs font-normal text-muted-foreground">{member.assembly_name}</span>
            </span>
        </Button>
    )
}
