import { getMetaData } from "@/config/metadata";
import { MembersView } from "@/features/people/members/views/MembersView"

const meta = getMetaData({ title: "Directory" })
export const metadata = { ...meta }

export default function MembersPage() {
    return <MembersView />
}
