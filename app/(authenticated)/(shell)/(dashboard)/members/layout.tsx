import type { ReactNode } from "react"
import { MembersSectionNavigation } from "@/features/people/members/components/MembersSectionNavigation"

export default function MembersLayout({ children }: { children: ReactNode }) {
    return (
        <div className="flex h-full min-h-0 flex-col">
            <MembersSectionNavigation />
            <div className="min-h-0 flex-1">{children}</div>
        </div>
    )
}
