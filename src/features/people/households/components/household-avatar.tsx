import { UsersIcon } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { Household, HouseholdDetail } from "../../families/schema"
import { getInitials } from "../../shared/master-detail"

export function HouseholdAvatar({ household, large = false }: { household: Household | HouseholdDetail; large?: boolean }) {
    const members = "members" in household ? household.members.slice(0, 3) : []
    if (!members.length) {
        return <Avatar className={large ? "size-16" : "size-10"}><AvatarFallback>{large ? <UsersIcon className="size-6" /> : getInitials(household.name)}</AvatarFallback></Avatar>
    }
    return (
        <div className={`flex items-center ${large ? "w-24" : "w-14"}`} aria-label={`${household.name} member photos`}>
            {members.map((member, index) => (
                <Avatar key={member.member_key} className={`${large ? "size-14" : "size-9"} border-2 border-background ${index ? "-ml-4" : ""}`}>
                    {member.avatar ? <AvatarImage src={member.avatar} alt="" /> : null}
                    <AvatarFallback>{getInitials(member.member_full_name)}</AvatarFallback>
                </Avatar>
            ))}
        </div>
    )
}
