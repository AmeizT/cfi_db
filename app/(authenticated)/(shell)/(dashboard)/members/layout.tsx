import type { ReactNode } from "react"
import { MembersWorkspace } from "@/features/people/members/components/MembersWorkspace"

export default function MembersLayout({ children }: { children: ReactNode }) {
    return <MembersWorkspace>{children}</MembersWorkspace>
}
