import { getMetaData } from "@/config/metadata"
import { RegionalUsersView } from "@/features/administration/regional/views/RegionalUsersView"

const meta = getMetaData({ title: "Regional Users" })
export const metadata = { ...meta }

export default function RegionalUsersPage() {
    return <RegionalUsersView />
}
