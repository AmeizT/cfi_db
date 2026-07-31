import { getMetaData } from "@/config/metadata";
import { ModulePageView } from "@/features/modules/views/ModulePageView"

const meta = getMetaData({ title: "Directory" })
export const metadata = { ...meta }

export default function MembersPage() {
    return <ModulePageView section="members" page="directory" subpage="adults" />
}
