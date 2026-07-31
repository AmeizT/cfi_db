import { getMetaData } from "@/config/metadata"
import { ModulePageView } from "@/features/modules/views/ModulePageView"

export const metadata = getMetaData({ title: "Former Members" })

export default function FormerMembersDirectoryPage() {
    return <ModulePageView section="members" page="directory" subpage="former" />
}
