import { getMetaData } from "@/config/metadata";
import { FormerMembersView } from "@/features/people/former-members/views/FormerMembersView"

const meta = getMetaData({ title: "Former Members" })
export const metadata = { ...meta }

export default function FormerMembersPage() {
    return <FormerMembersView />
}